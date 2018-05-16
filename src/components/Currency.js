import React, { Component } from 'react'
import PropTypes from 'prop-types'
import currencyFormatter from 'currency-formatter'

class Currency extends Component {
  get value () {
    return Math.abs(this.props.value)
  }
  get isNegative () {
    return this.props.value < 0
  }
  get symbol () {
    return currencyFormatter.findCurrency('USD').symbol
  }
  get units () {
    return currencyFormatter.format(this.value / 100, { code: 'USD' }).replace(this.symbol, '').split(this.decimal).shift()
  }
  get decimal () {
    return currencyFormatter.findCurrency('USD').decimalSeparator
  }
  get cents () {
    return currencyFormatter.format(this.value / 100, { code: 'USD' }).split(this.decimal).pop()
  }
  render () {
    return (
      <span style={{ ...styles.subtotal, ...this.props.style }}>
        { this.isNegative && <span>(</span> }
        { this.props.flat ? this.symbol : <span style={styles.cents}>{this.symbol}</span> }
        <span>{this.units}</span>
        { this.props.flat ? this.decimal + this.cents : <span style={styles.cents}>{this.decimal}{this.cents}</span> }
        { this.isNegative && <span>)</span> }
      </span>
    )
  }
}

Currency.propTypes = {
  value: PropTypes.number.isRequired,
  style: PropTypes.object,
  flat: PropTypes.boolean
}

Currency.defaultProps = {
  value: 0,
  flat: false
}

export default Currency

const styles = {
  cents: {
    verticalAlign: 'text-top',
    fontSize: '0.6em',
    lineHeight: '1.6em'
  },
  subtotal: {
  }
}
