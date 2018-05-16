import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ButtonGroup,
  Container,
  Input,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { formatDate } from '../utils/date'
import { withRouter } from 'react-router-dom'
import Currency from '../components/Currency'
import { compose } from 'recompose'

import { withLoading } from '../components/Loading'
import { withError } from '../components/Error'
import ReportCard from './ReportCard'

// import reassignOrder from '../queries/reassignOrder'

const query = gql`
  query Report($filter: OrderFilter, $eventId: ID, $locationId: ID) {
    events {
      edges {
        node {
          id
          name
          inventory { capacity }
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
    ticketsSold: orderMetric(filter: { locationId: $locationId, eventId: $eventId, aggregate: tickets }) { value }
    gross: orderMetric(filter: { locationId: $locationId, eventId: $eventId, aggregate: amountPaid }) { value }
    taxes: orderMetric(filter: { locationId: $locationId, eventId: $eventId, aggregate: salesTax }) { value }
    refunded: orderMetric(filter: { locationId: $locationId, eventId: $eventId, aggregate: amountRefunded }) { value }
    fees: orderMetric(filter: { locationId: $locationId, eventId: $eventId, aggregate: locationFee }) { value }
    orders(filter: $filter) {
      edges {
        node {
          id
          tickets
          amountPaid
          customerFee
          locationFee
          salesTax
          amountRefunded
          willcall
          created
          event {
            id
            name
            start
          }
        }
      }
    }
  }
`

