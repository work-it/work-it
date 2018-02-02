import axios from 'axios'
import _ from 'lodash'
import zipcodes from 'zipcodes'

/**
 * ACTION TYPES
 */
const FILTER = 'FILTER';
const CLEAR_FILTER = 'CLEAR_FILTER';
const SAVE_JOB = 'SAVE_JOB';

/**
 * INITIAL STATE
 */
const defaultJobs = [];
/**
 * ACTION CREATORS
 */
const applyFilters = (filtered) => ({type: FILTER, filtered });
export const clearFilters = () => ({type: CLEAR_FILTER})
const saveJob = updatedJobs => ({type: SAVE_JOB, updatedJobs})
/**
 * THUNK CREATORS
 */
export const applyFiltersThunk = (filters) => {
  return (dispatch, getState) => {
    const { type, radius, zip, experience} = filters;
    let filtered = getState().jobs.all;
    if (type) {
      filtered = filtered.filter(function(job){
        return job.type === type
      });
    }
    if (experience) {
      filtered = filtered.filter(function(job){
        return job.experience === experience
      });
    }
    if (radius) {
      const surroundingZips = zipcodes.radius(zip, radius);
      filtered = filtered.filter(function(job){
        return surroundingZips.includes(job.zip);
      });
    }

    dispatch(applyFilters(filtered));
  }
}

export const updateFilteredJobsThunk = (id) => {
  return (dispatch, getState) => {
    // Get the user id.
    const userId = getState().user.id;
    // Get all of the current jobs from store.
    // Get filtered jobs from store.
    if (getState().filteredJobs) {
      const filteredJobs = [...getState().filteredJobs];

      // If there are jobs in the filtered array, update them too.
      const filteredJobsUpdate = filteredJobs && filteredJobs.map(job => {
        if (job.id === id) {
          job.savedBy.push(userId);
        }
        return job;
      })

      dispatch(saveJob(filteredJobsUpdate))
    }
  }
}

/**
 * REDUCER
 */
export default function (state = defaultJobs, action) {
  switch (action.type) {
    case SAVE_JOB:
      return action.updatedJobs
    case CLEAR_FILTER:
      return defaultJobs
    case FILTER:
      return action.updatedJobs
    default:
      return state
  }
}
