import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../entities/category.entity';
import { Product } from '../../entities/product.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { getException } from '../../helpers/helpers';
import slugify from 'slugify';
import { ProductDto } from '../../dto/product.dto';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product)
        private readonly repository: Repository<Product>,
        @InjectRepository(Category)
        private readonly repositoryCategory: Repository<Category>,
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
    async findOne(id: number) {
        const data = await this.repository.findOneBy({ id });
        if (!data) {
            return getException(`${this.configService.get<string>('MESSAGE_CUSTOM_RESOURCE_NOT_AVAILABLE')}`);
        }
        return data;
    }
    async create(dto: ProductDto) {
        let existe = await this.repository.findOne(
            {
                where:
                {
                    name: dto.name
                }
            });
        if (existe) {
            return getException(`${this.configService.get<string>('MESSAGE_ALREADY_EXISTS')}`);
        }
        try {
            let category = await this.repositoryCategory.findOne(
                {
                    where:
                    {
                        id: dto.category_id
                    }
                });
            if (!category) 
            {
            return getException(`${this.configService.get<string>('MESSAGE_CUSTOM_ERROR')}`);
            }

            // Usar el constructor de la entidad
            const save = this.repository.create(
                {
                    name: dto.name,
                    slug: slugify(dto.name, { lower: true, strict: true }),
                    description: dto.description,
                    picture: dto.picture,
                    category_id: category,
                    isActive: true
                } as Product);

            await this.repository.save(save);
            return { "state": "ok", "message": `${this.configService.get<string>('MESSAGE_CUSTOM_SUCCESS')}` }
        } catch (error) {
            return getException(`${this.configService.get<string>('MESSAGE_CUSTOM_ERROR')}`);
        }


    }



    async update(id: number, dto: ProductDto) {
        const existe = await this.repository.findOne({
            where: { id: id }
        });

        if (!existe) {
            return getException(`${this.configService.get<string>('MESSAGE_CUSTOM_RESOURCE_NOT_AVAILABLE')}`);
        }

        // Verificar si el nuevo nombre ya existe (si es diferente al actual)
        if (dto.name && dto.name !== existe.name) {
            const existeNombre = await this.repository.findOne({
                where: { name: dto.name }
            });

            if (existeNombre) {
                return getException(`${this.configService.get<string>('MESSAGE_ALREADY_EXISTS')}`);
            }
        }
        try {
            let category = await this.repositoryCategory.findOne(
                {
                    where:
                    {
                        id: dto.category_id
                    }
                });
            if (!category) 
            {
            return getException(`${this.configService.get<string>('MESSAGE_CUSTOM_ERROR')}`);
            }
            await this.repository.update(id, {
                name: dto.name,
                slug: slugify(dto.name, { lower: true, strict: true }),
                description: dto.description,
                picture: dto.picture,
                category_id: category,
                isActive: dto.isActive
            });

            return { "state": "ok", "message": `${this.configService.get<string>('MESSAGE_CUSTOM_SUCCESS_UPDATE')}` }

        } catch (error) {
            return getException(`${this.configService.get<string>('MESSAGE_CUSTOM_ERROR')}`);
        }
    }

    async remove(id: number) {
        const record = await this.repository.findOne({ where: { id } });

        if (!record) {
            return getException(`${this.configService.get<string>('MESSAGE_CUSTOM_RESOURCE_NOT_AVAILABLE')}`);
        }

        try {
            await this.repository.delete(id);
            return { "state": "ok", "message": `${this.configService.get<string>('MESSAGE_CUSTOM_SUCCESS_DELETE')}` }
        } catch (error) {
            return getException(`${this.configService.get<string>('MESSAGE_CUSTOM_ERROR')}`);
        }

    }
}
