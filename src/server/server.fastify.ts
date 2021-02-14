import ArchitectServer from "./server.boot";
import { Adapter } from "maestro-fastify";

const Server = ArchitectServer;

const Fastify = new Adapter();

Fastify.raw.register(require("fastify-cors"), {
  origin: true,
  credentials: true,
  methods: [
    "GET",
    "get",
    "PUT",
    "put",
    "POST",
    "post",
    "DELETE",
    "delete",
    "PATCH",
    "patch",
    "OPTIONS",
  ],
});

Fastify.onPort(8005);

Server.addAdapter(
  Fastify,
);

Server.start();
