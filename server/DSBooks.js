import Sequelize from "sequelize"

const sequelize = new Sequelize("database", "username", "password", {
  dialect: "sqlite",
  logging: false
})

const modelBooks = sequelize.define("book", {
  title: Sequelize.STRING,
  author: Sequelize.STRING,
  idOfOwner: Sequelize.STRING
})

export class DSBooks {
  async getBooks({ idOfOwner }) {
    return await modelBooks.findAll(idOfOwner ? { where: { idOfOwner } } : {}) //array of books
  }

  async bookAdd({ book }) {
    console.log(`In data source function bookAdd. book: ${JSON.stringify(book)}`)

    return await modelBooks.create(book)
    // .then(bookNew => console.log(`inserted: ${JSON.stringify(bookNew)}`))
  }
}


const booksTableInit = async () => sequelize.getQueryInterface().createTable( //SQLite database is non-persistent so needs to be created on each app run
  'books',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    title: Sequelize.STRING,
    author: Sequelize.STRING,
    idOfOwner: Sequelize.STRING
  }
)
  .then(() => {
    modelBooks.create({ title: 'Harry Potter and the Chamber of Secrets', author: 'J.K. Rowling', idOfOwner: "f892jkf3" })
      .then(book => console.log(`inserted: ${JSON.stringify(book)}`))

    modelBooks.create({ title: 'Jurassic Park', author: 'Michael Crichton', idOfOwner: "f83kfw" })
      .then(book => console.log(`inserted: ${JSON.stringify(book)}`))

    return null //To prevent Warning: a promise was created in a handler
  })
  .catch(error => console.log(error))

booksTableInit()
