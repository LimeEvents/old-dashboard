import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { branch, renderComponent } from 'recompose'
import Transition from 'react-transition-group/Transition'

const duration = 300

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0
}

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 }
}

const Fade = ({ in: inProp, children }) => (
  <Transition in={inProp} timeout={duration}>
    {(state) => (
      <div style={{
        ...defaultStyle,
        ...transitionStyles[state]
      }}>
        {children}
      </div>
    )}
  </Transition>
)

Fade.propTypes = {
  in: PropTypes.bool,
  children: PropTypes.any
}

const loadingStyles = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100px'
}

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
        <div style={loadingStyles}>
          <div className='la-ball-grid-pulse la-dark'>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </Fade>
    )
  }
}

export default Loading

export function withLoading (component = Loading, test = props => {
  if (props.loading) return true
  return props.data && props.data.loading
}) {
  return branch(
    test,
    renderComponent(component)
  )
}
