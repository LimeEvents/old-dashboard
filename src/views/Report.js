import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, ButtonGroup, Container, Input, Row, Col, Table } from 'reactstrap'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import Currency from '../components/Currency'

import Errors from '../components/Errors'

const query = gql`query Report($filter: OrderFilter, $locationId: ID, $eventId: ID) {
  events {
    edges {
      node {
        id
        name
        image
      }
    }
  }
  locations {
    edges {
      node {
        id
        name
      }
    }
  }
  salesTax: orderMetric(filter: { aggregate: salesTax, eventId: $eventId, locationId: $locationId }) { value }
  amountPaid: orderMetric(filter: { aggregate: amountPaid, eventId: $eventId, locationId: $locationId }) { value }
  amountRefunded: orderMetric(filter: { aggregate: amountRefunded, eventId: $eventId, locationId: $locationId }) { value }
  orders(filter: $filter) {
    edges {
      node {
        id
        willcall
        amountPaid
        salesTax
        created
        amountRefunded
        event {
          id
          name
          image
          start
        }
      }
    }
  }
}`

class Report extends Component {
  constructor (props) {
    super(props)
    this.onEventChange = this.onEventChange.bind(this)
    this.onLocationChange = this.onLocationChange.bind(this)

    this.state = {
      eventId: this.props.match.params.eventId,
      locationId: this.props.match.params.locationId
    }
  }
  onEventChange (e) {
    const value = e.target.value
    this.props.history.push(`/events/${value}/reporting`)
    this.setState({
      locationId: value
    })
  }
  onLocationChange (e) {
    const value = e.target.value
    this.props.history.push(`/locations/${value}/reporting`)
    this.setState({
      locationId: value
    })
  }
  render () {
    console.log(this.props)
    if (this.props.data.error) {
      return (
        <Container>
          <Row>
            <Col>
              <Errors errors={[this.props.data.error]} />
            </Col>
          </Row>
        </Container>
      )
    }
    return (
      <Container>
        <Row>
          <Col>
            <Input type='select' onChange={this.onEventChange} value={this.state.eventId}>
              <option>-- Select Event --</option>
              {
                !this.props.data.loading && this.props.data.events.edges.map(({ node: event }) => {
                  return <option value={event.id}>{ event.name }</option>
                })
              }
            </Input>
          </Col>
          <Col>
            <Input type='select' onChange={this.onLocationChange} value={this.state.locationId}>
              <option>-- Select Location --</option>
              {
                !this.props.data.loading && this.props.data.locations.edges.map(({ node: location }) => {
                  return <option value={location.id}>{ location.name }</option>
                })
              }
            </Input>
          </Col>
        </Row>
        <Row style={{ marginBottom: '30px', marginTop: '30px' }}>
          <Col style={{ textAlign: 'center' }}>
            <Button block size='lg' color='secondary'>Taxes</Button>
            { !this.props.data.loading && <Currency value={this.props.data.salesTax} /> }
          </Col>
          <Col style={{ textAlign: 'center' }}>
            <Button block size='lg' color='danger'>Refunded</Button>
            { !this.props.data.loading && <Currency value={this.props.data.refundedAmount} /> }
          </Col>
          <Col style={{ textAlign: 'center' }}>
            <Button block size='lg' color='warning'>Fees</Button>
            { !this.props.data.loading && <Currency value={this.props.data.fees} /> }
          </Col>
          <Col style={{ textAlign: 'center' }}>
            <Button block size='lg' color='success'>Revenue</Button>
            { !this.props.data.loading && <Currency value={this.props.data.revenue} /> }
          </Col>
        </Row>
        <Row>
          <Col>
            { !this.props.data.loading && <Table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Willcall</th>
                  <th>Amount</th>
                  <th>Taxes</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.props.data.orders.edges.map(({ node: order }) => {
                    return (
                      <tr key={order.id}>
                        <td>
                          <div>{ order.event.name }</div>
                          <div>{ formatDate(order.event.start) }</div>
                        </td>
                        <td>{ order.willcall.slice(0, 2).join(', ') }</td>
                        <td>${ (order.amountPaid / 100).toFixed(2) }</td>
                        <td>${ (order.salesTax / 100).toFixed(2) }</td>
                        <td>{ formatDate(order.created) }</td>
                        <td>
                          <ButtonGroup>
                            <Button color='primary' outline size='sm'>WillCall</Button>
                            <Button color='success' outline size='sm'>Transfer</Button>
                            <Button color={order.refunded ? 'default' : 'danger'} size='sm' outline disabled={order.refunded}>Refund</Button>
                          </ButtonGroup>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table> }
          </Col>
        </Row>
      </Container>
    )
  }
}

function formatDate (input) {
  return moment(input).format('MM/DD/YY hh:mma')
}

Report.propTypes = {
  data: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object
}

const WithGraphQL = graphql(query, { options (props) {
  console.log('my query props', props)
  const { eventId, locationId } = props.match.params
  return {
    variables: {
      filter: {
        locationId,
        eventId
      },
      startDate: 0,
      endDate: 1000000000,
      locationId,
      eventId
    }
  }
} })(Report)

export default withRouter(WithGraphQL)
