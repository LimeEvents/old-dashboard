import React from 'react'
import { Alert } from 'reactstrap'
import Proptypes from 'prop-types'
import { withLoading } from './Loading'

const ReportCard = ({ primary, children, ...props }) => (
  <div style={{ fontSize: '24px', textAlign: 'center' }}>
    <Alert {...props}>
      {primary}<br />
      {children}
    </Alert>
  </div>
)

ReportCard.propTypes = {
  color: Proptypes.string,
  primary: Proptypes.string.isRequired,
  children: Proptypes.any
}

export default withLoading()(ReportCard)
