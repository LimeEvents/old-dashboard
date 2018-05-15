import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Container, Row, Col, FormGroup, Label, Input } from 'reactstrap'

const query = gql`
query EventEdit($id: ID!) {
  event(id: $id) {
    price
    start
    notes
    name
    image
    caption
    description
    locationId
    performerIds
    contentRating
    minimumAge
    video
    caption
    description
  }
  locations {
    edges {
      node {
        id
        name
      }
    }
  }
  performers {
    edges {
      node {
        id
        name
        images
        videos
        caption
        description
      }
    }
  }
}
`

class EventEdit extends Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      image: null,
      video: null,
      caption: '',
      description: '',
      price: null,
      notes: [],
      start: null,
      locationId: null,
      performerIds: [],
      contentRating: null,
      minimumAge: null
    }

    this.onChange = this.onChange.bind(this)
    this.onPerformerChange = this.onPerformerChange.bind(this)
  }
  onChange (field) {
    return (e) => this.setState({
      [field]: e.target.value
    })
  }
  componentWillReceiveProps (props, next) {
    console.log('new props', props, next)
    this.setState({
      ...props.data.event
    })
  }
  onPerformerChange (e) {
    const performerId = e.target.value
    const performer = this.props.data.performers.edges.map(({ node }) => node).find(({ id }) => performerId === id)
    console.log(performer, performerId)
    const update = { performerIds: this.state.performerIds.concat(performer.id) }
    if (!this.state.name) update.name = performer.name
    if (!this.state.image) update.image = performer.images[0]
    if (!this.state.video) update.video = performer.videos[0]
    if (!this.state.caption) update.caption = performer.caption
    if (!this.state.description) update.description = performer.description
    console.log('updating', update)
    this.setState(update)
  }
  render () {
    return (
      <Container>
        <Row>
          <Col>
            <FormGroup>
              <Label for='locationId'>Location</Label>
              <Input type='select' name='locationId' onChange={this.onChange('locationId')} value={this.state.locationId}>
                <option>-- Select Location --</option>
                {
                  !this.props.data.loading && this.props.data.locations && this.props.data.locations.edges.map(({ node: location }) => {
                    return (
                      <option key={location.id} value={location.id}>{location.name}</option>
                    )
                  })
                }
              </Input>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for='performerIds'>Performer</Label>
              <Input type='select' name='performerId' onChange={this.onPerformerChange} value={this.state.performerId}>
                <option>-- Select Performer --</option>
                {
                  !this.props.data.loading && this.props.data.performers && this.props.data.performers.edges.map(({ node: performer }) => {
                    return (
                      <option key={performer.id} value={performer.id}>{performer.name}</option>
                    )
                  })
                }
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for='name'>Name</Label>
              <Input type='text' name='name' onChange={this.onChange('name')} value={this.state.name} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for='image'>Image</Label>
              <Input type='text' name='image' onChange={this.onChange('image')} value={this.state.image} />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for='video'>Video</Label>
              <Input type='text' name='video' onChange={this.onChange('video')} value={this.state.video} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for='caption'>Caption</Label>
              <Input type='text' name='caption' onChange={this.onChange('caption')} value={this.state.caption} />
            </FormGroup>
            <FormGroup>
              <Label for='description'>Description</Label>
              <Input type='textarea' rows={5} name='description' onChange={this.onChange('description')} value={this.state.description} />
            </FormGroup>
            <FormGroup>
              <Label for='price'>Price</Label>
              <Input type='text' name='price' onChange={this.onChange('price')} value={this.state.price} />
            </FormGroup>
            <FormGroup>
              <Label for='notes'>Notes</Label>
              <Input type='text' name='notes' onChange={this.onChange('notes')} value={this.state.notes} />
            </FormGroup>
            <FormGroup>
              <Label for='start'>Start</Label>
              <Input type='date' name='start' onChange={this.onChange('start')} value={this.state.start} />
            </FormGroup>
            <FormGroup>
              <Label for='contentRating'>Age Range</Label>
              <Input type='text' name='contentRating' onChange={this.onChange('contentRating')} value={this.state.contentRating} />
            </FormGroup>
            <FormGroup>
              <Label for='minimumAge'>Minimum Age</Label>
              <Input type='text' name='minimumAge' onChange={this.onChange('minimumAge')} value={this.state.minimumAge} />
            </FormGroup>
          </Col>
        </Row>
      </Container>
    )
  }
}

EventEdit.propTypes = {
  data: PropTypes.object
}

export default graphql(query, {
  options (props) {
    return {
      variables: {
        id: props.match.params.eventId
      }
    }
  }
})(EventEdit)
