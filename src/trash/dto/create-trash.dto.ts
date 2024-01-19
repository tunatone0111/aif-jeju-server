import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const createTrashDtoSchema = z.object({
  type: z.array(z.string()),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

export default class CreateTrashDto extends createZodDto(
  createTrashDtoSchema,
) {}
