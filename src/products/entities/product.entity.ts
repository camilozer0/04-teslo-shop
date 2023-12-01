import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    // * Hay que revisar que el tipo de dato este soportado por la base de datos
    // * Puedo definir caracteristicas, en este caso queremos que el titulo sea unico
    @Column('text', {
        unique: true,
    })
    title: string;

    @Column('float', {
        default: 0,
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @Column('text', {
        unique: true,
    })
    slug: string;

    @Column('int', {
        default: 0
    })
    stock: number;

    @Column('text', {
        array: true,
    })
    sizes: string[];

    @Column('text')
    gender: string;

    /* Si lo dejo sin el text me saca error el postgres
    siempre recibo un array, por eso lo pongo en true y
    por defecto recibe un arreglo vacio */
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    // TODO: create tags and images

    // * Verifico que el slug este creado y si no lo esta, lo creo a partir del titulo
    @BeforeInsert()
    checkSlugCreate() {
        // * verifica que haya slug y si no lo crea a partir del titulo
        if( !this.slug ) {
            this.slug = this.title
        } 
        // * Luego de crear el slug lo edita
        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '')
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        // No tengo que verificar el slug porque ya lo tengo (es requerido)
        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll("'", '')
    }


}
