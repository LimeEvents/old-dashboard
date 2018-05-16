import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input } from 'reactstrap'

class CurrencyInput extends Component {
  constructor (props) {
    super(props)

    this.state = {
      value: this.centsToDollar(props.value || 0)
    }
  }

  centsToDollar (cents) {
    return (cents / 100).toFixed(2)
  }

  dollarsToCents (dollars) {
    let value = parseFloat(dollars.replace(/[^0-9.]+/, ''))
    value *= 100
    return value
  }

  componentWillReceiveProps (props) {
    this.setState({ value: this.centsToDollar(props.value || 0) })
  }

  render () {
    return (
      <Input
        value={this.state.value}
        onBlur={() => {
          this.setState({ value: parseFloat(this.state.value).toFixed(2) }, () => {
            this.props.onChange(this.dollarsToCents(this.state.value))
          })
        }}
        onChange={(e) => this.setState({ value: e.target.value })}
      />
    )
  }
}

CurrencyInput.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func
}

CurrencyInput.defaultProps = {
  value: 0,
  onChange: () => {}
}

export default CurrencyInput
