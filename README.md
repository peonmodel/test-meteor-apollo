## Test Meteor Apollo

This is a fork of [lorensr/test-meteor-apollo](https://github.com/lorensr/test-meteor-apollo) with the following added:

* SQLite Data Source
* React UI
* Book add functionality
* Login functionality (to test user being passed into resolver contexts)
* Subscriptions

I'd like to stop using the additional SubscriptionServer and instead use the built-in one by setting `subscriptions` option of `ApolloServer`. Please help solve this issue: [Subscriptions using built-in SubscriptionServer error: client gets "Cannot read property 'headers' of undefined"](https://github.com/apollographql/apollo-server/issues/1537).
