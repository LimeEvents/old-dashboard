import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'

import EventEdit from './views/EventEdit'
import EventList from './views/EventList'
import Report from './views/Report'

import MainNavigation from './components/MainNavigation'

class App extends Component {
  render () {
    return (
      <Router>
        <div>
          <Container>
            <Row>
              <Col>
                <MainNavigation />
              </Col>
            </Row>
          </Container>
          <Route path='/' exact component={EventList} />
          <Route path='/reporting' component={Report} />
          <Route path='/events/:eventId/reporting' component={Report} />
          <Route path='/events/:eventId' component={EventEdit} />
          <Route path='/locations/:locationId/reporting' component={Report} />
        </div>
      </Router>
    )
  }
}

export default App
