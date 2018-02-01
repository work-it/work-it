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
const defaultProfile = {
  firstName: '',
  lastName: '',
  position: '',
  location: '',
  experience: '',
  type: '',
  minSalary: '',
  maxSalary: '',
  imgUrl: '',
  videoUrl: '',
  userDesc: ''
}

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

export const updateProfileThunk = (data) => {
  return (dispatch, getState) => {
    const userId = getState().user.id;

    axios.put(`/api/profiles/${userId}`, data)
      .then(res => {
       if (res.status === 200) {
        dispatch(updateProfile(data));
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
      return Object.assign({}, state, action.data);
    case GET_PROFILE:
      return action.data
    default:
      return state
  }
}
