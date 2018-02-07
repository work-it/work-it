import React, {Component} from 'react'
 import {connect} from 'react-redux'
 import {withRouter} from 'react-router-dom'
import { TextArea, Form, Button, Input, Card, Icon, Label, Divider, Image, Header} from 'semantic-ui-react'
import { saveProfilePhoto, saveProfileVideo, uploadVideo } from '../../store'
import './user-profile-form.css'

class UserImageForm extends Component {
  constructor(props) {
    super(props);

    console.log("props", props)
    this.width=200
    this.height=200;
    this.video = document.createElement('video');
    this.video.setAttribute('width', this.width);
    this.video.setAttribute('height', this.height);
    this.video.autoplay = true;
    this.canvas = document.createElement('canvas');
    this.canvasStill = document.createElement('canvas');
    this.liveVideo =document.createElement('video');
    this.mediaRecorder;
    this.blinkingRed = document.createElement('img');
    this.videoBlob = null;
    this.blinkingRed.src='/red.gif'
    this.blinkingRed.height=40;
    this.blinkingRed.width=40;
    this.chunks = []
    // this.canvas.setAttribute('width', this.width);
    // this.canvas.setAttribute('height', this.height);
    this.videoStream = null;
    this.state = {
        imgUrl: '',
        videoUrl: '',
        haveSnapshot: false,
        haveVideo: false
      }
      this.stopRecording = this.stopRecording.bind(this)
      this.pushChunks = this.pushChunks.bind(this);
      this.handleSavePhoto = this.handleSavePhoto.bind(this);
      this.handleTakePhoto = this.handleTakePhoto.bind(this);
      this.handleAllUpload = this.handleAllUpload.bind(this);
      this.processStream = this.processStream.bind(this);
      this.handleStopVideo = this.handleStopVideo.bind(this);
      this.handleStartVideo = this.handleStartVideo.bind(this)
      this.stop = this.stop.bind(this)
      this.blobCB = this.blobCB.bind(this)
  }
  handleStringChange(key, val){
    //console.log('handlig change', key, val)
    this.setState({[key]:val})
  }
  handleSelect(filterType, value) {
    this.setState({[filterType]: value}, () => {
      console.log(this.state);
    })
  }

  handleStartVideo () {
    document.getElementById('red').appendChild(this.blinkingRed)
    this.chunks = [];
    const options = {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
      mimeType: 'video/webm'
    }

    this.mediaRecorder = new MediaRecorder(this.videoStream, options);
    console.log(this.mediaRecorder)
    this.mediaRecorder.ondataavailable = this.pushChunks;
    this.mediaRecorder.start();
    this.mediaRecorder.onstop = this.stopRecording
  }

  pushChunks (e) {
    this.chunks.push(e.data);
  }

  stopRecording (e) {
    console.log("data available after MediaRecorder.stop() called.", this.liveVideo);
    this.liveVideo.controls = true;
    this.videoBlob = new Blob(this.chunks, { 'type': 'video/webm' });
    console.log("blob", this.videoBlob);
    const videoURL = window.URL.createObjectURL(this.videoBlob);
    this.liveVideo.src = videoURL;
    console.log("recorder stopped");
    document.getElementById('videoDiv').appendChild(this.liveVideo)
    document.getElementById('red').removeChild(this.blinkingRed)
    this.setState({videoUrl: '', haveVideo: true})

  }

  handleStopVideo () {
    this.mediaRecorder.stop();
  }

  handleAllUpload(e) {
    e.preventDefault()
    if (this.state.imgUrl.length > 0) {
      this.props.saveProfileImg(this.state.imgUrl, document.getElementById('fileInput').files[0])
    } else if (this.state.haveSnapshot) {
      this.canvasStill.toBlob(this.blobCB)
    }

    if (this.state.videoUrl.length > 0) {
      //console.log("name", this.state.videoStream, "name2", document.getElementById('videoInput').files[0].name)
      this.props.saveProfileRec(this.state.videoUrl, document.getElementById('videoInput').files[0])
    } else if (this.state.haveVideo) {
      this.props.saveProfileRec('profileVid', this.videoBlob);
    }
    this.stop();
  }

  blobCB (blob) {
    console.log("Saving photo live.......")
    this.props.saveProfileImg('livePhoto.png', blob)
  }

  handleSavePhoto(e) {
    e.preventDefault();

    this.canvasStill.height = this.video.videoHeight;
    this.canvasStill.width = this.video.videoWidth;
    this.canvasStill.getContext('2d').drawImage(this.video, 0, 0);

    document.getElementById('stillDiv').appendChild(this.canvasStill)
    //this.stop();
    this.setState({imgUrl: '', haveSnapshot: true});

  }



