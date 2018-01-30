import axios from 'axios'
//import history from '../history'

/**
 * ACTION TYPES
 */
const TOGGLE_SHOW = 'TOGGLE_SHOW';
const TOGGLE_VIEW = 'TOGGLE_VIEW';

/**
 * INITIAL STATE
 */
const defaultState = {show: false, view: 'login'}

/**
 * ACTION CREATORS
 */
export const toggleShow = (currentlyShown) => ({type: TOGGLE_SHOW, show: !currentlyShown});

export const toggleType = (currentView) => {
  console.log('current type', currentView);
  if (currentView === 'login') currentView = 'signup'
  else currentView = 'login'

  return ({type: TOGGLE_VIEW, view: currentView});
}

/**
 * THUNK CREATORS
 */


/**
 * REDUCER
 */
export default function (state = defaultState, action) {
  switch (action.type) {
    case TOGGLE_SHOW:
      return Object.assign({}, state, {show: action.show})
    case TOGGLE_VIEW:
      return Object.assign({}, state, {view: action.view})
    default:
      return state
  }
}
