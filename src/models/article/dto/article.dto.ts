import { IsNotEmpty, IsString } from 'class-validator';

export class ArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  writer: string;

  @IsString()
  @IsNotEmpty()
  category: string;
}
