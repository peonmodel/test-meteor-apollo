  // Using knex and SQLDataSource (https://github.com/cvburgess/SQLDataSource)
  import knex from "knex"
  export const db = knex({
    client: "sqlite3",
    connection: { filename: "./sqlite.db" }, // at .meteor\local\build\programs\server
    useNullAsDefault: true
  })


// // Using sequelize
// import Sequelize from "sequelize"

// const sequelize = new Sequelize("database", "username", "password", {
//   dialect: "sqlite",
//   logging: false
// })
