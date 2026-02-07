import { Entity, Column, PrimaryColumn, OneToOne } from 'typeorm';
import { Account } from 'src/accounts/entity/account.entity';

@Entity()
export class User {
    @PrimaryColumn()
    id: string;
    @Column()
    name: string;
    @Column()
    age: number;
    @Column({ unique: true, update: false })
    email: string;
    @Column({
        type: "enum",
        enum: ["Admin", "Manager", "User"],
        default: "User"
    })
    role: 'Admin' | 'Manager' | 'User';
    @Column({
        type: "enum",
        enum: ["Online", "Offline"],
        default: "Offline"
    })
    status: 'Online' | 'Offline';

    @OneToOne(() => Account, account => account.user, { nullable: true })
    account?: Account;
}