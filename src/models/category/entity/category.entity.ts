import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id_category: string;

  @Column('varchar', { length: 12 })
  name: string;

  @Column('varchar', { length: 144 })
  description: string;
}
