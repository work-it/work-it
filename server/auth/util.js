
const {firebase} = require ('../db')
module.exports =  findUser = (id, field) =>  {
    return firebase.database()
    .ref('/users')
    .orderByChild(field)
    .equalTo(id)
    .once('value')
    .then (ds => ds.val())
  }
