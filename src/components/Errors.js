import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'reactstrap'

class Error extends Component {
  render () {
    return (
      <div>

        {
          this.props.errors.map((error) => {
            return <Alert key={error} color='danger'>{error.message}</Alert>
          })
        }
      </div>
    )
  }
}

Error.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default Error
