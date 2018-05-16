import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'

import EventDetails from './screens/EventDetails'
import EventEdit from './screens/EventEdit'
import EventList from './screens/EventList'
import Report from './screens/Report'

import Header from './components/Header'

class App extends Component {
  render () {
    return (
      <Router>
        <div>
          <Container>
            <Row>
              <Col>
                <Header />
              </Col>
            </Row>
          </Container>
          <Route path='/' exact component={EventList} />
          <Route path='/reporting' component={Report} />
          <Route path='/events/:eventId/reporting' component={Report} />
          <Route path='/events/:eventId' exact component={EventDetails} />
          <Route path='/events/:eventId/edit' component={EventEdit} />
          <Route path='/locations/:locationId/reporting' component={Report} />
        </div>
      </Router>
    )
  }
}

export default App