class Report extends Component {
  constructor (props) {
    super(props)
    this.onEventChange = this.onEventChange.bind(this)
    this.onLocationChange = this.onLocationChange.bind(this)
    this.go = this.go.bind(this)
    this.toggle = this.toggle.bind(this)

    this.state = {
      eventId: this.props.eventId,
      locationId: this.props.locationId,
      orderId: null,
      willcall: false
    }
  }
  go (href) {
    return () => this.props.history.push(href)
  }
  onEventChange (e) {
    const value = e.target.value
    this.setState({
      eventId: value
    }, () => {
      this.props.history.push(`/events/${value}`)
    })
  }
  toggle (modalKey, state) {
    return () => {
      if (state) this.setState(state)
      this.setState({
        [modalKey]: !this.state[modalKey]
      })
    }
  }
  onLocationChange (e) {
    const value = e.target.value
    this.props.history.push(`/locations/${value}`)
    this.setState({
      locationId: value
    })
  }
  render () {
    return (
      <Container>
        <Row>
          <Col>
            { !this.props.eventId && <Input type='select' onChange={this.onEventChange} value={this.state.eventId}>
              <option>-- Select Event --</option>
              {
                !this.props.data.loading && this.props.data.events.edges.map(({ node: event }) => {
                  return <option value={event.id} selected={this.state.eventId === event.id}>{ event.name }</option>
                })
              }
            </Input> }
          </Col>
          <Col>
            { !this.props.eventId && <Input type='select' onChange={this.onLocationChange} value={this.state.locationId}>
              <option>-- Select Location --</option>
              {
                !this.props.data.loading && this.props.data.locations.edges.map(({ node: location }) => {
                  return <option value={location.id}>{ location.name }</option>
                })
              }
            </Input> }
          </Col>
        </Row>
        { !this.props.data.loading && <Row style={{ marginTop: '30px' }}>
          <Col>
            <ReportCard color='primary' primary='Tickets' children={this.props.data.ticketsSold.value} />
          </Col>
          <Col>
            <ReportCard color='success' primary='Gross'>
              <Currency value={this.props.data.gross.value} />
            </ReportCard>
          </Col>
          <Col>
            <ReportCard color='secondary' primary='Taxes'>
              <Currency value={-this.props.data.taxes.value} />
            </ReportCard>
          </Col>
          <Col>
            <ReportCard color='danger' primary='Refunded'>
              <Currency value={-this.props.data.refunded.value} />
            </ReportCard>
          </Col>
          <Col>
            <ReportCard color='warning' primary='Fees'>
              <Currency value={-this.props.data.fees.value} />
            </ReportCard>
          </Col>
          <Col>
            <ReportCard color='success' primary='Net'>
              <Currency value={this.props.data.gross.value - this.props.data.fees.value - this.props.data.taxes.value} />
            </ReportCard>
          </Col>
        </Row> }
        <Row>
          <Col>
            { !this.props.data.loading && <Table responsive striped>
              <thead>
                <tr>
                  { !this.props.eventId && <th>Event</th> }
                  <th>Tickets</th>
                  <th style={{ textAlign: 'right' }}>Gross</th>
                  <th style={{ textAlign: 'right' }}>Taxes</th>
                  <th style={{ textAlign: 'right' }}>Refunded</th>
                  <th style={{ textAlign: 'right' }}>Fee</th>
                  <th style={{ textAlign: 'right' }}>Net</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.props.data.orders.edges.map(({ node: order }) => {
                    return (
                      <tr key={order.id}>
                        { !this.props.eventId && <td className='d-flex flex-column align-items-center'>
                          <Button block size='sm' outline onClick={this.go(`/events/${order.event.id}`)}>
                            { order.event.name }
                            <div style={{ fontSize: '10px' }}>{ formatDate(order.event.start) }</div>
                          </Button>
                        </td> }
                        <td>{ order.tickets }</td>
                        <td style={{ textAlign: 'right' }}><Currency value={order.amountPaid} flat /></td>
                        <td style={{ textAlign: 'right' }}><Currency value={-order.salesTax} flat /></td>
                        <td style={{ textAlign: 'right' }}><Currency value={-order.amountRefunded} flat /></td>
                        <td style={{ textAlign: 'right' }}><Currency value={-order.locationFee} flat /></td>
                        <td style={{ textAlign: 'right' }}><Currency value={order.amountPaid - order.locationFee - order.salesTax} flat /></td>
                        <td className='d-flex flex-column align-items-end'>
                          <ButtonGroup>
                            <Button color='primary' outline size='sm' onClick={this.toggle('willcall', { orderId: order.id })}>WillCall</Button>
                            <Button color='success' outline size='sm'>Transfer</Button>
                            <Button color={order.refunded ? 'default' : 'danger'} size='sm' outline disabled={order.refunded}>Refund</Button>
                          </ButtonGroup>
                          <div style={{ fontSize: '12px' }}>Created: { formatDate(order.created) }</div>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
              <tfoot style={{ fontWeight: 'bold' }}>
                <tr>
                  { !this.props.eventId && <td><h4>Totals:</h4></td> }
                  <td>{ this.props.data.ticketsSold.value }</td>
                  <td style={{ textAlign: 'right' }}><Currency value={this.props.data.gross.value} flat /></td>
                  <td style={{ textAlign: 'right' }}><Currency value={-this.props.data.taxes.value} flat /></td>
                  <td style={{ textAlign: 'right' }}><Currency value={-this.props.data.refundedAmount} flat /></td>
                  <td style={{ textAlign: 'right' }}><Currency value={-this.props.data.fees.value} flat /></td>
                  <td style={{ textAlign: 'right' }}><Currency value={this.props.data.gross.value - this.props.data.fees.value - this.props.data.taxes.value} flat /></td>
                  <td className='d-flex flex-column'>
                    <div style={{ marginBottom: '10px' }}><Button block color='success' outline size='lg'>Transfer All</Button></div>
                    <div><Button block color='danger' size='lg' outline>Refund All</Button></div>
                  </td>
                </tr>
              </tfoot>
            </Table> }
          </Col>
        </Row>
        <Row>
          <Col>
            <Modal isOpen={this.state.willcall} toggle={this.toggle('willcall')}>
              <ModalHeader toggle={this.toggle('willcall')}>Update Willcall List</ModalHeader>
              <ModalBody>
                <ListGroup>
                  {
                    this.state.orderId && this
                      .props
                      .data
                      .orders
                      .edges
                      .find(({ node }) => node.id === this.state.orderId)
                      .node
                      .willcall
                      .map((str) => {
                        return (
                          <ListGroupItem>{str}</ListGroupItem>
                        )
                      })
                  }
                </ListGroup>
                <Input type='text' placeholder='Add to willcall' value={this.state.addToWillcall} onChange={(e) => this.setState({ addToWillcall: e.target.value })} />
              </ModalBody>
              <ModalFooter>
                <Button color='primary' onClick={this.toggle('willcall')}>Save</Button>{' '}
                <Button color='secondary' onClick={this.toggle('willcall')}>Cancel</Button>
              </ModalFooter>
            </Modal>
          </Col>
        </Row>
      </Container>
    )
  }
}

Report.propTypes = {
  data: PropTypes.object,
  eventId: PropTypes.string,
  locationId: PropTypes.string,
  history: PropTypes.object
}

export default compose(
  graphql(query, { options (props) {
    const { eventId, locationId } = props
    return {
      variables: {
        filter: {
          locationId,
          eventId
        },
        interval: 'week',
        startDate: 0,
        endDate: 1000000000,
        locationId,
        eventId
      }
    }
  } }),
  withLoading(),
  withError(),
  withRouter
)(Report)
