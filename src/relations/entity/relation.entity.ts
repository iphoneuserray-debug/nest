import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Relation {
    @PrimaryColumn()
    company_code: string;
    @Column()
    parent_company: string;
}
