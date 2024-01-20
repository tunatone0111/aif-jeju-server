import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TrashType } from './trashType.enum';

export type TrashDocument = HydratedDocument<Trash>;

@Schema()
export class Trash {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: Number })
  priority: number;

  @Prop({ type: [String], enum: TrashType })
  type: TrashType[];

  @Prop({ type: Number, required: true })
  distant: number;

  @Prop(
    raw({
      lat: { type: Number },
      lng: { type: Number },
    }),
  )
  location: {
    lat: number;
    lng: number;
  };

  @Prop({ default: Date.now() })
  createdAt: Date;
}

export const TrashSchema = SchemaFactory.createForClass(Trash);
