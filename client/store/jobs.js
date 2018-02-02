import axios from 'axios'
import _ from 'lodash'
import zipcodes from 'zipcodes'
import { loadavg } from 'os';

/**
 * ACTION TYPES
 */
const SEARCH = 'SEARCH';
const SAVE_JOB = 'SAVE_JOB';
const REMOVE_SAVED_JOB = 'REMOVE_SAVED_JOB';
const FETCH_SAVED = 'FETCH_SAVED';
const LOAD_JOB = 'LOAD_JOB'

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
const fetchSavedJobs = savedJobs => ({type: FETCH_SAVED, savedJobs})
const loadJob = job => ({type: LOAD_JOB, job})
/**
 * THUNK CREATORS
 */
// Fetch all jobs with the userId in the savedBy array on the job.
export const fetchSavedJobsThunk = (userId) => {
  return (dispatch) => {
    // Fetch jobs from server based on favorites array
    axios.get(`/api/jobs/saved/${userId}`)
    .then(res => {
      dispatch(fetchSavedJobs(res.data));
    })
  }
}


export const jobSearchThunk = (term, location) => {
  return (dispatch) => {
    axios.get(`/api/jobs/search/${location}/${term}`)
      .then(res => dispatch(search(res.data)))
  }
}

export const loadJobThunk = (id) => dispatch => {
  axios.get(`/api/jobs/${id}`)
  .then (res => res.data )
  .then (job => dispatch (loadJob(job)))
  .catch (console.log)
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

// Remove userId from the savedBy array on the job in the job store
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

    axios.delete(`/api/jobs/saved/${id}/${userId}`)
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
    case FETCH_SAVED:
      return action.savedJobs;
    case SAVE_JOB:
      return action.updatedJobs;
    case REMOVE_SAVED_JOB:
      return action.updatedJobs;
    case SEARCH:
      return action.jobs;
    case LOAD_JOB:
      return [...state, action.job]
    default:
      return state
  }
}
