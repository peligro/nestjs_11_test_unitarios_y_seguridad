import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { CategoryService } from './servicios/category/category.service';
import { ProductService } from './servicios/product/product.service';
import { ProductController } from './controller/product/product.controller';
import { CategoryController } from './controller/category/category.controller';

@Module({
     imports:[
        TypeOrmModule.forFeature([Category, Product]),
    ],
     providers: [CategoryService, ProductService],
     controllers: [ProductController, CategoryController],
})
export class ProductsModule {}
