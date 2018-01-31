import axios from 'axios'
import history from '../../history'
import _ from 'lodash'
import moment from 'moment'

/**
 * INITIAL STATE
 */

const defaultSchedule = [{
      date: '2018-02-02',
      id: 453,
      userOne: 12345,
      userTwo: null,
      start: '02:00',
      recordingURL: 'some-firebase-public-url',
      status: 'waiting'
      },
      {
      date: '2018-02-04',
      id: 444,
      userOne: 55555,
      userTwo: null,
      start: '03:00',
      recordingURL: 'some-firebase-public-url',
      status: 'waiting'
      },
      {
      date: '2018-01-31',
      id: 235,
      userOne: 12345,
      userTwo: null,
      start: '01:00',
      recordingURL: 'some-firebase-public-url',
      status: 'paired'
      },
      {
      date: '2018-02-03',
      id: 123,
      userOne: 12345,
      userTwo: null,
      start: '04:00',
      recordingURL: 'some-firebase-public-url',
      status: 'completed'
      }]

/**
 * ACTION TYPES
 */
const CREATE_PAIR = 'CREATE_PAIR';
const ADD_SESSION = 'ADD_SESSION';

/**
 * ACTION CREATORS
 */

 const createPair = (updatedSchedule) => ({type: CREATE_PAIR, updatedSchedule});
 const addSession = (updatedSchedule) => ({type: ADD_SESSION , updatedSchedule})

 export const createPairMiddleware = (userId, date, sessionId) => {
   return (dispatch, getState) => {

    let updatedSchedule = [...getState().schedule];
    updatedSchedule = updatedSchedule.map(session => {
      if (session.id === sessionId) {
        session.userTwo = userId;
        return session;
      } else {
        return session;
      }
    })

    dispatch(createPair(updatedSchedule))
   }
 }

 export const addSessionMiddleware = (date, userId, start, end) => {
  return (dispatch, getState) => {
  const formattedDate = date.format('YYYY-MM-DD');

  const startHour = start.split(':')[0];
  const endHour = end.split(':')[0];
  let newSessions = [];

  for (let i = startHour; i < endHour; i++) {
    const startTimeUTC = moment(`${i}:00`, 'HH:mmm').utc().format('HH:mm');

    const newSession = {
      id: Math.floor(Math.random() * 100), //firebase will assign an id
      date: formattedDate,
      userOne: userId,
      userTwo: null,
      start: startTimeUTC
    }

    newSessions.push(newSession);
  }

  let updatedSchedule = [...getState().schedule, ...newSessions]
  console.log('updated', updatedSchedule);

   dispatch(addSession(updatedSchedule))
  }
}
/**
 * THUNK CREATORS
 */

/**
 * REDUCER
 */
export default function (state = defaultSchedule, action) {
  switch (action.type) {
    case CREATE_PAIR:
      return action.updatedSchedule
    case ADD_SESSION:
      return action.updatedSchedule
    default:
      return state
  }
}
