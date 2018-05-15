const gql = require('graphql-tag')

module.exports = gql`
mutation ReassignOrder($input: ReassignOrderInput!) {
  clientMutationId
  order {
    id
    willcall
  }
}
`