  handleTakePhoto (e) {
    e.preventDefault()
    if (!this.videoStream) {
      if (navigator.getUserMedia) navigator.getUserMedia({video: true, audio: true}, this.processStream, () => console.log("no stream"));
      else if (navigator.oGetUserMedia) navigator.oGetUserMedia({video: true, audio: true}, this.processStream, () => console.log("no stream"));
      else if (navigator.mozGetUserMedia) navigator.mozGetUserMedia({video: true, audio: true}, this.processStream, () => console.log("no stream"));
      else if (navigator.webkitGetUserMedia) navigator.webkitGetUserMedia({video: true, audio: true}, this.processStream, () => console.log("no stream"));
      else if (navigator.msGetUserMedia) navigator.msGetUserMedia({video: true, audio: true}, this.processStream, () => console.log("no stream"));
      else console.log('getUserMedia() not available from your Web browser!');
    }
  }

  stop() {

	  if (this.videoStream) {
      if (this.videoStream.stop) this.videoStream.stop();
      else if (this.videoStream.msStop) this.videoStream.msStop();
      this.videoStream.onended = null;
      this.videoStream = null;
    }
    if (this.video){
      this.video.onerror = null;
      this.video.pause();
      if (this.video.mozSrcObject){
        this.video.mozSrcObject = null;
        this.video.src = "";
        this.video.srcObject = null;
      }
    }
    try {
      document.getElementById('canvasDiv').removeChild(this.video)
    } catch (err) {}
}

 processStream(stream) {
  const video = this.video; //document.getElementById('video');

	video.onerror = () => { if (video) stop();};
  stream.onended = () => console.log("no straem");
  video.srcObject = stream;
  document.getElementById('canvasDiv').appendChild(video)
  this.videoStream = stream;
}

getClickEvent (e) {
  const button = document.getElementById('photoButton');
  if (button && button.innerHTML != 'Capture') return this.handleSavePhoto;
  return this.handleTakePhoto
}

  render() {
    const {imgUrl, videoUrl} = this.state;
    const {nextClick, prevClick} = this.props;
    console.log('got next click', nextClick, this.props)
    return (
      <div >
      <Card className="job-panel">
        <div className="userProfileForm row">
          <div className = "col-sm-12">
            <h2>Profile Builder</h2>
            <hr />
            <h4> Step 2 - Add a Photo and Record a Video Inroduction </h4>
          </div>

          <Form id="form">


              <div className = "col-sm-12">
                <Button id="photoButton" onClick={this.handleTakePhoto}>Start Camera</Button>
              </div>
              <div className = "col-sm-4">
                <div className="camera-on" id="canvasDiv" />
              </div>
              <div className = "col-sm-4">
                <div className="still-pic" id="stillDiv" />
              </div>
              <div className = "col-sm-4">
                <div className="user-video" id="videoDiv" />
              </div>
              <div className = "col-sm-12">
                <Button id="photoSaveButton" onClick={this.handleSavePhoto}>Capture Photo</Button>
                <Button id="startVideo" onClick={this.handleStartVideo}>Start video recording</Button>
                <Button id="stopVideoRecording" onClick={this.handleStopVideo}>Stop video recording</Button>
                <Button id="photoUploadButton" onClick={this.handleAllUpload}>Upload</Button>
                <div id="red" />
              </div>
              <div className = "col-sm-12">
                <hr />
              </div>
              <div className = "col-sm-12">
                <h4>Already have a great headshot or video? Add it here!</h4>
              </div>
              <div className = "col-sm-6">

                <Input id="fileInput" label="Upload Photo:" type="file" className="imgUrl" placeholder="Chose a photo" fluid value={imgUrl} onChange={(evt) => this.handleStringChange('imgUrl', evt.target.value)} />
              </div>

              <div className = "col-sm-6">
                <Input className="videoUrl" label="Upload Video:" type="file" id="videoInput" placeholder="Add a video" fluid value={videoUrl} onChange={(evt) => this.handleStringChange('videoUrl', evt.target.value)} />
              </div>
              <div className = "col-sm-12">
                <Button color="blue" size="big" className ="save-button" floated="right" onClick= {nextClick}>Next</Button>
                <Button color="black" size="big" className="save-button" floated="right" onClick={prevClick}>Prev</Button>
              </div>
            </Form>
        </div>
      </Card>
      </div>
    )
  }
}

const mapDispatch = dispatch => ({
  saveProfileImg: (name, file) => dispatch (saveProfilePhoto(name, file)),
  saveProfileRec: (name, file) => dispatch (saveProfileVideo(name, file))
})

export default withRouter(connect(null, mapDispatch)(UserImageForm))
