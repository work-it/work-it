import axios from 'axios'
import _ from 'lodash'
import zipcodes from 'zipcodes'
import { loadavg } from 'os';

/**
 * ACTION TYPES
 */
const SEARCH = 'SEARCH';
const FETCH_SAVED = 'FETCH_SAVED';
const LOAD_JOB = 'LOAD_JOB'
const FETCH_APPLIED = 'FETCH_APPLIED';

/**
 * INITIAL STATE
 */
const defaultJobs = [];
/**
 * ACTION CREATORS
 */
const search = jobs => ({type: SEARCH, jobs})
const fetchSavedJobs = savedJobs => ({type: FETCH_SAVED, savedJobs})
const loadJob = job => ({type: LOAD_JOB, job})
const fetchApplied = appliedJobs => ({type: FETCH_APPLIED, appliedJobs})
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

export const fetchAppliedJobsThunk = (userId) => {
  return (dispatch) => {
    // Fetch jobs from server based on favorites array
    axios.get(`/api/jobs/applied/${userId}`)
    .then(res => {
      dispatch(fetchApplied(res.data));
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
  .then(res => res.data )
  .then(job => {
    for (let key in job) {
      if (job.hasOwnProperty(key)) {
        console.log('Job Thunk', job[key])
        dispatch(loadJob(job[key]))
      }
    }
  })
  .catch(console.log)
}

/**
 * REDUCER
 */
export default function (state = defaultJobs, action) {
  switch (action.type) {
    case FETCH_APPLIED:
      return action.appliedJobs;
    case FETCH_SAVED:
      return action.savedJobs;
    case SEARCH:
      return action.jobs;
    case LOAD_JOB:
      return [...state, action.job]
    default:
      return state
  }
}
