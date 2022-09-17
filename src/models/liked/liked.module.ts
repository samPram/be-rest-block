import { Module } from '@nestjs/common';
import { LikedController } from './liked.controller';
import { LikedService } from './liked.service';

@Module({
  controllers: [LikedController],
  providers: [LikedService]
})
export class LikedModule {}
