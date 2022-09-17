import { User } from '../../../models/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from '../../../models/category/entity/category.entity';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id_article: string;

  @Column('varchar', { length: 50 })
  title: string;

  @Column('varchar', { length: 500 })
  content: string;

  @Column('timestamp')
  posted: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.articles)
  writer: User;

  @ManyToOne(() => CategoryEntity, (category) => category.articles)
  category: CategoryEntity;
}
