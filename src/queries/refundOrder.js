import gql from 'graphql-tag'

export default gql`
mutation RefundOrder($input: RefundOrderInput!) {
  clientMutationId
  order {
    id
    tickets
    amount
    
  }
}
`