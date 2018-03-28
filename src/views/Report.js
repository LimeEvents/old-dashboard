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
                    return (
                      <tr>
                        <th scope='row'>1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
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
  orders { edges { node { id } } }
}`
)(Report)
