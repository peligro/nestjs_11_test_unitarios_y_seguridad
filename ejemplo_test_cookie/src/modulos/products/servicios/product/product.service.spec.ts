import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { createMockConfigService, expectHttpExceptionMessage } from '../../../../../test/mocks/mock-config-service';
import { createMockRepository } from '../../../../../test/mocks/mock-repositories';
import { mockDataProduct, mockDataProducts } from '../../../../../test/mocks/mock-data';
import { TEST_MESSAGES } from '../../../../../test/mocks/test-messages';
import { Category } from '../../entities/category.entity';

describe('ProductService', () => {
  let service: ProductService; 
  let productRepo: jest.Mocked<any>;
  let categoryRepo: jest.Mocked<any>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
              ProductService,
              {
                provide: getRepositoryToken(Product),
                useValue: createMockRepository<Product>(),
              },{
                provide: getRepositoryToken(Category),
                useValue: createMockRepository<Category>(),
              },
              {
                provide: ConfigService,
                useValue: createMockConfigService(),
              },
            ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepo = module.get(getRepositoryToken(Product));
    categoryRepo = module.get(getRepositoryToken(Category));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productRepo).toBeDefined();
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
});
