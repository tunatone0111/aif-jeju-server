import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RouteModule } from 'src/route/route.module';
import { Trash, TrashSchema } from './schema/trash.schema';
import { TrashController } from './trash.controller';
import { TrashService } from './trash.service';

@Module({
  imports: [
    RouteModule,
    MongooseModule.forFeature([
      {
        name: Trash.name,
        schema: TrashSchema,
      },
    ]),
  ],
  controllers: [TrashController],
  providers: [TrashService],
})
export class TrashModule {}
