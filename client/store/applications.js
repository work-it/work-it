import axios from 'axios'
import _ from 'lodash'

/**
 * ACTION TYPES
 */
const APPLY = 'APPLY';
const FETCH_APPLICTIONS = 'FETCH_APPLICATIONS'
const UPDATE_NOTES = 'UPDATE_NOTES';
const ADD_MESSAGE = 'ADD_MESSAGE';
const ARCHIVE = 'ARCHIVE';

/**
 * INITIAL STATE
 */
const defaultApplications = [];
/**
 * ACTION CREATORS
 */
const apply = updateApplications => ({type: APPLY, updateApplications})
const fetchApplications = applications => ({type: FETCH_APPLICTIONS, applications})
const archive = updatedApplications => ({type: ARCHIVE, updatedApplications})
const updateNotes = updatedApplications => ({type: UPDATE_NOTES, updatedApplications})
const addMessage = updatedApplications => ({type: ADD_MESSAGE, updatedApplications})

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

export const updateNotesMiddleware = (applicationId, notes) => {
  return (dispatch, getState) => {
    let updatedApplications = [...getState().applications].map(application => {
      if (application.id === applicationId) {
        application.notes = notes;
      }
      return application;
    })

   axios.put(`/api/applications/${applicationId}/notes`, {notes})
    .then(() =>  dispatch(updateNotes(updatedApplications)));
  }
}

export const archiveMiddleware = applicationId => {
  return (dispatch, getState) => {
    let updatedApplications = [...getState().applications].map(application => {
      if (application.id === applicationId) {
        application.archived = true;
      }
      return application;
    })

    axios.put(`/api/applications/${applicationId}/archive`)
    .then(() => dispatch(archive(updatedApplications)));
  }
}

export const addMessageMiddleware = (applicationId, message) => {
  return (dispatch, getState) => {
    let updatedMessage;
    let updatedApplications = [...getState().applications].map(application => {
      if (application.id === applicationId) {
        application.chat += `<strong>Me: </strong> ${message}<br/>`;
        updatedMessage = application.chat;
      }
      return application;
    })

    axios.put(`/api/applications/${applicationId}/message`, {message: updatedMessage})
    .then(() => dispatch(addMessage(updatedApplications)));
  }
}


/**
 * REDUCER
 */
export default function (state = defaultApplications, action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return action.updatedApplications
    case ARCHIVE:
      return action.updatedApplications
    case UPDATE_NOTES:
      return action.updatedApplications
    case APPLY:
      return action.updateApplications
    case FETCH_APPLICTIONS:
      return action.applications
    default:
      return state
  }
}