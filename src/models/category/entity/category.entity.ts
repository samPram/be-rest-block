import { Article } from 'src/models/article/entity/article.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id_category: string;

  @Column('varchar', { length: 12 })
  name: string;

  @Column('varchar', { length: 144 })
  description: string;

  //   Relation
  @OneToMany(() => Article, (article) => article.category)
  articles: Article[];
}
