import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import {logout} from '../store'
import Tile from './tile/tile'
import Questions from './questions/questions'

const jobDetails = {
  name: 'Google',
  position: 'Software Enginer',
  location: 'New York, NY',
  topSkills: ['JavaScript', 'Jasmine', 'Java'],
  salaryRange: {
    min: 50,
    max: 100
  },
  imgUrl: 'https://image.flaticon.com/teams/slug/google.jpg',
  companyDesc: '<ul><li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.</li><li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li><li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li><li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</li></ul>',
  roleDesc: '<ul><li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.</li><li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li><li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li><li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</li></ul>',
  qualifications: '<ul><li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.</li><li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li><li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li><li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</li></ul>',
  comp: '<ul><li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.</li><li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li><li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li><li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</li></ul>'
}

const questionDetails = {
  title: 'Cat Years, Dog Years',
  question: "<p>I have a cat and a dog which I got as kitten / puppy. I forget when that was, but I do know their current ages as catYears and dogYears.<br> Find how long I have owned each of my pets and return as a list [ownedCat, ownedDog]</p><br><h3>Results are truncated whole numbers of 'human' years</h3><br><h3>Cat Years</h3><ul><li>15 cat years for first year</li><li>+9 cat years for second year</li><li>+4 cat years for each year after that</li></ul><br><h3>Dog Years</h3><ul><li>15 dog years for first year</li><li>+9 dog years for second year</li><li>+5 dog years for each year after that</li></ul>",
  hint: '<p>function ownedCatAndDog(catYears, dogYears) { <br> //write your code here <br> return humanYears <br> } </p>',
  solution: '<p>var ownedCatAndDog = function(catYears, dogYears) {<br>    var ownedCat = 0;<br>    var ownedDog = 0;<br>    if (catYears>=15) {<br>      ownedCat = 1;<br>    };<br>        if ((catYears-15) >= 9) {<br>    ownedCat = 2;<br>    };<br>    if ((catYears-24) >=4) {<br>    ownedCat = 2 + Math.trunc((catYears-24)/4);<br>    };<br>    if (dogYears >= 15) { <br>       ownedDog = 1;<br>    }<br>    if ((dogYears-15) >= 9) { <br>     ownedDog = 2;<br>    }<br>    if ((dogYears-24) >= 5) {<br>     ownedDog = 2 + Math.trunc((dogYears-24)/5);<br>    }<br>    return [ownedCat,ownedDog];<br>  }</p>'
}


const Main = (props) => {
  const {children, handleClick, isLoggedIn} = props

  return (
    <div>
      <div>
        <Tile {...jobDetails} />
      </div>
      <div>
        <Questions {...questionDetails} />
      </div>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleClick () {
      dispatch(logout())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Main))

/**
 * PROP TYPES
 */
Main.propTypes = {
  children: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
