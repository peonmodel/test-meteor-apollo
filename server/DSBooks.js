import { SQLDataSource } from "datasource-sql" // https://github.com/cvburgess/SQLDataSource
export class DSBooks extends SQLDataSource {
  constructor({ db }) {
    super()
    this.db = db // Add your instance of Knex to the DataSource
  }

  async getBooks({ idOfOwner }) {
    console.log(`In data source function getBooks. idOfOwner: ${JSON.stringify(idOfOwner)}. user Id from context: ${this.context.user ? JSON.stringify(this.context.user._id) : null}`) //this.context was set in initialize(config) of SQLDataSource

    const query = this.db.select().from("books")

    // return await query
    return this.getBatched(query)
    // const ttlInS = 15
    // return this.getCached(query, ttlInS)
    // return this.getBatchedAndCached(query, ttlInS)
  }

  async bookAdd({ book }) {
    console.log(`In data source function bookAdd. book: ${JSON.stringify(book)}`)

    return await this.db("books").insert(book)
      .then(idArray => Object.assign(book, { id: idArray[0] }))
  }
}
