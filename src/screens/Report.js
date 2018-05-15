import { compose, withProps } from 'recompose'
import Report from '../components/Report'

export default compose(
  withProps(props => ({ eventId: props.match.params.eventId, locationId: props.match.params.locationId }))
)(Report)
