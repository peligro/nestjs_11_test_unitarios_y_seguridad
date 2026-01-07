import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../entities/product.entity';
import { createMockConfigService } from '../../../../../test/mocks/mock-config-service';
import { createMockRepository } from '../../../../../test/mocks/mock-repositories';
import { mockDataProduct } from '../../../../../test/mocks/mock-data';

describe('ProductService', () => {
  let service: ProductService; 
  let productRepo: jest.Mocked<any>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<ProductService>(ProductService);
    productRepo = module.get(getRepositoryToken(Product));
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
     
      productRepo.find.mockResolvedValue(mockDataProduct);

      const result = await service.findAll();

      expect(result).toEqual(mockDataProduct);
      expect(productRepo.find).toHaveBeenCalledWith({
        order: { id: 'desc' },
      });
    });
  });
});
