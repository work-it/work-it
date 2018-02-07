import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { Button } from 'semantic-ui-react'
import './user-home.css'

/**
 * COMPONENT
 */
export const UserHome = (props) => {
  const {email} = props

  return (
    <div className="home">
      <div className="banner">
        <dv className="row">
          <div className="col-sm-12">
            <h1 className="text-center">Always Know Where You Stand</h1>
          </div>
          <div className="col-sm-12">
            <h2 className="text-center">With Our Transparent Hiring Process</h2>
          </div>
          <div className="col-sm-12 text-center buttons-wrapper">
            <Button size="massive" basic color="blue">Login</Button>
            <Button size="massive" basic color="blue">Sign Up</Button>
          </div>
        </dv>
      </div>
      <div className="left-feature feature">
        <div className="row">
          <div clasName="col-sm-12">
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
            <div className="feature-img-1"></div>
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

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
