import axios from 'axios'
//import history from '../history'

/**
 * ACTION TYPES
 */

/**
 * INITIAL STATE
 */
const defaultUsers = [{
  id: 1,
  name: 'William Henry Gates III',
  position: 'Software Enginer',
  location: 'Seatle, WA',
  zip: '10001',
  experience: 'Senior Level',
  type: 'Full-time',
  topSkills: ['JavaScript', 'Jasmine', 'Java'],
  salaryRange: {
    min: 900,
    max: 1000
  },
  imgUrl: 'http://www.alagsoch.com/Celebs/Bill-Gates/square.jpg',
  userDesc: '<p>Bill Gates founded Microsoft in 1976 when he formed a contract with MITS (Micro Instrumentation and Telemetry Systems) to develop a basic operating system for their new microcomputers. In the early days, Bill Gates would review every line of code. He was also involved in several aspects of Microsoft’s business such as packing and sending off orders.</p>',
  pastEmployers: [
    {
      employerName: "Microsoft",
      dateRange: "1976-2018",
      companyWebsite: "http://www.microsoft.com",
      workDesc:  '<ul><li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.</li><li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li><li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li><li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</li></ul>'
    }, {
      employerName: "Microsoft",
      dateRange: "1976-2018",
      companyWebsite: "http://www.microsoft.com",
      workDesc:  '<ul><li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.</li><li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li><li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li><li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</li></ul>'
    }
  ],
  personalProjects: [
    {
      projName: "Bill & Melinda Gates Foundation",
      projDateRange: "2006-2018",
      projWebsite: "http://www.microsoft.com",
      projDesc:  '<ul><li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.</li><li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li><li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li><li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</li></ul>'
    }, {
      projName: "Microsoft",
      projDateRange: "1976-2018",
      projWebsite: "http://www.microsoft.com",
      projDesc:  '<ul><li>Morbi in sem quis dui placerat ornare. Pellentesque  odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.</li><li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li><li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li><li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</li></ul>'
    }
  ],
  education: [
    {
      schoolName: "Fullstack Academy",
      schoolDateRange: "2018",
      degree: 'Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat',
    }, {
      schoolName: "Harvard College",
      schoolDateRange: "1973-1975",
      degree: 'Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat',
    },
  ],
}]


/**
 * ACTION CREATORS
 */
// const getUser = user => ({type: GET_USER, user})
// const removeUser = () => ({type: REMOVE_USER})

/**
 * THUNK CREATORS
 */


/**
 * REDUCER
 */
export default function (state = defaultUsers, action) {
  switch (action.type) {
    default:
      return state
  }
}
