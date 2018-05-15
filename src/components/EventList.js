import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Table } from 'reactstrap'

const EventList = ({ events, history }) => {
  return (
    <Table>
      <tbody>
        {
          events.map((event) => {
            return (
              <tr onClick={() => history.push(`/events/${event.id}`)} key={event.id} button component={Link} to={`/events/${event.id}`}>
                <td><img src={`${event.image}?w=50&h=50&fit=crop&crop=faces,center`} /></td>
                <td>{event.name}</td>
                <td>{event.start}</td>
              </tr>
            )
          })
        }
      </tbody>
    </Table>
  )
}

EventList.propTypes = {
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
