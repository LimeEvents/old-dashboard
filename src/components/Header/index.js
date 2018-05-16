import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  Container,
  Row,
  Col,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap'

class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  render () {
    return (
      <Container>
        <Row>
          <Col>
            <Navbar color='light' light expand='md'>
              <NavbarBrand href='/'>Lime Events</NavbarBrand>
              <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className='ml-auto' pills>
                  <NavItem>
                    <NavLink tag={Link} to='/reporting'>Reports</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} to='/'>Events</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} to='/new-event' active>+ New Event</NavLink>
                  </NavItem>
                </Nav>
              </Collapse>
            </Navbar>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Header
