import axios from 'axios'
/**
 * ACTION TYPES
 */
const GET_QUESTIONS = 'GET_QUESTIONS '


/**
 * INITIAL STATE
 */
const defaultQuestions = {}

/**
 * ACTION CREATORS
 */

const getQuestions = questions => ({type: GET_QUESTIONS, questions})

/**
 * THUNK CREATORS
 */
export const getQuestionsThunk = () => {
  return (dispatch, getState) => {


    axios.get(`/api/questions`)
      .then(res => {
        //console.log('data', res.data)
        dispatch(getQuestions(res.data));
      })
  }
}


/**
 * REDUCER
 */
export default function (state = [], action) {
  switch (action.type) {
    case GET_QUESTIONS:
    //console.log('reducer', action.questions)
      return action.questions;
    default:
      return state
  }
}
