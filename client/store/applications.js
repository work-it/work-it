import axios from 'axios'
import _ from 'lodash'

/**
 * ACTION TYPES
 */
const APPLY = 'APPLY';
const FETCH_APPLICTIONS = 'FETCH_APPLICATIONS'

/**
 * INITIAL STATE
 */
const defaultJobs = [];
/**
 * ACTION CREATORS
 */
const apply = updateApplications => ({type: APPLY, updateApplications})
const fetchApplications = applications => ({type: FETCH_APPLICTIONS, applications})

/**
 * THUNK CREATORS
 */
export const fetchApplicationsThunk = (userId) => {
  return (dispatch) => {
    // Fetch jobs from server based on favorites array
    axios.get(`/api/applications/${userId}`)
    .then(res => {
      dispatch(fetchApplications(res.data));
    })
  }
}


export const applyThunk = (id, coverLetter) => {
  return (dispatch, getState) => {
    // Get the user id.
    const userId = getState().user.id;

    // Create a new application object.
    const newApplication = {
      jobId: id,
      status: 'apply',
      archived: false,
      notes: '',
      chat: '',
      coverLetter: coverLetter
    }

    // Create a copy of the current application store and add in the new application.
    const allApplications = [...getState().applications, newApplication];

    // Post request to server to add application to Firebase
    axios.post('/api/applications/', {application: newApplication, userId})
    .then(res => {
      if (res.status === 200) {
        // Call action creator to update the redux store on successful post.
        dispatch(apply(allApplications))
      }
    })
  }
}


/**
 * REDUCER
 */
export default function (state = defaultJobs, action) {
  switch (action.type) {
    case APPLY:
      return action.updateApplications
    case FETCH_APPLICTIONS:
      return action.applications
    default:
      return state
  }
}
