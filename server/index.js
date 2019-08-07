import { Meteor } from "meteor/meteor"

Meteor.startup(() => {
  import { booksTableInit } from "./booksTableInit.js"

  const executeExampleGQL = (uri) => { //example showing server-side gql operation execution
    import { HttpLink } from "apollo-link-http"
    import fetch from "node-fetch" //needed for executing gql server-side
    const link = new HttpLink({ uri, fetch })

    import gql from "graphql-tag"
    const queryBooks = gql`query books {
      books {
        id
        title
        author
        idOfOwner
      }                              
    }`

    const operation = {
      query: queryBooks,
      // variables: {},
      // operationName: {},
      // context: {},
      // extensions: {},
    }

    // execute(link, operation).subscribe({ // execute returns an Observable so it can be subscribed to
    //   next: data => console.log(`received data: ${JSON.stringify(data, null, 2)}`),
    //   error: error => console.log(`received error ${error}`),
    //   complete: () => console.log(`complete`),
    // })

    import { execute, makePromise } from "apollo-link"
    makePromise(execute(link, operation)) // For single execution operations, a Promise can be used
      .then(data => console.log(`Output data from example server-side GQL operation: ${JSON.stringify(data, null, 2)}`))
      .catch(error => console.log(`received error: ${error}`))
  }

  import { db } from "./db.js"

  booksTableInit({ db })
    .then((tableBooks) => {
      executeExampleGQL(Meteor.absoluteUrl("/graphql"))

      import { apolloServerInit } from "./apollo.js"
      apolloServerInit({ db })
    })
})
