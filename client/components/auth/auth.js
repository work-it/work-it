import React from 'react'
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import {auth} from '../../store'
import { Icon } from 'semantic-ui-react'
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons'
import {toggleShow, toggleType} from './auth-reducer'
import './auth.css'

/**
 * COMPONENT
 */
const AuthForm = (props) => {
  const {name, displayName, handleSubmit, error, handleHideLogin, authShow, handleToggleType, authView} = props
  let displayGoogle =  <a href='/auth/google'> <GoogleLoginButton text={`${displayName} with Google`}/></a>
  let displayFB = <a href='/auth/facebook'><FacebookLoginButton text={`${displayName} with Facebook`}/></a>


  return (
    <div className="login">
      <div className="login-panel">
       <Icon name='x' size='large' onClick={() => handleHideLogin(authShow)}/>
        <form onSubmit={handleSubmit} name={name}>
          <div>
            <label htmlFor="email"><small>Email</small></label>
            <input name="email" type="text" />
          </div>
          <div>
            <label htmlFor="password"><small>Password (min 6 characters)</small></label>
            <input name="password" type="password" />
          </div>
          <div>
            <button type="submit">{displayName}</button>
          </div>
          {error && error.response && <div> {error.response.data} </div>}
        </form>

              {displayGoogle}
              {displayFB}
        {
          name === 'login' ?
          <button onClick={() => handleToggleType(authView)}>Sign Up</button> :
          <button onClick={() => handleToggleType(authView)}>Login</button>
        }
      </div>
    </div>
  )
}



/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = (state) => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error,
    authShow: state.auth.show,
    authView: state.auth.view
  }
}

const mapSignup = (state) => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error,
    authShow: state.auth.show,
    authView: state.auth.view
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSubmit (evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      dispatch(auth(email, password, formName))
    },
    handleHideLogin(authShow) {
      dispatch(toggleShow(authShow))
    },
    handleToggleType(authView) {
      dispatch(toggleType(authView));
    }
  }
}

export const Login = withRouter(connect(mapLogin, mapDispatch)(AuthForm))
export const Signup = withRouter(connect(mapSignup, mapDispatch)(AuthForm))

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
