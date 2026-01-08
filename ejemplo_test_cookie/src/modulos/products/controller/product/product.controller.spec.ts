import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from '../../servicios/product/product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { ConfigService } from '@nestjs/config';
import { createMockConfigService, expectHttpExceptionMessage } from '../../../../../test/mocks/mock-config-service';
import { createMockRepository } from '../../../../../test/mocks/mock-repositories';
import { mockCategory, mockDatadtoProduct, mockDataProduct, mockDataProductDuplicate, mockDataProducts } from '../../../../../test/mocks/mock-data';
import { TEST_MESSAGES } from '../../../../../test/mocks/test-messages';
import { Category } from '../../entities/category.entity';
import slugify from 'slugify';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;
  let productRepo: jest.Mocked<any>;
  let categoryRepo: jest.Mocked<any>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: createMockRepository<Product>(),
        }, {
          provide: getRepositoryToken(Category),
          useValue: createMockRepository<Category>(),
        },
        {
          provide: ConfigService,
          useValue: createMockConfigService(),
        },
      ],
    }).compile();
    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
    productRepo = module.get(getRepositoryToken(Product));
    categoryRepo = module.get(getRepositoryToken(Category));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  //valido método index
  describe('findAll', () => {
    it('debe devolver todas las categorías ordenadas por id DESC', async () => {

      productRepo.find.mockResolvedValue(mockDataProducts);

      const result = await service.findAll();

      expect(result).toEqual(mockDataProducts);
      expect(productRepo.find).toHaveBeenCalledWith({
        order: { id: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a category when it exists', async () => {

      productRepo.findOneBy.mockResolvedValue(mockDataProduct);

      const result = await service.findOne(1);

      expect(result).toEqual(mockDataProduct);
      expect(productRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an exception when category does not exist', async () => {
      productRepo.findOneBy.mockResolvedValue(null);

      await expectHttpExceptionMessage(
        service.findOne(999),
        TEST_MESSAGES.NOT_FOUND,
      );
    });
  });

  describe('create', () => {
    it('should create a new product when name does not exist', async () => {
      const slug = slugify(mockDatadtoProduct.name, { lower: true, strict: true });
      productRepo.findOne.mockResolvedValue(null); // no existe
      categoryRepo.findOne.mockResolvedValue(mockCategory); // categoría sí existe
      productRepo.create.mockReturnValue(mockDataProduct);
      productRepo.save.mockResolvedValue(mockDataProduct);

      const result = await service.create(mockDatadtoProduct);

      expect(result).toEqual({
        state: 'ok',
        message: TEST_MESSAGES.SUCCESS,
      });

      expect(productRepo.findOne).toHaveBeenCalledWith({
        where: { name: mockDatadtoProduct.name },
      });

      expect(productRepo.create).toHaveBeenCalledWith({
        name: mockDatadtoProduct.name,
        slug,
        description: mockDatadtoProduct.description,
        picture: mockDatadtoProduct.picture,
        category_id: mockCategory,
        isActive: true,
      });

      expect(productRepo.save).toHaveBeenCalledWith(mockDataProduct);
    });

    it('should throw if product name already exists', async () => {

      productRepo.findOne.mockResolvedValue(mockDataProduct);

      await expectHttpExceptionMessage(
        service.create(mockDatadtoProduct),
        TEST_MESSAGES.ALREADY_EXISTS,
      );
    });

    it('should throw on database error during save', async () => {
      productRepo.findOne.mockResolvedValue(null);
      productRepo.save.mockRejectedValue(new Error('DB error'));

      await expectHttpExceptionMessage(
        service.create(mockDatadtoProduct),
        TEST_MESSAGES.ERROR,
      );
    });


  });
  describe('update', () => {
    it('should update product when ID exists and name is not duplicated', async () => {
      const id = 1;
      const dto = {
        name: 'New Name',
        description: "Descripción con ñandú",
        picture: "https://dummyimage.com/300x300/000/fff.png&text=laser  ",
        category_id: 1,
        isActive: true
      };

      const existing = {
        id: 1,
        name: 'Old Name',
        slug: 'old-name',
        description: "Autonivelante, 10 m",
        picture: "https://dummyimage.com/300x300/000/fff.png&text=laser  ",
        category_id: mockCategory,
        isActive: true
      };

      // Simulamos que el producto existe
      productRepo.findOne
        .mockResolvedValueOnce(existing) // Primera llamada: buscar por id
        .mockResolvedValueOnce(null);    // Segunda llamada: buscar por nombre (para verificar duplicado)

      // ✅ Simulamos que la categoría existe (¡esto faltaba!)
      categoryRepo.findOne.mockResolvedValue(mockCategory);

      // Simulamos que la actualización fue exitosa
      productRepo.update.mockResolvedValue(undefined);

      const result = await service.update(id, dto);

      expect(result).toEqual({
        state: 'ok',
        message: TEST_MESSAGES.UPDATE,
      });

      expect(productRepo.update).toHaveBeenCalledWith(id, {
        name: dto.name,
        slug: 'new-name', // slugify('New Name', { lower: true, strict: true }) → 'new-name'
        description: dto.description,
        picture: dto.picture,
        category_id: mockCategory,
        isActive: true,
      });
    });
    it('should throw if product to update does not exist', async () => {
      productRepo.findOne.mockResolvedValueOnce(null);

      await expectHttpExceptionMessage(
        service.update(999, {
          name: 'New Name',
          description: "Descripción con ñandú",
          picture: "https://dummyimage.com/300x300/000/fff.png&text=laser  ",
          category_id: 1,
          isActive: true
        }),
        TEST_MESSAGES.NOT_FOUND,
      );
    });

    it('should throw if new name already exists', async () => {

      productRepo.findOne
        .mockResolvedValueOnce(mockDataProduct)
        .mockResolvedValueOnce(mockDataProductDuplicate);

      await expectHttpExceptionMessage(
        service.update(1, {
          name: 'New',
          description: "Descripción con ñandú",
          picture: "https://dummyimage.com/300x300/000/fff.png&text=laser  ",
          category_id: 1,
          isActive: true
        }),
        TEST_MESSAGES.ALREADY_EXISTS,
      );
    });

    it('should allow updating with the same name (no duplicate check)', async () => {



      // Simula que el producto existe
      productRepo.findOne.mockResolvedValueOnce(mockDataProduct);

      // ✅ ¡CRÍTICO! Simula que la categoría existe
      categoryRepo.findOne.mockResolvedValue(mockCategory);

      // Simula actualización exitosa
      productRepo.update.mockResolvedValue(undefined);

      // Llama con `dto`, no con `mockDatadtoProduct` (para evitar confusión)
      const result = await service.update(1, mockDatadtoProduct);

      expect(result).toEqual({
        state: 'ok',
        message: TEST_MESSAGES.UPDATE,
      });

      // Verifica que se actualizó con los datos correctos
      expect(productRepo.update).toHaveBeenCalledWith(1, {
        name: mockDatadtoProduct.name,
        slug: 'same', // mismo slug porque el nombre no cambia
        description: mockDatadtoProduct.description,
        picture: mockDatadtoProduct.picture,
        category_id: mockCategory, // ← entidad completa, no solo el ID
        isActive: mockDatadtoProduct.isActive,
      });
    });


  });
});
