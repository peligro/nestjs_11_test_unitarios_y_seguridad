import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from '../../servicios/category/category.service';
import { CategoryDto } from '../../dto/category.dto';

@Controller('category')
export class CategoryController {
    constructor(private readonly repositorio: CategoryService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    index(): {} {
        return this.repositorio.findAll();
    }

    @Get(':id') 
    @HttpCode(HttpStatus.OK)
    show(@Param() params): {} { 
    return this.repositorio.findOne(params.id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CategoryDto)
    {
        return this.repositorio.create(dto);
    }
    @Put(':id')
    @HttpCode(HttpStatus.OK)
    update(@Param('id') id: number, @Body() dto: CategoryDto) {
        return this.repositorio.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    delete(@Param('id') id: number) {
        return this.repositorio.remove(id);
    }
}
