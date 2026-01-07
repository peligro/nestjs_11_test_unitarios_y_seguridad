import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CategoryService } from './category.service';
import { Category } from '../../entities/category.entity';
import { Product } from '../../entities/product.entity';
import { TEST_MESSAGES } from '../../../../../test/mocks/test-messages';
import { createMockRepository } from '../../../../../test/mocks/mock-repositories';
import { createMockConfigService, expectHttpExceptionMessage } from '../../../../../test/mocks/mock-config-service';
import { mockCategories } from '../../../../../test/mocks/mock-data';


 

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepo: jest.Mocked<any>;
  let productRepo: jest.Mocked<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(Category),
          useValue: createMockRepository<Category>(),
        },
        {
          provide: getRepositoryToken(Product),
          useValue: createMockRepository<Product>(),
        },
        {
          provide: ConfigService,
          useValue: createMockConfigService(),
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepo = module.get(getRepositoryToken(Category));
    productRepo = module.get(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryRepo).toBeDefined();
    expect(productRepo).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all categories ordered by id DESC', async () => {
      
      categoryRepo.find.mockResolvedValue(mockCategories);

      const result = await service.findAll();

      expect(result).toEqual(mockCategories);
      expect(categoryRepo.find).toHaveBeenCalledWith({
        order: { id: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a category when it exists', async () => {
      const mockCategory = { id: 1, name: 'Electronics', slug: 'electronics' };
      categoryRepo.findOneBy.mockResolvedValue(mockCategory);

      const result = await service.findOne(1);

      expect(result).toEqual(mockCategory);
      expect(categoryRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw an exception when category does not exist', async () => {
      categoryRepo.findOneBy.mockResolvedValue(null);

      await expectHttpExceptionMessage(
        service.findOne(999),
        TEST_MESSAGES.NOT_FOUND,
      );
    });
  });

  describe('create', () => {
    it('should create a new category when name does not exist', async () => {
      const dto = { name: 'Clothing' };
      const slug = 'clothing';
      const mockCategory = { id: 1, name: dto.name, slug };
      categoryRepo.findOne.mockResolvedValue(null);
      categoryRepo.create.mockReturnValue(mockCategory);
      categoryRepo.save.mockResolvedValue(mockCategory);

      const result = await service.create(dto);

      expect(result).toEqual({
        state: 'ok',
        message: TEST_MESSAGES.SUCCESS,
      });
      expect(categoryRepo.findOne).toHaveBeenCalledWith({
        where: { name: dto.name },
      });
      expect(categoryRepo.create).toHaveBeenCalledWith({
        name: dto.name,
        slug,
      });
      expect(categoryRepo.save).toHaveBeenCalledWith(mockCategory);
    });

    it('should throw if category name already exists', async () => {
      const dto = { name: 'Clothing' };
      const existing = { id: 1, name: 'Clothing', slug: 'clothing' };
      categoryRepo.findOne.mockResolvedValue(existing);

      await expectHttpExceptionMessage(
        service.create(dto),
        TEST_MESSAGES.ALREADY_EXISTS,
      );
    });

    it('should throw on database error during save', async () => {
      const dto = { name: 'Toys' };
      categoryRepo.findOne.mockResolvedValue(null);
      categoryRepo.save.mockRejectedValue(new Error('DB error'));

      await expectHttpExceptionMessage(
        service.create(dto),
        TEST_MESSAGES.ERROR,
      );
    });
  });

  describe('update', () => {
    it('should update category when ID exists and name is not duplicated', async () => {
      const id = 1;
      const dto = { name: 'New Name' };
      const existing = { id: 1, name: 'Old Name', slug: 'old-name' };
      categoryRepo.findOne
        .mockResolvedValueOnce(existing)
        .mockResolvedValueOnce(null);
      categoryRepo.update.mockResolvedValue(undefined);

      const result = await service.update(id, dto);

      expect(result).toEqual({
        state: 'ok',
        message: TEST_MESSAGES.UPDATE,
      });
      expect(categoryRepo.update).toHaveBeenCalledWith(id, {
        name: dto.name,
        slug: 'new-name',
      });
    });

    it('should throw if category to update does not exist', async () => {
      categoryRepo.findOne.mockResolvedValueOnce(null);

      await expectHttpExceptionMessage(
        service.update(999, { name: 'Any' }),
        TEST_MESSAGES.NOT_FOUND,
      );
    });

    it('should throw if new name already exists', async () => {
      const existing = { id: 1, name: 'Old', slug: 'old' };
      const duplicate = { id: 2, name: 'New', slug: 'new' };
      categoryRepo.findOne
        .mockResolvedValueOnce(existing)
        .mockResolvedValueOnce(duplicate);

      await expectHttpExceptionMessage(
        service.update(1, { name: 'New' }),
        TEST_MESSAGES.ALREADY_EXISTS,
      );
    });

    it('should allow updating with the same name (no duplicate check)', async () => {
      const existing = { id: 1, name: 'Same', slug: 'same' };
      categoryRepo.findOne.mockResolvedValueOnce(existing);
      categoryRepo.update.mockResolvedValue(undefined);

      const result = await service.update(1, { name: 'Same' });

      expect(result).toEqual({
        state: 'ok',
        message: TEST_MESSAGES.UPDATE,
      });
      expect(categoryRepo.update).toHaveBeenCalledWith(1, {
        name: 'Same',
        slug: 'same',
      });
    });
  });

  describe('remove', () => {
    it('should delete category if no products are associated', async () => {
      const category = { id: 1, name: 'ToDelete', slug: 'to-delete' };
      categoryRepo.findOne.mockResolvedValue(category);
      productRepo.findOne.mockResolvedValue(null);
      categoryRepo.delete.mockResolvedValue(undefined);

      const result = await service.remove(1);

      expect(result).toEqual({
        state: 'ok',
        message: TEST_MESSAGES.DELETE,
      });
      expect(categoryRepo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw if category does not exist', async () => {
      categoryRepo.findOne.mockResolvedValue(null);

      await expectHttpExceptionMessage(
        service.remove(999),
        TEST_MESSAGES.NOT_FOUND,
      );
    });

    it('should throw if category has associated products', async () => {
      const category = { id: 1, name: 'HasProducts', slug: 'has-products' };
      const product = { id: 1, name: 'Product', category_id: category } as any;
      categoryRepo.findOne.mockResolvedValue(category);
      productRepo.findOne.mockResolvedValue(product);

      await expectHttpExceptionMessage(
        service.remove(1),
        TEST_MESSAGES.CANNOT_DELETE,
      );
    });
  });
});