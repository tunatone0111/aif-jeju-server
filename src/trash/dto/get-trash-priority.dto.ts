import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { coordinateSchema } from 'src/route/schema/Coordinate.schema';
import { TrashType } from '../schema/trashType.enum';

const getTrashPriorityDto = z
  .object({
    id: z.string(),
    type: z.array(z.nativeEnum(TrashType)),
    distant: z.number(),
    priority: z.number(),
    location: coordinateSchema,
  })
  .array();

export default class GetTrashPriorityDto extends createZodDto(
  getTrashPriorityDto,
) {}
