import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from '../../servicios/product/product.service';
import { ProductDto } from '../../dto/product.dto';
@ApiTags('Product')
@Controller('product')
export class ProductController {

    constructor(private readonly repositorio: ProductService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async index() {
        return await this.repositorio.findAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async show(@Param('id', ParseIntPipe) id: number) {
        return await this.repositorio.findOne(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: ProductDto) {
        return await this.repositorio.create(dto);
    }
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    async update(@Param('id') id: number, @Body() dto: ProductDto) {
        return await this.repositorio.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id: number) {
        return await this.repositorio.remove(id);
    }
}
