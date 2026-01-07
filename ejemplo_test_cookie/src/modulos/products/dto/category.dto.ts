import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CategoryDto
{
    @ApiProperty({
    description: `Name category`,
    example: 'Category 1',
    })
    @IsNotEmpty({message: `${process.env.MESSAGE_ERROR_NAME_IS_EMPTY}`})
    name: string;
}