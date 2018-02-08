import axios from 'axios'
//import history from '../history'

/**
 * ACTION TYPES
 */
const TOGGLE_SHOW = 'TOGGLE_SHOW';
const TOGGLE_VIEW = 'TOGGLE_VIEW';
const HOME_LOGIN = 'HOME_LOGIN';
const HOME_SIGNUP = 'HOME_SIGNUP';
const HIDE_LOGIN = 'HIDE_LOGIN';

/**
 * INITIAL STATE
 */
const defaultState = {show: false, view: 'login'}

/**
 * ACTION CREATORS
 */
export const toggleShow = (currentlyShown) => ({type: TOGGLE_SHOW, show: !currentlyShown});
export const hideLogin = () => ({type: HIDE_LOGIN})

export const toggleType = (currentView) => {
  console.log('current type', currentView);
  if (currentView === 'login') currentView = 'signup'
  else currentView = 'login'

  return ({type: TOGGLE_VIEW, view: currentView});
}

export const homeLogin = () => ({type: HOME_LOGIN});
export const homeSignup = () => ({type: HOME_SIGNUP});

/**
 * THUNK CREATORS
 */


/**
 * REDUCER
 */
export default function (state = defaultState, action) {
  switch (action.type) {
    case HIDE_LOGIN:
      return Object.assign({}, state, {show: false, view: 'login'})
    case HOME_LOGIN:
      return Object.assign({}, state, {show: true, view: 'login'})
    case HOME_SIGNUP:
      return Object.assign({}, state, {show: true, view: 'signup'})
    case TOGGLE_SHOW:
      return Object.assign({}, state, {show: action.show})
    case TOGGLE_VIEW:
      return Object.assign({}, state, {view: action.view})
    default:
      return state
  }
}
