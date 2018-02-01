import axios from 'axios'
import store from '../../store'
//import history from '../history'

/**
 * ACTION TYPES
 */

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

 export const saveProfilePhoto = img => dispatch => {
   const id = store.getState().user.id
   axios.post(`/api/profiles/${id}`, {img})
   .then (res => res.data)
   .then (console.log)
 }

/**
 * REDUCER
 */
export default function (state = emptyUser, action) {
  switch (action.type) {
    default:
      return state
  }
}
