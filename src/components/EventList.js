import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Container, Col, Row, Table, Progress } from 'reactstrap'

const EventList = ({ events, history }) => {
  return (
    <Container>
      <Row>
        <Col>
          <Table responsive hover>
            <tbody>
              {
                events.map((event) => {
                  return (
                    <tr onClick={() => history.push(`/events/${event.id}`)} key={event.id} button component={Link} to={`/events/${event.id}`}>
                      <td><img src={event.image} alt={event.name} /></td>
                      <td>{event.name}</td>
                      <td>{event.start}</td>
                      <td>
                        {event.inventory.sold} / {event.inventory.capacity}
                        <Progress value={event.inventory.sold / event.inventory.capacity * 100} />
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

EventList.propTypes = {
  history: PropTypes.object,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      start: PropTypes.string.isRequired
    })
  ).isRequired
}

export default EventList
