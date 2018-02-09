import axios from 'axios'
//import history from '../history'
import { hideLogin } from '../components/auth/auth-reducer'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
const SAVE_JOB = 'SAVE_JOB';
const REMOVE_SAVED_JOB = 'REMOVE_SAVED_JOB';


/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})
const saveJob = saved => ({type: SAVE_JOB, saved})
const removeSavedJob = saved => ({type: REMOVE_SAVED_JOB, saved})


/**
 * THUNK CREATORS
 */

export const saveJobThunk = (id) => {
  return (dispatch, getState) => {
    // Get the user id.
    const userId = getState().user.id;
    const alreadySaved = getState().user.saved;
    let saved;

    if (alreadySaved) saved = [...alreadySaved, id];
    else saved = [id];

    axios.put('/api/users/jobs', {userId, id})
    .then(res => {
      if (res.status === 200) {
        dispatch(saveJob(saved))
      }
    })
  }
}


// Remove userId from the savedBy array on the job in the job store
export const removeSavedJobThunk = (id) => {
  return (dispatch, getState) => {
    // Get the user id.
    const userId = getState().user.id;
    // Get all of the current jobs from store.
    const currentlySaved = [...getState().user.saved];
    // Get filtered jobs from store.
    let saved;
    if (currentlySaved) saved = currentlySaved.filter(savedId => savedId !== id);
    else saved = [];

    axios.delete(`/api/users/jobs/${id}/${userId}`)
    .then(res => {
      if (res.status === 200) {
        dispatch(removeSavedJob(saved))
      }
    })
  }
}
export const me = () =>
  dispatch =>
    axios.get('/auth/me')
      .then(res =>
        dispatch(getUser(res.data || defaultUser)))
      .catch(err => console.log(err))

export const auth = (email, password, method, history) =>
  dispatch => {
    console.log("about to hit axios", email, password, method)
    axios.post(`/auth/${method}`, { email, password })
      .then(res => {
        dispatch(hideLogin())
        dispatch(getUser(res.data))
        if(method==='login')
          history.push('/')
        else 
          history.push('/profile/edit')
      }, authError => { // rare example: a good use case for parallel (non-catch) error handler
        dispatch(getUser({error: authError}))
      })
      .catch(dispatchOrHistoryErr => console.error(dispatchOrHistoryErr))
    }
export const logout = (history) =>
  dispatch =>
    axios.post('/auth/logout')
      .then(_ => {
        dispatch(removeUser())
        history.push('/')
      })
      .catch(err => console.log(err))


/**
 * REDUCER
 */
export default function (state = defaultUser, action) {
  switch (action.type) {
    case SAVE_JOB:
      return Object.assign({}, state, {saved: action.saved})
    case REMOVE_SAVED_JOB:
      return Object.assign({}, state, {saved: action.saved})
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return defaultUser

    default:
      return state
  }
}
