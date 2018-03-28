import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Container, Row, Col, Table } from 'reactstrap'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class Report extends Component {
  render () {
    console.log(this.props)
    return (
      <Container>
        <Row>
          <Col>
            { !this.props.data.loading && <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.props.data.orders.edges.map(({ node: order }) => {
                    console.log(order)
                    return (
                      <tr>
                        <th scope='row'>{ order.id }</th>
                        <td>{ order.willcall }</td>
                        <td>${ (order.amount / 100).toFixed(2) }</td>
                        <td>${ (order.taxes / 100).toFixed(2) }</td>
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

Report.propTypes = {
  data: PropTypes.object
}

export default graphql(gql`{
  orders { edges { node { id willcall amount taxes } } }
}`
)(Report)
