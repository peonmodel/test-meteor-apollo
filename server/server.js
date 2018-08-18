import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './schema.js'
import { resolvers } from './resolvers.js'
import { DSBooks } from "./DSBooks.js"
import { getUser } from 'meteor/apollo'

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    dsBooks: new DSBooks()
  }),
  context: async ({ req, connection }) => {
    if (connection) {
      const token = req.headers.authorization || ""
      return { token }
    }
    return { user: await getUser(req.headers.authorization) }
  },
  uploads: false,
  // subscriptions: { // Need to get this to work. If you enable this, also uncomment apolloServer.installSubscriptionHandlers() below
  //   path: "/subscriptions",
  //   onConnect: async (connectionParams, webSocket, context) => { //connectionParams has authToken that was set in WebSocketLink on client
  //     console.log(`Subscription client connected using built-in SubscriptionServer.`)
  //     console.log(`connectionParams: ${JSON.stringify(connectionParams)}`)

  //     if (connectionParams.authToken) return { user: await getUser(connectionParams.authToken) } //puts user into subscription context so that it can be used with withFilter()

  //     // throw new Error('Missing auth token. Please log in.')
  //   },
  //   onDisconnect: async (webSocket, context) => {
  //     console.log(`Subscription client disconnected.`)
  //   }
  // } //subscriptions
})

import { WebApp } from 'meteor/webapp'
apolloServer.applyMiddleware({ app: WebApp.connectHandlers }) //path option defaults to /graphql

// We are doing this work-around because Playground sets headers and WebApp also sets headers
// Resulting into a conflict and a server side exception of "Headers already sent"
WebApp.connectHandlers.use('/graphql', (req, res) => {
  if (req.method === 'GET') res.end()
})

// apolloServer.installSubscriptionHandlers(WebApp.httpServer) // TODO: re-enable when fixed. In the meantime a new SubscriptionServer is created below




//Remove code below if you enable subscriptions option in ApolloServer above
import { SubscriptionServer } from 'subscriptions-transport-ws' //TODO: remove when built-in server is fixed. In the meantime a new SubscriptionServer is created below
import { execute, subscribe } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'

SubscriptionServer.create(
  {
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    execute,
    subscribe,
    onConnect: async (connectionParams, webSocket, context) => { //connectionParams has authToken that was set in WebSocketLink on client
      console.log(`Subscription client connected using new SubscriptionServer.`)
      console.log(`connectionParams: ${JSON.stringify(connectionParams)}`)

      if (connectionParams.authToken) return { user: await getUser(connectionParams.authToken) } //puts user into subscription context so that it can be used with withFilter()

      throw new Error('Missing auth token. Please log in.')
    },
    onDisconnect: async (webSocket, context) => {
      console.log(`Subscription client disconnected.`)
    }
  },
  {
    server: WebApp.httpServer,
    path: "/subscriptions",
  },
)
