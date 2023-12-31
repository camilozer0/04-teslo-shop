import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";


export class CreateProductDto {
    // * Instalar classvalidator y classtransformer
    // * Luego usar los decoradores

    @IsString()
    @MinLength(1)
    title: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @IsString({ 
        each: true,
    })
    @IsArray()
    sizes: string[];

    @IsIn([ 'men', 'women', 'kid', 'unisex'])
    gender: string;

    @IsString({
        each: true,
    })
    @IsArray()
    @IsOptional()
    tags: string[];

    // Creo el campo de imagenes en el DTO para que sea recibido
    @IsString({
        each: true,
    })
    @IsArray()
    @IsOptional()
    images?: string[];

}
