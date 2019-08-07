const subChannelBookAdded = "bookAdded"

import { pubSub } from "./pubSub.js"

import { withFilter } from 'apollo-server-express'

export const resolvers = {
  Query: {
    // books: async (root, args, { dataSources, user }) => {
    books: async (root, args, context) => {
      // console.log(`Query context: ${JSON.stringify(context, null, 2)}`) //causes error: Converting circular structure to JSON
      // if (!context.user) throw new Error('Please log in.') //enable if login is required

      // const books = await context.dataSources.dsBooks.getBooks(context.user ? { idOfOwner: context.user._id } : {}) //Meteor user available because of https://github.com/apollographql/meteor-integration
      const books = await context.dataSources.dsBooks.getBooks({})
      return books
    }
  },

  Mutation: {
    bookAdd: async (root, { title, author }, { dataSources, user }) => { //{ title, author } is args, { dataSources, user } is context. Called "deconstructuring assignment"
      console.log(`In bookAdd mutation. user: ${JSON.stringify(user)}`)

      // if (user === undefined) throw new Error('Please log in.') //enable if login is required
      const idOfOwner = user ? user._id : null

      const latestBook = await dataSources.dsBooks.bookAdd({ book: { title, author, idOfOwner } })
      console.log(`In bookAdd mutation. latestBook: ${JSON.stringify(latestBook)}`)
      pubSub.publish(subChannelBookAdded, { latestBook })
      return latestBook
    }
  },

  Subscription: {
    latestBook: {
      // subscribe: () => pubSub.asyncIterator(subChannelBookAdded)
      subscribe: withFilter(() => pubSub.asyncIterator(subChannelBookAdded),
        (payload, variables, context) => {
          console.log(`Subscription payload: ${JSON.stringify(payload)}`)
          console.log(`Subscription variables: ${JSON.stringify(variables)}`)
          console.log(`Subscription context: ${JSON.stringify(context)}`)

          return true //You can add conditions here comparing values in payload and variables and context. e.g.: payload.latestBook.idOfOwner === context.user._id
        }
      )
    }
  }
}
