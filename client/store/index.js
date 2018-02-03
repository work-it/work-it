import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import socketMiddleware from './middleware/socketMiddleware'
import { composeWithDevTools } from 'redux-devtools-extension'
import user from './user'
import jobs from './jobs'
import whiteboard from '../components/interview-board/whiteboard-reducer'
import textarea from '../components/interview-board/textarea-reducer'
import questions from '../components/questions/questions-reducer'
import saved from '../components/interview-container/save-state-reducer'
import userTile from '../components/tile-user/tile-user-reducer'
import schedule from '../components/practice-schedule/practice-schedule-reducer'
import auth from '../components/auth/auth-reducer'
import applications from '../components/user-in-progress/applications-reducer'
import practice from '../components/practice-pairs/practice-reducer'
import profile from './profile'
import filteredJobs from './filtered-jobs'
import savedJobs from './saved-jobs'

const reducer = combineReducers({user, whiteboard, textarea, jobs, questions, saved, schedule, userTile, auth, applications, practice, profile, filteredJobs, savedJobs})

const middleware = composeWithDevTools(applyMiddleware(
  thunkMiddleware,
  socketMiddleware(),
  createLogger({collapsed: true})
))

const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './profile'
export * from './jobs'
export * from './filtered-jobs'
export * from './saved-jobs'
