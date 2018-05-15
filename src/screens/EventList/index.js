import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { compose, withProps } from 'recompose'
import { withLoading } from '../../components/Loading'
import { withError } from '../../components/Error'
import EventList from '../../components/EventList'

const EVENT_LIST = gql`
  query Events($first: Int!) {
    events(first: $first) {
      edges {
        node {
          ...EventFragment
        }
      }
    }
  }
  fragment EventFragment on Event {
    id
    image
    summary: caption
    rating: contentRating
    name
    description
    locationId
    externalIds
    performerIds
    start(format: "M/D h:mma")
    url
    location {
      name
      id
      address {
        suite: address2
        city: locality
        state: region
        street: address1
        postalCode
      }
      slug
    }
    price
  }
`

export default compose(
  graphql(EVENT_LIST, { options: { variables: { first: 10 } } }),
  withLoading(),
  withError(),
  withProps(props => ({ events: props.data.events.edges.map(({ node }) => node) }))
)(EventList)
