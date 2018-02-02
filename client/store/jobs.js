import axios from 'axios'
import _ from 'lodash'
import zipcodes from 'zipcodes'

/**
 * ACTION TYPES
 */
const FILTER = 'FILTER';
const SEARCH = 'SEARCH';
const FETCH_FAVORITES = 'FETCH_FAVORITES';
const CLEAR_FILTER = 'CLEAR_FILTER';
const SAVE_JOB = 'SAVE_JOB';

/**
 * INITIAL STATE
 */
const defaultJobs = {};
/**
 * ACTION CREATORS
 */
const applyFilters = (filtered) => ({type: FILTER, filtered });
const search = jobs => ({type: SEARCH, jobs})
const fetchFavoriteJobs = favoritesJobs => ({type: FETCH_FAVORITES, favoritesJobs})
export const clearFilters = () => ({type: CLEAR_FILTER})
const saveJob = updatedJobs => ({type: SAVE_JOB, updatedJobs})
/**
 * THUNK CREATORS
 */
export const jobSearchThunk = (term, location) => {
  return (dispatch) => {
    axios.get(`/api/jobs/search/${location}/${term}`)
      .then(res => dispatch(search(res.data)))
  }
}

export const applyFiltersThunk = (filters) => {
  return (dispatch, getState) => {
    const { type, radius, zip, experience, exclude} = filters;
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

export const fetchFavoriteJobsThunk = (favorites) => {
  return (dispatch, getState) => {
    // Fetch jobs from server based on favorites array
    let favoritesJobs = getState().jobs;
    dispatch(fetchFavoriteJobs(favoritesJobs));
  }
}

export const saveJobThunk = (id) => {
  return (dispatch, getState) => {
    // Get the user id.
    const userId = getState().user.id;
    // Get all of the current jobs from store.
    const allJobs = [...getState().jobs.all];
    console.log('allJobs', allJobs)
    // Get filtered jobs from store.
    const filteredJobs = getState().jobs.filtered && [...getState().jobs.filtered];
    console.log('filteredJobs', filteredJobs);
    const allJobsUpdate = allJobs.map(job => {
      if (job.id === id) {
        if (job.savedBy) job.savedBy.push(userId);
        else job.savedBy = [userId];
      }
      return job;
    })

    // If there are jobs in the filtered array, update them too.
    const filteredJobsUpdate = filteredJobs && filteredJobs.map(job => {
      if (job.id === id) {
        job.savedBy.push(userId);
      }
      return job;
    })

    const updatedJobs = {all: allJobsUpdate, filtered: filteredJobsUpdate};

    axios.put('/api/jobs/save', {userId, id})
    .then(res => {
      if (res.status === 200) {
        dispatch(saveJob(updatedJobs))
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
    case CLEAR_FILTER:
      return Object.assign({}, state, {filtered: []})
    case SEARCH:
      return Object.assign({}, state, {all: action.jobs})
    case FETCH_FAVORITES:
      return action.favoritesJobs
    case FILTER:
      return Object.assign({}, state, {filtered: action.filtered})
    default:
      return state
  }
}
