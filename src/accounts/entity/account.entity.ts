import { User } from "src/users/entity/user.entity";
import { Entity, Column, OneToOne, PrimaryColumn, JoinColumn } from "typeorm";

export type Role = 'Admin' | 'Manager' | 'User';

@Entity()
export class Account {
    @PrimaryColumn()
    email: string;
    @Column()
    password: string;
    @Column({ nullable: true })
    phone: string;
    @Column({ nullable: true })
    address: string;
    @Column({ nullable: true })
    country: string;
    @Column({ nullable: true })
    state: string;
    @Column({ nullable: true })
    city: string;
    @Column({ nullable: true })
    postcode: string;
    @Column({ nullable: true })
    about: string;
    @OneToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'email', referencedColumnName: 'email' })
    user: User;
};
