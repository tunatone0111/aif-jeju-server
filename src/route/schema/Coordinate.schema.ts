import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const coordinateSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export class Coordinate extends createZodDto(coordinateSchema) {}
