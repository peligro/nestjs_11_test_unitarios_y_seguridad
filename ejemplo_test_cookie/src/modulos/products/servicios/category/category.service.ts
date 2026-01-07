import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryDto } from '../../dto/category.dto';
import { getException } from '../../helpers/helpers';
import slugify from 'slugify';
import { Product } from '../../entities/product.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly repository: Repository<Category>,
        @InjectRepository(Product)
        private readonly repositoryProduct: Repository<Product>,
    ) { }

    async findAll(): Promise<Category[]> {
        return await this.repository.find(
            {
                order:
                {
                    id: "desc"
                }
            });
    }

    async findOne(id: number) {
        const data = await this.repository.findOneBy({ id });
        if (!data) {
            return getException(`${process.env.MESSAGE_CUSTOM_RESOURCE_NOT_AVAILABLE}`);
        }
        return data;
    }

    async create(dto: CategoryDto) {
        let existe = await this.repository.findOne(
            {
                where:
                {
                    name: dto.name
                }
            });
        if (existe) {
            return getException(`${process.env.MESSAGE_ALREADY_EXISTS}`);
        } else {
            try {

                let save = this.repository.create({
                    name: dto.name,
                    slug: slugify(dto.name, { lower: true, strict: true })
                });

                await this.repository.save(save);
                return { "state": "ok", "message": `${process.env.MESSAGE_CUSTOM_SUCCESS}` }
            } catch (error) {
                return getException(`${process.env.MESSAGE_CUSTOM_ERROR}`);
            }

        }
    }



    async update(id: number, dto: CategoryDto) {
        const existe = await this.repository.findOne({
            where: { id: id }
        });

        if (!existe) {
            return getException(`${process.env.MESSAGE_CUSTOM_RESOURCE_NOT_AVAILABLE}`);
        }
        
        // Verificar si el nuevo nombre ya existe (si es diferente al actual)
        if (dto.name && dto.name !== existe.name) {
            const existeNombre = await this.repository.findOne({
                where: { name: dto.name }
            });

            if (existeNombre) {
                return getException(`${process.env.MESSAGE_ALREADY_EXISTS}`);
            }
        }
        try {

            await this.repository.update(id, {
                name: dto.name,
                slug: slugify(dto.name, { lower: true, strict: true })
            });

        return { "state": "ok", "message": `${process.env.MESSAGE_CUSTOM_SUCCESS_UPDATE}` }

        } catch (error) {
            return getException(`${process.env.MESSAGE_CUSTOM_ERROR}`);
        }
    }

    async remove(id: number) {
        const category = await this.repository.findOne({ where: { id } });

        if (!category) {
            return getException(`${process.env.MESSAGE_CUSTOM_RESOURCE_NOT_AVAILABLE}`);
        }
        let existe = await this.repositoryProduct.findOne(
            {
                where:
                {
                    category_id: category
                }
            });
        if(existe)
        {
            return getException(`${process.env.MESSAGE_CANNOT_BE_DELETED}`);
        }
        try {
            await this.repository.delete(id);
            return { "state": "ok", "message": `${process.env.MESSAGE_CUSTOM_SUCCESS_DELETE}` }
        } catch (error) {
            return getException(`${process.env.MESSAGE_CUSTOM_ERROR}`);
        }

    }
}
