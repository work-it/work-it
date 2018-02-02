import axios from 'axios'
import _ from 'lodash'
import zipcodes from 'zipcodes'
import { loadavg } from 'os';

/**
 * ACTION TYPES
 */
const FILTER = 'FILTER';
const SEARCH = 'SEARCH';
const FETCH_FAVORITES = 'FETCH_FAVORITES'
const CLEAR_FILTER = 'CLEAR_FILTER'
const LOAD = 'LOAD'
/**
 * INITIAL STATE
 */
const defaultJobs = {};
/**
 * ACTION CREATORS
 */
const applyFilters = (filtered) => ({type: FILTER, filtered });
const loadJobs = (jobs) => ({type: LOAD, jobs})
const search = jobs => ({type: SEARCH, jobs})
const fetchFavoriteJobs = favoritesJobs => ({type: FETCH_FAVORITES, favoritesJobs})
export const clearFilters = () => ({type: CLEAR_FILTER})
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
    const userId = getState().user.id;
    console.log('id', id, 'userId', userId);
    axios.put('/api/jobs/save', {userId, id})
    .then(res => {
      if (res === 200) {
        // dispatch
        // update job object on store with userId
      }
    })
  }

  export const loadJobs = () => dispatch => {
    axios.get('/api/jobs')
    .then (res => res.data)
    .then (jobs => dispatch(loadJobs(jobs)))
    .catch (console.log)
  }
}

/**
 * REDUCER
 */
export default function (state = defaultJobs, action) {
  switch (action.type) {
    case CLEAR_FILTER:
      return Object.assign({}, state, {filtered: []})
    case SEARCH:
      return Object.assign({}, state, {all: action.jobs})
    case FETCH_FAVORITES:
      return action.favoritesJobs
    case FILTER:
      return Object.assign({}, state, {filtered: action.filtered})
    case LOAD:
      return Object.assign({}, state, {all: action.jobs})
    default:
      return state
  }
}
