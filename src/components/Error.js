import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { branch, compose, renderComponent, withProps } from 'recompose'
import { Alert, Button } from 'reactstrap'
import get from 'lodash.get'

class ErrorMessage extends Component {
  render () {
    return (
      <div>
        <Alert color='warning'>Error loading data</Alert>
        { this.props.refetch && <Button onClick={() => this.props.refetch()}>Click here to reload</Button> }
      </div>
    )
  }
}

ErrorMessage.propTypes = {
  refetch: PropTypes.func
}

export default ErrorMessage

export function withError (component = ErrorMessage) {
  return branch(
    props => props.data && props.data.error,
    compose(
      withProps(props => ({ refetch: get(props, 'data.refetch') })),
      renderComponent(component)
    )
  )
}
