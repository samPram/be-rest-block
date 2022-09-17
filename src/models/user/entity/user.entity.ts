import { Exclude } from 'class-transformer';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  READER = 'READER',
  WRITER = 'WRITER',
  ADMIN = 'ADMIN',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id_user: string;

  @Column('varchar', { length: 50 })
  first_name: string;

  @Column('varchar', { length: 50 })
  last_name: string;

  @Index()
  @Column('varchar', { length: 12, nullable: false, unique: true })
  username: string;

  @Exclude()
  @Column('varchar', { length: 144, nullable: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.READER, nullable: false })
  role: string;
}
