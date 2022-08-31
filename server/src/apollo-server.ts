import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import {
  ApolloServer,
  ExpressContext,
  gql
} from 'apollo-server-express';
import * as express from 'express';
import { Server } from 'http';
import Db from './db';
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader"
import { loadSchemaSync } from "@graphql-tools/load"
import { addResolversToSchema } from "@graphql-tools/schema"
import { GRAPHQL_SCHEMA_PATH } from "./constants"

const SCHEMA = loadSchemaSync(GRAPHQL_SCHEMA_PATH, {
  loaders: [new GraphQLFileLoader()],
})

export async function createApolloServer(
  db: Db,
  httpServer: Server,
  app: express.Application
): Promise<ApolloServer<ExpressContext>> {

  const resolvers = {
    Query: {
      currentUser: () => {
        return {
          id: "123",
          name: "John Doe",
          handle: "johndoe",
          coverUrl: "",
          avatarUrl: "",
          createdAt: "",
          updatedAt: "",
        }
      },
      suggestions: () => {
        return []
      },
    },
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ db }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer })
    ]
  });
  await server.start();
  server.applyMiddleware({ app });
  return server;
}