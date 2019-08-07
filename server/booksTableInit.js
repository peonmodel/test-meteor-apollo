export const booksTableInit = async ({ db }) => db.schema.createTable("books", (table) => {
    console.log(`In booksTableInit`)

  table.increments()
  table.string("title")
  table.string("author")
  table.string("idOfOwner")

  return table
})
  .then((table) => {
    db("books").insert([
      { title: "Harry Potter and the Chamber of Secrets", author: "J.K. Rowling", idOfOwner: "f892jkf3" },
      { title: "Jurassic Park", author: "Michael Crichton", idOfOwner: "f83kfw" }
    ])
      .then((insertResult) => {
        console.log(`Inserted books. result: ${JSON.stringify(insertResult)}`)

        return db.select().from("books")
          .then((books) => {
            console.log(`books: ${JSON.stringify(books)}`)

            return books.length > 0
          })
      })

    return { books: table }
  })
  .catch(error => console.log(error))
