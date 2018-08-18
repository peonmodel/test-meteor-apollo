## Test Meteor Apollo

This is a fork of [lorensr/test-meteor-apollo](https://github.com/lorensr/test-meteor-apollo) with the following added:

* SQLite Data Source
* React UI
* Book add functionality
* Login functionality (to test user being passed into resolver contexts)
* Subscriptions

### Please help
* Stop using the additional SubscriptionServer and instead use the built-in one by setting `subscriptions` option of `ApolloServer`. Solve this issue: [Subscriptions using built-in SubscriptionServer error: client gets "Cannot read property 'headers' of undefined"](https://github.com/apollographql/apollo-server/issues/1537).
* Use extension of [DataSources](https://github.com/apollographql/apollo-server/blob/master/packages/apollo-datasource/src/index.ts) interface, like [RESTDataSource](https://github.com/apollographql/apollo-server/blob/master/packages/apollo-datasource-rest/src/RESTDataSource.ts) used in example [IMDB.js](https://github.com/apollographql/fullstack-workshop-server/blob/datasources/src/datasources/IMDB.js). This would allow access to `context` and `cache`.
