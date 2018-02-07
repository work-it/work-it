import axios from 'axios'
import history from '../../history'
import _ from 'lodash'
import moment from 'moment'
import { create } from 'domain';

/**
 * INITIAL STATE
 */



/**
 * ACTION TYPES
 */
const CREATE_PAIR = 'CREATE_PAIR';
const ADD_SESSION = 'ADD_SESSION';
const LOAD_SESSIONS = 'LOAD_SESSIONS';

/**
 * ACTION CREATORS
 */

 const createPair = (updatedSchedule) => ({type: CREATE_PAIR, updatedSchedule});
 const addSession = (updatedSchedule) => ({type: ADD_SESSION , updatedSchedule})
 const loadSessions = (sessions) => ({type: LOAD_SESSIONS, sessions})

 export const createPairMiddleware = (session) => {
   return (dispatch, getState) => {
    axios.put('/api/schedule', session)
    .then(res => res.data)
    .then(res => {
      if (!res.err) {
        console.log("res", res[session.id]);
        dispatch(createPair(res[session.id]))
      }
    })
   }
 }

 export const addSessionMiddleware = (date, start, end, intervieweeId) => {
  return (dispatch, getState) => {
    const formattedDate = date.format('YYYY-MM-DD');

    const startHour = start.split(':')[0];
    const endHour = end.split(':')[0];
    let newSessions = [];

    for (let i = startHour; i < endHour; i++) {
      const startTimeUTC = moment(`${i}:00`, 'HH:mmm').utc().format('HH:mm');

      const newSession = {
        date: formattedDate,
        userOne: getState().user.id,
        userTwo: null,
        id: getState().user.id+formattedDate+startTimeUTC,
        start: startTimeUTC,
        intervieweeId: intervieweeId

      }
      newSessions.push(newSession);
    }

    axios.post(`/api/schedule`, newSessions)
    .then(res => res.data)
    .then(res => dispatch(addSession(res)))
    .catch (console.log)
  }
}

export const fetchSchedule = () => dispatch => {
  axios.get('/api/schedule')
  .then (res => dispatch(loadSessions(res.data)))
  .catch(console.log)
}
/**
 * THUNK CREATORS
 */

/**
 * REDUCER
 */
export default function (state = [], action) {
  switch (action.type) {
    case CREATE_PAIR:
      const newState = [...state];
      const sess = state.find (sched => {
        return sched.id === action.updatedSchedule.id
      })
      sess.userTwo = action.updatedSchedule.userTwo;
      return newState
    case ADD_SESSION:
      return [...state, ...action.updatedSchedule]
    case LOAD_SESSIONS:
      return action.sessions
    default:
      return state
  }
}
