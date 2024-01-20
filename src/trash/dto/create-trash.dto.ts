import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { TrashType } from '../schema/trashType.enum';

const createTrashDtoSchema = z.object({
  type: z.array(z.nativeEnum(TrashType)).optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

const createTrashBatchDtoSchema = z.array(createTrashDtoSchema);

export default class CreateTrashDto extends createZodDto(
  createTrashDtoSchema,
) {}

export class CreateTrashBatchDto extends createZodDto(
  createTrashBatchDtoSchema,
) {}
