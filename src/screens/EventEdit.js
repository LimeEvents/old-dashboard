import uuid from 'uuid/v4'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { compose, withHandlers } from 'recompose'
import { Button, Container, Row, Col, FormGroup, Label, Input } from 'reactstrap'
import uploadcare from 'uploadcare-widget'
import Datepicker from '../components/DatetimePicker'
import CurrencyInput from '../components/CurrencyInput'

const EventEditFragment = gql`
  fragment EventEditFragment on Event {
    id
    price
    start
    notes
    name
    image(size: 150)
    caption
    url
    description
    locationId
    contentRating
    minimumAge
    video
    caption
    description
  }
`
const query = gql`
query EventEdit($id: ID!) {
  event(id: $id) {
    ...EventEditFragment
  }
  locations {
    edges {
      node {
        id
        name
      }
    }
  }
}
${EventEditFragment}
`

const mutation = gql`
  mutation EditEvent ($event: UpdateEventInput!) {
    updateEvent(input: $event) {
      clientMutationId
      event {
        ...EventEditFragment
      }
    }
  }
  ${EventEditFragment}
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
      contentRating: null,
      minimumAge: null,
      url: null
    }

    this.onChange = this.onChange.bind(this)
  }
  onChange (field) {
    return (e) => this.setState({
      [field]: typeof e === 'object' ? e.target.value : e
    })
  }
  componentWillReceiveProps (props, next) {
    this.setState({
      ...props.data.event
    })
  }
  componentDidMount () {
    var singleWidget = uploadcare.SingleWidget('[role=uploadcare-uploader]')
    singleWidget.onUploadComplete((event) => {
      this.setState({
        image: event.cdnUrl.replace(/-\/resize\/\d+x\d*\//, '')
      })
    })
  }

  get imageUrl () {
    const url = this.state.image
    if (!url) return url
    if (url.startsWith('https://wiseguys')) return `${url}?w=150&h=150&fit=crop&crop=faces,center`
    return `${url}-/resize/150x/`
  }

  render () {
    return (
      <Container>
        <Row>
          <Col>
            <FormGroup>
              <Label for='name'>Name</Label>
              <Input type='text' name='name' onChange={this.onChange('name')} value={this.state.name} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <FormGroup>
              <Label>Image</Label>
              <div className='d-flex flex-column align-items-center' style={{ backgroundColor: '#d0d0d0' }}>
                { this.state.image && <img src={this.state.image} style={{ width: '150px', height: '150px' }} alt={this.state.name} /> }
                <input type='hidden' role='uploadcare-uploader' name='content' data-crop='480x480 minimum' data-public-key='37a833de3eaa8798b364' data-images-only />
              </div>
            </FormGroup>
            <FormGroup>
              <Label for='video'>Video</Label>
              <Input
                type='text'
                name='video'
                onChange={(e) => {
                  const results = e.target.value.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i)
                  if (!results) this.onChange('video')(e)
                  else this.onChange('video')(`https://www.youtube.com/embed/${results[1]}`)
                }}
                value={this.state.video}
              />
              { this.state.video && <iframe title='YouTube video' style={{ width: '100%', height: '200px' }} src={this.state.video} frameBorder='0' allow='autoplay; encrypted-media' allowFullScreen /> }
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for='caption'>Caption</Label>
              <Input type='text' name='caption' onChange={this.onChange('caption')} value={this.state.caption} />
            </FormGroup>
            <FormGroup>
              <Label for='description'>Description</Label>
              <Input type='textarea' rows={5} name='description' onChange={this.onChange('description')} value={this.state.description} />
            </FormGroup>
            <Row>
              <Col>
                <FormGroup>
                  <Label for='price'>Price</Label>
                  <CurrencyInput type='text' name='price' onChange={this.onChange('price')} value={this.state.price} />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for='contentRating'>Age Range</Label>
                  <Input type='select' name='contentRating' onChange={this.onChange('contentRating')} value={this.state.contentRating}>
                    <option value='G'>G</option>
                    <option value='PG'>PG</option>
                    <option value='PG13'>PG-13</option>
                    <option value='R'>R</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for='minimumAge'>Minimum Age</Label>
                  <Input type='text' name='minimumAge' onChange={this.onChange('minimumAge')} value={this.state.minimumAge} />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label for='locationId'>Location</Label>
                  <Input disabled={!!this.state.id} type='select' name='locationId' onChange={this.onChange('locationId')} value={this.state.locationId}>
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
                  <Label for='start'>Start</Label>
                  <Datepicker readonly={!!this.state.id} name='start' onChange={this.onChange('start')} value={this.state.start} />
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for='start'>Ticket URL</Label>
              <Input type='text' name='url' onChange={this.onChange('url')} value={this.state.url || `https://www.wiseguyscomedy.com/tickets/${this.state.id}`} />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col className='d-flex justify-content-end'>
            <Button tag={Link} size='lg' color='default' to='/'>Cancel</Button>
            <Button size='lg' color='primary' onClick={() => this.props.updateEvent(this.state)}>Save event</Button>
          </Col>
        </Row>
      </Container>
    )
  }
}

EventEdit.propTypes = {
  data: PropTypes.object,
  updateEvent: PropTypes.func.isRequired
}

export default compose(
  graphql(mutation),
  withHandlers({
    updateEvent: ({ mutate }) => {
      return event => {
        return mutate({ variables: { event: {
          clientMutationId: uuid(),
          id: event.id,
          name: event.name,
          caption: event.caption,
          description: event.description,
          slug: event.slug,
          url: event.url,
          image: event.image,
          video: event.video,
          acceptDiscounts: event.acceptDiscounts,
          price: event.price,
          contentRating: event.contentRating,
          minimumAge: event.minimumAge
        } } })
      }
    }
  }),
  graphql(query, {
    options (props) {
      return {
        variables: {
          id: props.match.params.eventId
        }
      }
    }
  })
)(EventEdit)
