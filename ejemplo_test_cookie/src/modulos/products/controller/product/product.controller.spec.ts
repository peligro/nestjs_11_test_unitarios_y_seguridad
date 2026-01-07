import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from '../../servicios/product/product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { ConfigService } from '@nestjs/config';
import { createMockConfigService } from '../../../../../test/mocks/mock-config-service';
import { createMockRepository } from '../../../../../test/mocks/mock-repositories';
import { mockDataProduct } from '../../../../../test/mocks/mock-data';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService; 
  let productRepo: jest.Mocked<any>;

  beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [ProductController],
        providers: [
                ProductService,
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
      controller = module.get<ProductController>(ProductController);
      service = module.get<ProductService>(ProductService);
      productRepo = module.get(getRepositoryToken(Product));
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
         
          productRepo.find.mockResolvedValue(mockDataProduct);
    
          const result = await service.findAll();
    
          expect(result).toEqual(mockDataProduct);
          expect(productRepo.find).toHaveBeenCalledWith({
            order: { id: 'desc' },
          });
        });
      });
});
