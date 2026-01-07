import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../entities/category.entity';
import { Product } from '../../entities/product.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product)
        private readonly repository: Repository<Product>,
        private readonly configService: ConfigService,
    ) { }

    async findAll(): Promise<Product[]> {
    return await this.repository.find(
        {
            order:
            {
                id: "desc"
            }
        });
    }
}
