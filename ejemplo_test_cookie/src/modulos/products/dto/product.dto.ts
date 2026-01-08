import { IsBoolean, isBoolean, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class ProductDto
{
    @ApiProperty({
    description: `Name category`,
    example: 'Category 1',
    })
    @IsNotEmpty({message: `${process.env.MESSAGE_ERROR_NAME_IS_EMPTY}`})
    name: string;

    @ApiProperty({
    description: `Description product`,
    example: 'Description 1',
    })
    @IsNotEmpty({message: `${process.env.MESSAGE_ERROR_DESCRIPTION_IS_EMPTY}`})
    description: string;

    @ApiProperty({
    description: `Picture`,
    example: 'foto',
    })
    @IsNotEmpty({message: `picture vacía`})
    picture: string;

    @ApiProperty({
    description: `Category_id`,
    example: 1,
    })
    @IsNotEmpty({message: `${process.env.MESSAGE_ERROR_CATEGORY_ID_IS_NOT_NUMBER}`})
    category_id: number;
 
    @ApiProperty({
        description: 'Whether the product is active',
        example: true,
        required: false,
        default: true,
    })
    @IsOptional() 
    @IsBoolean({ message: `${process.env.MESSAGE_ERROR_IS_ACTIVE}` })
    isActive?: boolean;
   
}

