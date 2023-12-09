import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

// No le pongo el entity porque me crearia en la base de datos una tabla adicional y no quiero eso
@Entity()
export class ProductImage {

    // Con esta opcion la numeracion se autoincrementa
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;

    @ManyToOne(
        () => Product,
        (product) => product.images,
    )
    product: Product

    
}