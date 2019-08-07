export const apolloServerInit = ({ db }) => {
  import { ApolloServer } from "apollo-server-express"
  import { getUser } from "meteor/apollo"
  import { typeDefs } from "./schema.js"
  import { resolvers } from "./resolvers.js"
  import { DSBooks } from "./DSBooks.js"

  const server = new ApolloServer({
    context: async ({ req, connection }) => {
      if (connection) { // check connection for metadata. Needed for Subscriptions to work.
        // console.log(`connection: ${JSON.stringify(connection)}`)

        return { ...connection.context }
      }

      console.log(`req.headers.authorization: ${JSON.stringify(req.headers.authorization)}`)
      return { user: await getUser(req.headers.authorization) } //when the client is logged in (ie has an unexpired Meteor login token in localStorage), resolvers will have a context.user property
    },
    typeDefs,
    resolvers,
    dataSources: () => ({
      dsBooks: new DSBooks({ db })
    }),
    // cache: new RedisCache({ host: "redis-server", }), // Options are passed through to the Redis client
    subscriptions: {
      path: "/subscriptions",
      onConnect: async (connectionParams, webSocket, context) => { //connectionParams has authToken that was set in WebSocketLink on client
        console.log(`Subscription client connected using built-in SubscriptionServer.`)
        console.log(`connectionParams: ${JSON.stringify(connectionParams)}`)

        if (connectionParams.authToken) return { user: await getUser(connectionParams.authToken) } //puts user into subscription context so that it can be used with withFilter()

        throw new Error("Missing auth token. Please log in.")
      },
      onDisconnect: async (webSocket, context) => {
        console.log(`Subscription client disconnected.`)
      }
    }
  })


  import { WebApp } from "meteor/webapp"
  server.applyMiddleware({ app: WebApp.connectHandlers }) //path option defaults to /graphql
  WebApp.connectHandlers.use("/graphql", (req, res) => { if (req.method === "GET") res.end() }) // To prevent server-side exception "Can't set headers after they are sent" because GraphQL Playground (accessible in browser via /graphql) sets headers and WebApp also sets headers

  server.installSubscriptionHandlers(WebApp.httpServer)
}
