import { Type } from "class-transformer"
import { IsOptional, IsPositive, Min } from "class-validator"

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    // Esto seria opcional si ponemos el enableImplicitConversion: true
    @Type( () => Number )  
    limit?: number
    
    @IsOptional()
    @Min(0)
    // Esto seria opcional si ponemos el enableImplicitConversion: true
    @Type( () => Number )  
    offset?: number
}