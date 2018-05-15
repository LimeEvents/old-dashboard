import React, { Component } from 'react'
import Fade from 'material-ui/transitions/Fade'
import { CircularProgress } from 'material-ui/Progress'
import { branch, renderComponent } from 'recompose'

class Loading extends Component {
  render () {
    return (
      <Fade
        in
        style={{
          transitionDelay: '800ms'
        }}
        unmountOnExit
      >
        <CircularProgress />
      </Fade>
    )
  }
}

export default Loading

export function withLoading (component = Loading) {
  return branch(
    props => props.data && props.data.loading,
    renderComponent(component)
  )
}
