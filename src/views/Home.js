import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import Errors from '../components/Errors'
import { Container, Row, Col } from 'reactstrap'

class Home extends Component {
  render () {
    return (
      <Container>
        <Row>
          <Col>
            <h1>Home</h1>
            <Errors errors={[{ message: 'terrible' }]} />
          </Col>
        </Row>
      </Container>
    )
  }
}

Home.propTypes = {

}

export default Home
