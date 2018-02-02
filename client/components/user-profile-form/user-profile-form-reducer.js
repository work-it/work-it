import axios from 'axios'
import store from '../../store'
import concat from "concat-stream"
//import history from '../history'

/**
 * ACTION TYPES
 */

 export const UPLOAD_VIDEO = 'UPLOAD_VIDEO'
 export const VIDEO_UPLOADED = 'VIDEO_UPLOADED'
 export const START_FILE_UPLOAD = 'START_FILE_UPLOAD'
 const UPDATE_PROFILE = 'UPDATE_PROFILE'

/**
 * INITIAL STATE
 */
const pastEmployer = {
  employerName: '',
  dateRange: '',
  companyWebsite: '',
  workDesc:  ''
}

const personalProject = {
  projName: '',
  projDateRange: '',
  projWebsite: '',
  projDesc:  ''
}

const school = {
  schoolName: '',
  schoolDateRange: '',
  degree: ''
}

const skill = {
  skillName: '',
  skillRank: ''
}


const emptyUser = {
  id: 1,
  name: '',
  position: '',
  location: '',
  zip: '',
  experience: '',
  type: '',
  topSkills: [ ],
  salaryRange: {
    min: 0,
    max: 1000
  },
  imgUrl: '',
  videoUrl: '',
  userDesc: '',
  pastEmployers: [ ],
  personalProjects: [ ],
  education: [ ],
}


/**
 * ACTION CREATORS
 */
// const getUser = user => ({type: GET_USER, user})
// const removeUser = () => ({type: REMOVE_USER})

/**
 * THUNK CREATORS
 */

 export const uploadVideo = info => ({
   type: UPLOAD_VIDEO,
   info
 })

 export const videoUploaded = name => ({
   type: VIDEO_UPLOADED,
   name
 })

 export const updateProfile = (key, value) => ({
  type: UPDATE_PROFILE,
  key, value
})

 const startFileUpload = (info,file, reader) => ({
   type: START_FILE_UPLOAD,
   info, file, reader
 })

 export const saveProfileVideo = (name, file) => dispatch => {
   
   //console.log("got video to upload", name);
  // name=name.
  if(!file.name) file.name = 'videoProfile.webm'
   name = store.getState().user.id+file.name
   
   const reader = new FileReader();
    reader.onload = evnt => dispatch(uploadVideo( { name, data : evnt.target.result }))
    dispatch (startFileUpload({name, size:file.size}, file, reader))
 }

 export const saveProfilePhoto = (name, file) => dispatch => {
   console.log("got image and file", name, file)
   const id = store.getState().user.id
   const formData = new FormData();
   formData.append('file', file);
   formData.append('name', name)
      axios.put(`/api/profiles/upload/photo/${id}`, formData)
      .then (res => res.data)
      .then (res => dispatch(updateProfile('imgUrl', res.imgUrl)))

 }

 export const pushVideoToFirebase = name => dispatch => {
   const id = store.getState().user.id
   axios.put(`/api/profiles/upload/video/${id}`, {name})
      .then (res => res.data)
      .then (res => dispatch(updateProfile('videoUrl', res.videoUrl)))

 }

/**
 * REDUCER
 */
export default function (state = emptyUser, action) {
  switch (action.type) {
    case UPDATE_PROFILE: 
      const newState= {...state, [action.key]:action.value}
      console.log('new State', newState)
      return newState
    default:
      return state
  }
}
