import z from 'zod';

const schema = z.object({
  MONGODB_URI: z.string().url(),
  OSRM_URI: z.string().url(),
});

export default schema;
