import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import { Account } from 'src/accounts/entity/account.entity';
import { Company } from 'src/companies/entity/company.entity';
import { Relation } from 'src/relations/entity/relation.entity';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

@Injectable()
export class SeedService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Account)
        private readonly accountsRepository: Repository<Account>,
        @InjectRepository(Company)
        private readonly companiesRepository: Repository<Company>,
        @InjectRepository(Relation)
        private readonly relationsRepository: Repository<Relation>,
    ) { }

    async onModuleInit(): Promise<void> {
        await this.seedCompaniesAndRelations();
        const seedData = [
            {
                user: {
                    id: 'seed-1',
                    name: 'Peter Griffin',
                    age: 42,
                    email: 'peter.griffin@example.com',
                    role: 'Admin' as const,
                    status: 'Online' as const,
                },
                account: {
                    email: 'peter.griffin@example.com',
                    password: 'peter123',
                    phone: '555-0101',
                    address: '31 Spooner Street',
                    country: 'USA',
                    state: 'RI',
                    city: 'Quahog',
                    postcode: '00093',
                    about: 'Loves Pawtucket Patriot Ale',
                },
            },
            {
                user: {
                    id: 'seed-2',
                    name: 'Lois Griffin',
                    age: 41,
                    email: 'lois.griffin@example.com',
                    role: 'Manager' as const,
                    status: 'Online' as const,
                },
                account: {
                    email: 'lois.griffin@example.com',
                    password: 'lois123',
                    phone: '555-0102',
                    address: '31 Spooner Street',
                    country: 'USA',
                    state: 'RI',
                    city: 'Quahog',
                    postcode: '00093',
                    about: 'Piano teacher and community volunteer',
                },
            },
            {
                user: {
                    id: 'seed-3',
                    name: 'Stewie Griffin',
                    age: 2,
                    email: 'stewie.griffin@example.com',
                    role: 'User' as const,
                    status: 'Offline' as const,
                },
                account: {
                    email: 'stewie.griffin@example.com',
                    password: 'stewie123',
                    phone: '555-0103',
                    address: '31 Spooner Street',
                    country: 'USA',
                    state: 'RI',
                    city: 'Quahog',
                    postcode: '00093',
                    about: 'Genius baby with big plans',
                },
            },
        ];

        const seedEmails = seedData.map(item => item.user.email);
        const seedUserIds = seedData.map(item => item.user.id);

        await this.accountsRepository.delete({ email: In(seedEmails) });
        await this.usersRepository.delete({ id: In(seedUserIds) });
        await this.usersRepository.delete({ email: In(seedEmails) });

        for (const item of seedData) {
            let user = await this.usersRepository.findOne({ where: { email: item.user.email } });
            if (!user) {
                user = this.usersRepository.create(item.user);
                user = await this.usersRepository.save(user);
            }

            const existingAccount = await this.accountsRepository.findOne({
                where: { email: item.account.email },
            });
            if (!existingAccount) {
                const account = this.accountsRepository.create({
                    ...item.account,
                    user,
                });
                await this.accountsRepository.save(account);
            } else {
                const merged = this.accountsRepository.merge(existingAccount, {
                    ...item.account,
                    user,
                });
                await this.accountsRepository.save(merged);
            }
        }
    }

    private async seedCompaniesAndRelations(): Promise<void> {
        const companiesFilePath = path.resolve('test/resources/companies_1217.csv');
        const relationsFilePath = path.resolve('test/resources/relationships_1217.csv');

        const companies = await this.parseCsv<Company>(companiesFilePath, (row) => ({
            company_code: row.company_code,
            company_name: row.company_name,
            level: Number(row.level),
            country: row.country,
            city: row.city,
            founded_year: Number(row.founded_year),
            annual_revenue: Number(row.annual_revenue),
            employees: Number(row.employees),
        }));

        const relations = await this.parseCsv<Relation>(relationsFilePath, (row) => ({
            company_code: row.company_code,
            parent_company: row.parent_company || '',
        }));

        if (companies.length) {
            await this.companiesRepository.upsert(companies, ['company_code']);
        }
        if (relations.length) {
            await this.relationsRepository.upsert(relations, ['company_code']);
        }
    }

    private async parseCsv<T>(filePath: string, mapper: (row: any) => T): Promise<T[]> {
        const records: T[] = [];
        await new Promise<void>((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on('data', (row: any) => records.push(mapper(row)))
                .on('end', () => resolve())
                .on('error', (err: Error) => reject(err));
        });
        return records;
    }
}
