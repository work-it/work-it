import axios from 'axios'

/**
 * ACTION TYPES
 */
const FETCH_SAVED = 'FETCH_SAVED';

/**
 * INITIAL STATE
 */
const defaultJobs = [];
/**
 * ACTION CREATORS
 */
const fetchSavedJobs = savedJobs => ({type: FETCH_SAVED, savedJobs})

/**
 * THUNK CREATORS
 */
export const fetchSavedJobsThunk = (userId) => {
  return (dispatch) => {
    // Fetch jobs from server based on favorites array
    axios.get(`/api/jobs/saved/${userId}`)
    .then(res => {
      dispatch(fetchSavedJobs(res.data));
    })
  }
}

/**
 * REDUCER
 */
export default function (state = defaultJobs, action) {
  switch (action.type) {
    case FETCH_SAVED:
      return action.savedJobs;
    default:
      return state
  }
}
