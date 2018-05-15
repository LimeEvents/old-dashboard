import React, { Component } from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { Container, Col, Row, Input, FormGroup, Form, Label, Progress, ListGroup, ListGroupItem } from 'reactstrap'
import { formatDate } from '../utils/date'
import { Mutation } from 'react-apollo'

const query = gql`
query PerformerEditor($id: ID!) {
  performer(id: $id) {
    id
    name
    caption
    images
    videos
    description
    events {
      edges {
        node {
          id
          start
          inventory {
            available
            sold
            reserved
          }
          location {
            address {
              locality
              region
            }
          }
        }
      }
    }
  }
}
`

class Performer extends Component {
  render () {
    if (this.props.data.error) {
      return <div>{this.props.data.error.message}</div>
    }
    if (this.props.data.loading) {
      return <div>Loading</div>
    }
    return (
      <Container>
        <Row>
          <Col>
            Performer Edit
            <Form>
              <FormGroup>
                <Label for='name'>Name</Label>
                <Input type='text' value={this.props.data.performer.name} />
              </FormGroup>

              <FormGroup>
                <Label for='name'>Caption</Label>
                <Input type='textarea' value={this.props.data.performer.caption} />
              </FormGroup>

              <FormGroup>
                <Label for='name'>Description</Label>
                <Input type='textarea' value={this.props.data.performer.description} rows={5} />
              </FormGroup>

              <FormGroup>
                <Label for='name'>Images</Label>
                <Input type='text' value={this.props.data.performer.name} />
              </FormGroup>

              <FormGroup>
                <Label for='name'>Videos</Label>
                <Input type='text' value={this.props.data.performer.name} />
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <h4>Upcoming Events</h4>
            <ListGroup>
              {
                this.props.data.performer.events.edges.map(({ node: event }) => {
                  return (
                    <ListGroupItem>
                      <Container>
                        <Row>
                          <Col sm={2}>
                            { event.location.address.locality }
                          </Col>
                          <Col sm={2}>
                            { formatDate(event.start) }
                          </Col>
                          <Col>
                            <Progress value={Math.ceil(event.inventory.sold / (event.inventory.sold + event.inventory.available + event.inventory.reserved))} />
                          </Col>
                        </Row>
                      </Container>
                    </ListGroupItem>
                  )
                })
              }
            </ListGroup>
          </Col>
        </Row>
      </Container>
    )
  }
}

Performer.propTypes = {
  data: PropTypes.object
}

export default graphql(query, {
  options (props) {
    return {
      variables: { id: props.match.params.performerId }
    }
  }
})(Performer)
