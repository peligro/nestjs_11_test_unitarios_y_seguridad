import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from '../../servicios/product/product.service';
@ApiTags('Product')
@Controller('product')
export class ProductController {

    constructor(private readonly repositorio: ProductService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async index() {
        return await this.repositorio.findAll();
    }
}
