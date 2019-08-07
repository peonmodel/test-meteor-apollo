import React from 'react'
import { Accounts } from 'meteor/std:accounts-ui'

Accounts.ui.config({
  passwordSignupFields: 'EMAIL_ONLY',
})

import { ApolloConsumer } from "react-apollo"

const LoginForm = () => (
  <ApolloConsumer>
    {apolloClient => ( //`apolloClient` is used here to reset the data store when the current user changes. See for more information: http://dev.apollodata.com/core/meteor.html#Accounts
      <Accounts.ui.LoginForm
        onSignedInHook={() => apolloClient.resetStore()}
        onSignedOutHook={() => apolloClient.resetStore()}
        onPostSignUpHook={() => apolloClient.resetStore()}
      />
    )
    }
  </ApolloConsumer>
)
export default LoginForm
