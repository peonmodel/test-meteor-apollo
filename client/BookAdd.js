import React, { Component } from 'react'

class BookAdd extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  handleBookAdd(bookAdd) {
    bookAdd({ variables: this.state }) //as specified in schema and resolver
      .then((result) => {
        if (result) {
          console.log(`bookAdd mutation result: ${JSON.stringify(result)}`)
        }
      }).catch(errorMutation => alert(`there was an error with the Mutation: ${errorMutation}`))
  }


  render() {
    import { Mutation } from "react-apollo"
    import gql from 'graphql-tag'
    import { Meteor } from "meteor/meteor"

    const mutationBookAdd = gql`
    mutation bookAdd($title: String!, $author: String!) {
      bookAdd(title: $title, author: $author) {
        id
        title
        author
        idOfOwner
      }
    }`

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
        <Mutation
          mutation={mutationBookAdd}
          update={(cache, { data: { bookAdd } }) => { //updates the UI (list of books) with new data after the mutation
            const { books } = cache.readQuery({ query: queryBooks })

            cache.writeQuery({
              query: queryBooks,
              data: { books: books.concat([bookAdd]) }
            })
          }}
        >
          {(bookAdd, { loading, error }) => (
            <>
              <label>
                Title:
                  <input
                  name="title"
                  onChange={(event) => {
                    event.persist()
                    this.setState((state, props) => ({ title: event.target.value }))
                  }}
                />
              </label>

              <label>
                Author:
                  <input
                  name="author"
                  onChange={(event) => {
                    event.persist()
                    this.setState((state, props) => ({ author: event.target.value }))
                  }}
                />
              </label>
              <button type="submit" onClick={() => this.handleBookAdd(bookAdd)} className="btn btn-primary btn-xs">Add</button>
              {/* {loading && <p>Loading...</p>} */}
              {error && <p>Error: {error.message}</p>}
            </>
          )}
        </Mutation>
      </>
    )
  }
}

export default BookAdd
