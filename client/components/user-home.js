import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { Button } from 'semantic-ui-react'
import { homeLogin, homeSignup } from './auth/auth-reducer'
import './user-home.css'

/**
 * COMPONENT
 */
export const UserHome = (props) => {
  const {handleHomeLogin, handleHomeSignup} = props

  return (
    <div className="home">
      <div className="banner">
        <div className="row banner-text">
          <div className="col-sm-12">
            <h1 className="text-center">Always know where you stand</h1>
          </div>
          <div className="col-sm-12">
            <h2 className="text-center">with our transparent hiring process</h2>
          </div>
          <div className="col-sm-12 text-center buttons-wrapper">
                <Button size="massive" basic color="blue" onClick={() => handleHomeLogin()}>Login</Button>
                <Button size="massive" basic color="black" onClick={() => handleHomeSignup()}>Sign Up</Button>
            </div>
        </div>
      </div>
      <div className="left-feature feature">
        <div className="row">
          <div className="col-sm-12">
            <h1 className="text-center heading">Our Features</h1>
          </div>
          <div className="col-sm-4">
            <div className="feature-img-1"></div>
            <h2 className="text-center feature-title">Application Tracking</h2>
            <h4 className="text-center">View the status of your application from apply to hire.</h4>
          </div>
          <div className="col-sm-4">
            <div className="feature-img-1"></div>
            <h2 className="text-center feature-title">Solo / Pair Practice</h2>
            <h4 className="text-center">Practice interview questions with another user or solo.</h4>
          </div>
          <div className="col-sm-4">
            <div className="feature-img-3"></div>
            <h2 className="text-center feature-title">Real-time Messaging</h2>
            <h4 className="text-center">Message directly with employers regarding your application.</h4>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    email: state.user.email
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleHomeLogin() {
      dispatch(homeLogin());
    },
    handleHomeSignup() {
      dispatch(homeSignup());
    }
  }
}

export default connect(mapState, mapDispatch)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
