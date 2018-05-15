import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, ButtonGroup, Container, Row, Col, Table } from 'reactstrap'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const query = gql`
query EventList {
  events {
    edges {
      node {
        id
        performers {
          edges {
            node {
              images
              name
            }
          }
        }
      }
    }
  }
}
`

class EventList extends Component {
  constructor (props) {
    super(props)

    this.go = this.go.bind(this)
  }
  go (href) {
    return () => this.props.history.push(href)
  }
  render () {
    return (
      <Container>
        <Row>
          <Col>
            <Table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Performers</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  !this.props.data.loading && this.props.data.events.edges.map(({ node: event }) => {
                    return (
                      <tr>
                        <td><img src={event.performers.edges[0].node.images[0]} style={{ maxHeight: '50px' }} /></td>
                        <td>{event.performers.edges.map(({ node: performer }) => performer.name).join('\n')}</td>
                        <td>
                          <ButtonGroup>
                            <Button
                              color='primary'
                              size='sm'
                              onClick={this.go(`/events/${event.id}`)}
                              outline
                            >
                              Edit
                            </Button>
                            <Button color='warning' size='sm' outline>Reschedule</Button>
                            <Button color='danger' size='sm' outline>Cancel</Button>
                          </ButtonGroup>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    )
  }
}

EventList.propTypes = {
  data: PropTypes.object
}

export default graphql(query)(EventList)
