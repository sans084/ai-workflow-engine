import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiService } from './ai.service';
import { RequestEntity, RequestSchema } from '../requests/schemas/request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RequestEntity.name, schema: RequestSchema }]),
  ],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}