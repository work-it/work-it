import axios from 'axios'
import history from '../../history'
import _ from 'lodash'

const defaultSchedule = {
  '013018': [
    {
      id: 0,
      userOne: 12345,
      userTwo: null,
      start: '09:00'
    }
  ],
  '020118': [
    {
      id: 1,
      userOne: 99999,
      userTwo: null,
      start: '10:00'
    }
  ],
  '020318': [
    {
      id: 2,
      userOne: 12345,
      userTwo: null,
      start: '09:00'
    },
    {
      id: 3,
      userOne: 99999,
      userTwo: 12345,
      start: '12:00'
    }
  ]
}

/**
 * ACTION TYPES
 */

/**
 * INITIAL STATE
 */

/**
 * ACTION CREATORS
 */
/**
 * THUNK CREATORS
 */

/**
 * REDUCER
 */
export default function (state = defaultSchedule, action) {
  switch (action.type) {
    default:
      return state
  }
}
