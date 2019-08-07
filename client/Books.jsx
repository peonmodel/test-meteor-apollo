import React, { Component } from 'react'

class Books extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    import { Query, Subscription } from "react-apollo"
    import gql from 'graphql-tag'

    const queryBooks = gql`query books {
      books {
        id
        title
        author
        idOfOwner
      }                              
    }`

    return (
      <>
        <Query
          query={queryBooks}
          //variables={{ }}
          // fetchPolicy="network-only"
          errorPolicy="all"
        // onCompleted={(data) => {
        //   console.log(`Query Completed. data: ${JSON.stringify(data)}`)
        // }}
        >
          {({ loading: loading0, error: error0, data }) => {
            import Loading from './Loading.jsx'
            if (loading0) return <Loading />
            if (error0) return <p>Query error: {error0}</p>

            return (
              <>
                <h2>List</h2>
                <p>Format: id. author - title, idOfOwner</p>
                <ul>
                  {data.books.map(book => (
                    <li key={book.id}>{book.id}. {book.author} - {book.title}, {book.idOfOwner}</li>
                  ))
                  }
                </ul>
              </>
            )
          }}
        </Query>

        <Subscription
          subscription={gql`
              subscription {
                latestBook {
                  id
                  title
                  author
                  idOfOwner
                }
              }`}
          // variables={{ }}
        >
          {({ data, loading, error }) => {
            if (loading) return null
            if (error) console.log(`Subscription error: ${JSON.stringify(error)}`)
            else {
              console.log(`New data from subscription: ${JSON.stringify(data)}`)
              return (
                <>
                  <h3>Latest book (Subscription output)</h3>
                  {JSON.stringify(data)}
                </>
              )
            }
            return null //show nothing on UI
          }}
        </Subscription>
      </>
    )
  }
}

export default Books
