import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from '../../servicios/category/category.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockRepository } from '../../../../../test/mocks/mock-repositories';
import { Category } from '../../entities/category.entity';
import { Product } from '../../entities/product.entity';
import { ConfigService } from '@nestjs/config';
import { createMockConfigService } from '../../../../../test/mocks/mock-config-service';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;
  let categoryRepo: jest.Mocked<any>;
  let productRepo: jest.Mocked<any>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
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

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
    categoryRepo = module.get(getRepositoryToken(Category));
    productRepo = module.get(getRepositoryToken(Product));
  });
  //limpiar todos los mocks
   afterEach(() => {
    jest.clearAllMocks();
  });
  //valido la instancia del controlador
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  //valido método index
 describe('findAll', () => {
    it('debe devolver todas las categorías ordenadas por id DESC', async () => {
      const mockCategories = [
        { id: 2, name: 'Books', slug: 'books' },
        { id: 1, name: 'Electronics', slug: 'electronics' },
      ];
      categoryRepo.find.mockResolvedValue(mockCategories);

      const result = await service.findAll();

      expect(result).toEqual(mockCategories);
      expect(categoryRepo.find).toHaveBeenCalledWith({
        order: { id: 'desc' },
      });
    });
  });

});
