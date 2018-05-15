import React, { Component } from 'react'
import { Alert, Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap'

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
            <img src={`${this.props.data.event.image}?w=50&h=50&fit=crop&crop=faces,center`} style={{ width: '100%', height: '100%' }} />

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
      image
      price
      caption
      description
      start(format: "M/D/YY h:mma")
      name
    }
  }
`

export default compose(
  graphql(EVENT_DETAILS, {
    options: (props) => {
      console.log('props', props)
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
