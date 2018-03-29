import React, { Component } from 'react'
import PropTypes from 'prop-types'
import currencyFormatter from 'currency-formatter'

class Currency extends Component {
  get symbol () {
    return currencyFormatter.findCurrency('USD').symbol
  }
  get units () {
    return currencyFormatter.format(this.props.value / 100, { code: 'USD' }).replace(this.symbol, '').split(this.decimal).shift()
  }
  get decimal () {
    return currencyFormatter.findCurrency('USD').decimalSeparator
  }
  get cents () {
    return currencyFormatter.format(this.props.value / 100, { code: 'USD' }).split(this.decimal).pop()
  }
  render () {
    return (
      <span style={{ ...styles.subtotal, ...this.props.style }}>
        <span style={styles.cents}>{this.symbol}</span>
        <span>{this.units}</span>
        <span style={styles.cents}>{this.decimal}{this.cents}</span>
      </span>
    )
  }
}

Currency.propTypes = {
  value: PropTypes.number.isRequired,
  style: PropTypes.object
}

Currency.defaultProps = {
  value: 0
}

export default Currency

const styles = {
  cents: {
    verticalAlign: 'text-top',
    fontSize: '0.6em',
    lineHeight: '1.6em'
  },
  subtotal: {
    fontSize: '24px'
  }
}
