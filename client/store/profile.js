import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const UPDATE_PROFILE = 'UPDATE_PROFILE'
const GET_PROFILE = 'GET_PROFILE'

/**
 * INITIAL STATE
 */
const defaultProfile = {}

/**
 * ACTION CREATORS
 */
const updateProfile = data => ({type: UPDATE_PROFILE, data})
const getProfile = data => ({type: GET_PROFILE, data})

/**
 * THUNK CREATORS
 */
export const getProfileThunk = () => {
  return (dispatch, getState) => {
    const userId = getState().user.id;

    axios.get(`/api/profiles/${userId}`)
      .then(res => {
        dispatch(getProfile(res.data));
      })
  }
}

// DONT MODIFY, IT SHOULD WORK WITH WHATEVER IS PASSED IN!
export const updateProfileThunk = (data) => {
  return (dispatch, getState) => {
    // Get user from the current redux store
    const userId = getState().user.id;
    const profile = Object.assign({}, getState().profile, data);

    // Get profile for the current logged in user
    axios.put(`/api/profiles/${userId}`, profile)
      .then(res => {
       if (res.status === 200) {

        // Dispatch action creator to update the local redux store
        dispatch(updateProfile(profile));
       }
      })
  }
}

/**
 * REDUCER
 */
export default function (state = defaultProfile, action) {
  switch (action.type) {
    case UPDATE_PROFILE:
      // Create a copy of the current profiles store state and update key/value pairs
      return Object.assign({}, state, action.data);
    case GET_PROFILE:
      // Replace the current profile store state with the profile retrieved from Firebase
      return action.data
    default:
      return state
  }
}
