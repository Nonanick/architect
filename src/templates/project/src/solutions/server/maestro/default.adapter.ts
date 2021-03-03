import { Adapter } from 'maestro-fastify';
import dotenv from 'dotenv';

dotenv.config();

const Fastify = new Adapter();

Fastify.onPort(
  parseInt(process.env.FASTIFY_ADAPTER_PORT ?? '3301')
);
export default Fastify;
