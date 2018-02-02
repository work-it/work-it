const router = require('express').Router()
const {User} = require('../db/models')
const {admin, firebase} = require ('../db')
const dataBucket = admin.storage().bucket()
const stream = require('firebase-stream')
const fs = require ('fs')
const metadata = {
	metadata: {
		metadata: {
			firebaseStorageDownloadTokens: '4148436AE4D4AAD5A6A02DB2E79C01FAC1B0DCF5E0160A58366ADCE568606481'
		}
	}
}
const token = '4148436AE4D4AAD5A6A02DB2E79C01FAC1B0DCF5E0160A58366ADCE568606481'
module.exports = router

router.put('/:id', (req, res, next) => {

   console.log("recording body", req.body)
  firebase.database()
    .ref('profiles/' + req.params.id)
    .set(req.body)
    .then(() => {
      res.sendStatus(200);
    })
 
})

router.put('/upload/photo/:id', (req, res, next) => {
  req.pipe(req.busboy);
  let fstream;
        req.busboy.on('file', function (fieldname, file, filename) {
            if (filename==='blob') filename='livePhoto.png'
            const fullpath = __dirname + '/../../tempImages/'+req.params.id + filename
            fstream = fs.createWriteStream(fullpath);
            file.pipe(fstream);
            fstream.on('close', function () {    
                console.log("Upload Finished of " + filename);              
                dataBucket.upload(fullpath, metadata)
              .then(data => {
                const url = 'https://firebasestorage.googleapis.com/v0/b/work-it-13fac.appspot.com/o/'+req.params.id+filename+'?alt=media&token='+token
                console.log("user url"+url)
                
                firebase.database()
                .ref('profiles/'+req.params.id)
                .update({imgUrl:url})
                .then(() =>{
                  res.json({imgUrl: url})
                })
              }).catch(err => {
                console.log(err);
                res.json(err)
              })
            });
        });
})

router.put('/upload/video/:id', (req, res, next) => {
  const fullpath = __dirname + '/../../tempImages/'+req.params.id + req.body.name
  dataBucket.upload(fullpath, metadata)
   .then(data => {
    const url = 'https://firebasestorage.googleapis.com/v0/b/work-it-13fac.appspot.com/o/'+req.params.id +req.body.name+'?alt=media&token='+token
    firebase.database()
     .ref('profiles/'+req.params.id)
     .update({videoUrl:url})
     .then(() =>{
        res.json({videoUrl: url})
      })
   }).catch(err => {
       console.log(err);
       res.json(err)
    })
})



router.get('/:id', (req, res, next) => {

  console.log('id', req.params.id);
  firebase.database()
    .ref('profiles/' + req.params.id)
    .once('value')
    .then(ds => {
      const user = ds.val();
      console.log('user from firebase', user);
      res.json(user);
    })
})
