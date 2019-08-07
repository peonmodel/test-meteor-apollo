import React, { Component } from 'react'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    import { ApolloClient } from 'apollo-client'
    import { ApolloLink } from 'apollo-link'
    import { MeteorAccountsLink } from 'meteor/apollo'
    import { HttpLink } from 'apollo-link-http'
    import { WebSocketLink } from 'apollo-link-ws'
    import { InMemoryCache } from 'apollo-cache-inmemory'
    import { Meteor } from "meteor/meteor"

    const apolloClient = new ApolloClient({
      link: ApolloLink.split( // split based on operation type
        ({ query }) => {
          import { getMainDefinition } from 'apollo-utilities'
          const { kind, operation } = getMainDefinition(query)
          return kind === 'OperationDefinition' && operation === 'subscription'
        },
        new WebSocketLink({
          uri: `${Meteor.absoluteUrl("/subscriptions").replace("http", "ws")}`,
          options: {
            reconnect: true,
            connectionParams: { authToken: this.props.authToken },
          }
        }),
        ApolloLink.from([
          new MeteorAccountsLink(),
          new HttpLink({ uri: "/graphql" })
        ])
      ),
      cache: new InMemoryCache()
    })

    import { ApolloProvider } from 'react-apollo'
    import LoginForm from './LoginForm.jsx'
    import Books from './Books.jsx'
    import BookAdd from "./BookAdd.jsx"

    return (
      <>
        <div>
          <h1>Books</h1>
        </div>
        <ApolloProvider client={apolloClient}>
          <>
            {this.props.userId !== null
              ? (
                <>
                  <button type="button" onClick={() => { Meteor.logout() }} className="btn btn-primary btn-xs">Sign out</button>
                  <Books />
                  <br /><br />
                  <BookAdd />
                </>
              )
              : <LoginForm />}
          </>
        </ApolloProvider>
      </>
    )
  }
}

import PropTypes from 'prop-types'
App.propTypes = {
  userId: PropTypes.string,
  authToken: PropTypes.string,
}

// export default App

import { withTracker } from 'meteor/react-meteor-data' //create a container component which provides data from a Meteor collection to the React component. This allows React components to respond to data changes via Meteor’s Tracker reactivity system.
export default withTracker(() => {
  import { Meteor } from "meteor/meteor"
  return {
    userId: Meteor.userId(),
    authToken: global.localStorage['Meteor.loginToken']
  }
})(App)
