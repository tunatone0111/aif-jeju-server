import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { coordinateSchema } from 'src/route/schema/Coordinate.schema';

const getTrashPriorityDto = z.object({
  id: z.string(),
  type: z.string().array(),
  distant: z.number(),
  location: coordinateSchema,
});

export default class GetTrashPriorityDto extends createZodDto(
  getTrashPriorityDto,
) {}
