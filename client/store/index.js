import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import socketMiddleware from './middleware/socketMiddleware'
import { composeWithDevTools } from 'redux-devtools-extension'
import user from './user'
import whiteboard from '../components/interview-board/whiteboard-reducer'
import textarea from '../components/interview-board/textarea-reducer'

const reducer = combineReducers({user, whiteboard, textarea})
const middleware = composeWithDevTools(applyMiddleware(
  thunkMiddleware,
  socketMiddleware(),
  createLogger({collapsed: true})
  
))

const store = createStore(reducer, middleware)

export default store
export * from './user'
