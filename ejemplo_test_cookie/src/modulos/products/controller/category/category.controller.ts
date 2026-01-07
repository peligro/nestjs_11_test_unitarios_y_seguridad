import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CategoryService } from '../../servicios/category/category.service';
import { CategoryDto } from '../../dto/category.dto';
import { ApiCategoryCreate, ApiCategoryDelete, ApiCategoryFindAll, ApiCategoryFindOne, ApiCategoryUpdate } from '../../swagger/category.swagger';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
    constructor(private readonly repositorio: CategoryService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiCategoryFindAll()
    async index(){
        return await this.repositorio.findAll();
    }

    @Get(':id') 
    @HttpCode(HttpStatus.OK)
    @ApiCategoryFindOne()
    async show(@Param('id', ParseIntPipe) id: number)
    {
        return await this.repositorio.findOne(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
     @ApiCategoryCreate()
    async create(@Body() dto: CategoryDto)
    {
        return await this.repositorio.create(dto);
    }
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @ApiCategoryUpdate()
    async update(@Param('id') id: number, @Body() dto: CategoryDto) {
        return await this.repositorio.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiCategoryDelete()
    async delete(@Param('id') id: number) {
        return await this.repositorio.remove(id);
    }
}
