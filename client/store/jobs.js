import axios from 'axios'
import _ from 'lodash'
import zipcodes from 'zipcodes'

/**
 * ACTION TYPES
 */
const SEARCH = 'SEARCH';
const SAVE_JOB = 'SAVE_JOB';
const REMOVE_SAVED_JOB = 'REMOVE_SAVED_JOB';

/**
 * INITIAL STATE
 */
const defaultJobs = [];
/**
 * ACTION CREATORS
 */
const search = jobs => ({type: SEARCH, jobs})
const saveJob = updatedJobs => ({type: SAVE_JOB, updatedJobs})
const removeSavedJob = updatedJobs => ({type: REMOVE_SAVED_JOB, updatedJobs})
/**
 * THUNK CREATORS
 */
export const jobSearchThunk = (term, location) => {
  return (dispatch) => {
    axios.get(`/api/jobs/search/${location}/${term}`)
      .then(res => dispatch(search(res.data)))
  }
}

export const saveJobThunk = (id) => {
  return (dispatch, getState) => {
    // Get the user id.
    const userId = getState().user.id;
    // Get all of the current jobs from store.
    const allJobs = [...getState().jobs];
    // Get filtered jobs from store.
    const allJobsUpdate = allJobs.map(job => {
      if (job.id === id) {
        if (job.savedBy) job.savedBy.push(userId);
        else job.savedBy = [userId];
      }
      return job;
    })

    axios.put('/api/jobs/save', {userId, id})
    .then(res => {
      if (res.status === 200) {
        dispatch(saveJob(allJobsUpdate))
      }
    })
  }
}

export const removeSavedJobThunk = (id) => {
  return (dispatch, getState) => {
    // Get the user id.
    const userId = getState().user.id;
    // Get all of the current jobs from store.
    const allJobs = [...getState().jobs];
    // Get filtered jobs from store.
    const allJobsUpdate = allJobs.map(job => {
      if (job.id === id && job.savedBy) {
        job.savedBy = job.savedBy.filter(savedUserId => savedUserId !== userId)
      }
      return job;
    })

    axios.delete('/api/jobs/save', {userId, id})
    .then(res => {
      if (res.status === 200) {
        dispatch(removeSavedJob(allJobsUpdate))
      }
    })
  }
}

/**
 * REDUCER
 */
export default function (state = defaultJobs, action) {
  switch (action.type) {
    case SAVE_JOB:
      return action.updatedJobs;
    case REMOVE_SAVED_JOB:
      return action.updatedJobs;
    case SEARCH:
      return action.jobs;
    default:
      return state
  }
}
