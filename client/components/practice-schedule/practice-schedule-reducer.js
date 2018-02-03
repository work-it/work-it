import axios from 'axios'
import history from '../../history'
import _ from 'lodash'
import moment from 'moment'

/**
 * INITIAL STATE
 */

// const defaultSchedule = [{
//       date: '2018-02-02',
//       id: 453,
//       userOne: 12345,
//       userTwo: null,
//       start: '02:00',
//       recordingURL: 'some-firebase-public-url',
//       status: 'waiting'
//       },
//       {
//       date: '2018-02-04',
//       id: 444,
//       userOne: 55555,
//       userTwo: null,
//       start: '03:00',
//       recordingURL: 'some-firebase-public-url',
//       status: 'waiting'
//       },
//       {
//       date: '2018-01-31',
//       id: 235,
//       userOne: 12345,
//       userTwo: null,
//       start: '01:00',
//       recordingURL: 'some-firebase-public-url',
//       status: 'paired'
//       },
//       {
//       date: '2018-02-03',
//       id: 123,
//       userOne: 12345,
//       userTwo: null,
//       start: '04:00',
//       recordingURL: 'some-firebase-public-url',
//       status: 'completed'
//       }]

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

 export const createPairMiddleware = (date, session) => {
   return (dispatch, getState) => {
    console.log("Got session to pair", session)
    axios.put('/api/schedule', {sessionId})

    // let updatedSchedule = [...getState().schedule];
    // updatedSchedule = updatedSchedule.map(session => {
    //   if (session.id === sessionId) {
    //     session.userTwo = getState().user.id;
    //     return session;
    //   } else {
    //     return session;
    //   }
    // })

    dispatch(createPair(updatedSchedule))
   }
 }

 export const addSessionMiddleware = (date, start, end) => {
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
        start: startTimeUTC
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
      return action.updatedSchedule
    case ADD_SESSION:
      return [...state, ...action.updatedSchedule]
    case LOAD_SESSIONS:
      return action.sessions
    default:
      return state
  }
}
