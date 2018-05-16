import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Container, Row, Col, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import { graphql } from 'react-apollo'
import { compose, withProps } from 'recompose'
import gql from 'graphql-tag'
import { withLoading } from '../../components/Loading'
import { withError } from '../../components/Error'
import Currency from '../../components/Currency'
import Report from '../../components/Report'

class EventDetails extends Component {
  render () {
    return (
      <Container>
        <Row>
          <Col sm={2} className='d-flex flex-column align-items-center'>
            <img src={this.props.data.event.image} style={{ width: '100%' }} alt={this.props.data.event.name}/>
            <Button block tag={Link} to={`/events/${this.props.data.event.id}/edit`}>Edit Event</Button>
          </Col>
          <Col>
            <h1>{this.props.data.event.name} <small>{this.props.data.event.start}</small></h1>
            { this.props.data.event.caption && <h4>{this.props.data.event.caption}</h4> }
            <Alert color='success'>
              <Currency value={this.props.data.event.price} style={{ fontSize: '30px' }} />
            </Alert>
            <p>{this.props.data.event.description}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Report eventId={this.props.data.event.id} />
          </Col>
        </Row>
      </Container>
    )
  }
}

const EVENT_DETAILS = gql`
  query EventDetails($id: ID!) {
    event(id: $id) {
      id
      image(size: 160)
      price
      caption
      description
      start(format: "M/D/YY h:mma")
      name
    }
  }
`

EventDetails.propTypes = {
  data: PropTypes.shape({
    event: PropTypes.shape({
      id: PropTypes.string,
      image: PropTypes.string,
      name: PropTypes.string,
      start: PropTypes.string,
      caption: PropTypes.string,
      price: PropTypes.number,
      description: PropTypes.string
    })
  })
}

export default compose(
  graphql(EVENT_DETAILS, {
    options: (props) => {
      return {
        variables: {
          id: props.match.params.eventId
        }
      }
    }
  }),
  withLoading(),
  withError(),
  withProps(props => ({ event: props.data.event }))
)(EventDetails)
