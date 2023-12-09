import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// No le pongo el entity porque me crearia en la base de datos una tabla adicional y no quiero eso
@Entity()
export class productImage {

    // Con esta opcion la numeracion se autoincrementa
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    url: string;


    
}