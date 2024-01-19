import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TrashDocument = HydratedDocument<Trash>;

@Schema()
export class Trash {
  @Prop({ type: Number })
  priority: number;

  @Prop({ type: [String] })
  type: string[];

  @Prop({ type: Number })
  distant: number;

  @Prop(
    raw({
      lat: { type: Number },
      lng: { type: Number },
    }),
  )
  location: Record<string, number>;

  @Prop({ default: Date.now() })
  createdAt: Date;
}

export const TrashSchema = SchemaFactory.createForClass(Trash);
