import axios from 'axios'
//import history from '../history'

/**
 * ACTION TYPES
 */

/**
 * INITIAL STATE
 */
const questionDetails = {
  title: 'Cat Years, Dog Years',
  question: "<p>I have a cat and a dog which I got as kitten / puppy. I forget when that was, but I do know their current ages as catYears and dogYears.<br> Find how long I have owned each of my pets and return as a list [ownedCat, ownedDog]</p><br><h3>Results are truncated whole numbers of 'human' years</h3><br><h3>Cat Years</h3><ul><li>15 cat years for first year</li><li>+9 cat years for second year</li><li>+4 cat years for each year after that</li></ul><br><h3>Dog Years</h3><ul><li>15 dog years for first year</li><li>+9 dog years for second year</li><li>+5 dog years for each year after that</li></ul>",
  hint: '<p>function ownedCatAndDog(catYears, dogYears) { <br> //write your code here <br> return humanYears <br> } </p>',
  solution: '<p>var ownedCatAndDog = function(catYears, dogYears) {<br>    var ownedCat = 0;<br>    var ownedDog = 0;<br>    if (catYears>=15) {<br>      ownedCat = 1;<br>    };<br>        if ((catYears-15) >= 9) {<br>    ownedCat = 2;<br>    };<br>    if ((catYears-24) >=4) {<br>    ownedCat = 2 + Math.trunc((catYears-24)/4);<br>    };<br>    if (dogYears >= 15) { <br>       ownedDog = 1;<br>    }<br>    if ((dogYears-15) >= 9) { <br>     ownedDog = 2;<br>    }<br>    if ((dogYears-24) >= 5) {<br>     ownedDog = 2 + Math.trunc((dogYears-24)/5);<br>    }<br>    return [ownedCat,ownedDog];<br>  }</p>'
}

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
export default function (state = questionDetails, action) {
  switch (action.type) {
    default:
      return state
  }
}
