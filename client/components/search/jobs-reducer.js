import axios from 'axios'
import history from '../../history'
import _ from 'lodash'
import { defaultJobs } from './default-jobs'
import zipcodes from 'zipcodes'

/**
 * ACTION TYPES
 */
const FILTER = 'FILTER';
const FETCH_FAVORITES = 'FETCH_FAVORITES'

/**
 * INITIAL STATE
 */

/**
 * ACTION CREATORS
 */
const applyFilters = (filtered) => {
  return {type: FILTER, filtered }
}

const fetchFavoriteJobs = favoritesJobs => ({type: FETCH_FAVORITES, favoritesJobs})
/**
 * THUNK CREATORS
 */

export const applyFiltersThunk = (filters) => {
  return (dispatch, getState) => {
    const { type, radius, zip, experience, exclude} = filters;
    let filtered = defaultJobs;
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
    if (exclude) {
      // What do we want to exclude on??
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

/**
 * REDUCER
 */
export default function (state = defaultJobs, action) {
  switch (action.type) {
    case FETCH_FAVORITES:
      return action.favoritesJobs
    case FILTER:
      return action.filtered
    default:
      return state
  }
}
