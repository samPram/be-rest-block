import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('article')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id_article: string;

  @Column('varchar', { length: 50 })
  title: string;

  @Column('varchar', { length: 500 })
  content: string;

  @Column('varchar', { length: 50 })
  img: string;

  @Column('timestamp')
  posted: Date;
}
