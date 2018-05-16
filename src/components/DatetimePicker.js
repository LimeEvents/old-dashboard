import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import { Button, Input } from 'reactstrap'

import 'react-datepicker/dist/react-datepicker.css'

class DatetimePicker extends Component {
  constructor (props) {
    super(props)
    this.onChangeDate = this.onChangeDate.bind(this)
    this.onChangeTime = this.onChangeTime.bind(this)
  }

  get milliseconds () {
    return this.props.value
  }

  get moment () {
    return moment(this.milliseconds)
  }

  get dateMilliseconds () {
    return this.moment.startOf('day').unix() * 1000
  }

  get timeMilliseconds () {
    return (this.moment.unix() * 1000) - this.dateMilliseconds
  }

  get date () {
    return this.moment.format('M/D/YY')
  }

  get time () {
    return this.moment.format('h:mma')
  }

  componentWillReceiveProps (props) {
  }

  onChangeTime (value) {
    value = this.dateMilliseconds + value
    this.props.onChange(value)
  }

  onChangeDate (value) {
    value = this.timeMilliseconds + (value.unix() * 1000)
    this.props.onChange(value)
  }

  render () {
    if (this.props.readonly) {
      return <div>{moment(this.props.value).format(this.props.format)}</div>
    }
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <DatePicker
          customInput={<Button>{this.date}</Button>}
          selected={this.jsDate}
          onChange={this.onChangeDate}
        />
        <Input type='select' onChange={(e) => this.onChangeTime(parseInt(e.target.value, 10))}>
          {
            new Array(10).fill(null).map((_, idx) => {
              return <option value={1000 * 60 * 30 * idx}>{moment().hours(19).minutes(30 * idx).format('h:mma')}</option>
            })
          }
        </Input>
      </div>
    )
  }
}

DatetimePicker.propTypes = {
  format: PropTypes.string,
  readonly: PropTypes.bool,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func
}

DatetimePicker.defaultProps = {
  format: 'M/D/YY h:mma',
  readonly: false,
  onChange: () => {}
}

export default DatetimePicker
