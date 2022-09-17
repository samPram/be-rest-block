import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  READER = 'READER',
  WRITER = 'WRITER',
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
  @Column('varchar', { nullable: false, unique: true })
  email: string;

  @Column('varchar', { length: 144 })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.READER, nullable: false })
  role: string;

  @Column('boolean', { default: false })
  actived: boolean;
}
