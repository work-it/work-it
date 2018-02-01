import axios from 'axios'
//import history from '../history'

/**
 * ACTION TYPES
 */
const UPDATE_NOTES = 'UPDATE_NOTES';
const ADD_MESSAGE = 'ADD_MESSAGE';
const ARCHIVE = 'ARCHIVE';

/**
 * INITIAL STATE
 */
const applications = [{
  id: 343243,
  jobId: 1,
  status: 'apply',
  notes: 'Lorem ipsum dolor amet farm-to-table kale chips hella cronut portland. Cloud bread health goth bushwick mlkshk. Lumbersexual flexitarian venmo, quinoa green juice selfies small batch vape brunch echo park. Snackwave kale chips pinterest succulents viral DIY.',
  archived: false,
  chat: '<strong>Me: </strong> Lorem ipsum dolor amet farm-to-table kale chips hella cronut portland.'
}, {
  id: 123434,
  jobId: 2,
  status: 'review',
  notes: 'Lorem ipsum dolor amet farm-to-table kale chips hella cronut portland. Cloud bread health goth bushwick mlkshk. Lumbersexual flexitarian venmo, quinoa green juice selfies small batch vape brunch echo park. Snackwave kale chips pinterest succulents viral DIY.',
  archived: false,
  chat: '<strong>Me: </strong> Lorem ipsum dolor amet farm-to-table kale chips hella cronut portland.'
}, {
  id: 324234,
  jobId: 3,
  status: 'interview',
  notes: 'Lorem ipsum dolor amet farm-to-table kale chips hella cronut portland. Cloud bread health goth bushwick mlkshk. Lumbersexual flexitarian venmo, quinoa green juice selfies small batch vape brunch echo park. Snackwave kale chips pinterest succulents viral DIY.',
  archived: false,
  chat: '<strong>Me: </strong> Lorem ipsum dolor amet farm-to-table kale chips hella cronut portland.'
}, {
  id: 324134,
  jobId: 1,
  status: 'offer',
  notes: 'Lorem ipsum dolor amet farm-to-table kale chips hella cronut portland. Cloud bread health goth bushwick mlkshk. Lumbersexual flexitarian venmo, quinoa green juice selfies small batch vape brunch echo park. Snackwave kale chips pinterest succulents viral DIY.',
  archived: false,
  chat: '<strong>Me: </strong> Lorem ipsum dolor amet farm-to-table kale chips hella cronut portland.'
}]

/**
 * ACTION CREATORS
 */


const archive = updatedApplications => ({type: ARCHIVE, updatedApplications})
const updateNotes = updatedApplications => ({type: UPDATE_NOTES, updatedApplications})
const addMessage = updatedApplications => ({type: ADD_MESSAGE, updatedApplications})

/**
 * THUNK CREATORS
 */
export const updateNotesMiddleware = (applicationId, notes) => {
  return (dispatch, getState) => {
    let updatedApplications = [...getState().applications].map(application => {
      if (application.id === applicationId) {
        application.notes = notes;
      }
      return application;
    })
   //TODO: send message to server to broadcast to employer
   dispatch(updateNotes(updatedApplications));
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

   dispatch(archive(updatedApplications));
  }
}

export const addMessageMiddleware = (applicationId, message) => {
  return (dispatch, getState) => {
    let updatedApplications = [...getState().applications].map(application => {
      if (application.id === applicationId) {
        application.chat += `<br/><strong>Me: </strong> ${message}`;
      }
      return application;
    })

   dispatch(addMessage(updatedApplications));
  }
}

/**
 * REDUCER
 */
export default function (state = applications, action) {
  switch (action.type) {
    case ADD_MESSAGE:
      return action.updatedApplications
    case ARCHIVE:
      return action.updatedApplications
    case UPDATE_NOTES:
      return action.updatedApplications
    default:
      return state
  }
}
