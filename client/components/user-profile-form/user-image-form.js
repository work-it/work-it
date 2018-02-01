import React, {Component} from 'react'
 import {connect} from 'react-redux'
 import {withRouter} from 'react-router-dom'
import { TextArea, Form, Button, Input, Dropdown} from 'semantic-ui-react'
import { saveProfilePhoto } from './user-profile-form-reducer'
import './user-profile-form.css'

class UserImageForm extends Component {
  constructor(props) {
    super(props);


    this.width=200
    this.height=200;
    this.video = document.createElement('video');
    this.video.setAttribute('width', this.width);
    this.video.setAttribute('height', this.height);
    this.video.autoplay = true;
    this.canvas = document.createElement('canvas');

    // this.canvas.setAttribute('width', this.width);
    // this.canvas.setAttribute('height', this.height);
    this.videoStream = null;
    this.state = {
        imgUrl: '',
        captureUrl: '',
        videoUrl: '',

      }

      this.handleSavePhoto = this.handleSavePhoto.bind(this);
      this.handleTakePhoto = this.handleTakePhoto.bind(this);
      this.handlePhotoUpload = this.handlePhotoUpload.bind(this);
      this.processStream = this.processStream.bind(this);
      this.stop = this.stop.bind(this)
  }
  handleStringChange(key, val){
    console.log("state change triggered")
    if (key==='imgUrl') {
      this.setState({captureUrl:''})
    }
    this.setState({[key]:val})
  }
  handleSelect(filterType, value) {
    this.setState({[filterType]: value}, () => {
      console.log(this.state);
    })
  }

  handlePhotoUpload(e) {
    e.preventDefault()
    this.props.saveProfileImg(this.state.imgUrl)
  }

  handleSavePhoto(e) {
    e.preventDefault();

    this.canvas.height = this.video.videoHeight;
    this.canvas.width = this.video.videoWidth;
    this.canvas.getContext('2d').drawImage(this.video, 0, 0);
    try {
      document.getElementById('canvasDiv').removeChild(this.video);
    } catch (err) {}
    
    document.getElementById('canvasDiv').appendChild(this.canvas)
    this.stop();
    this.setState({'captureUrl':this.canvas.toDataURL("image/png"), imgUrl:''});
  }



  handleTakePhoto (e) {
    e.preventDefault()
    if (!this.videoStream) {
      if (navigator.getUserMedia) navigator.getUserMedia({video:true}, this.processStream, () => console.log("no straem"));
      else if (navigator.oGetUserMedia) navigator.oGetUserMedia({video:true}, this.processStream, () => console.log("no straem"));
      else if (navigator.mozGetUserMedia) navigator.mozGetUserMedia({video:true}, this.processStream, () => console.log("no straem"));
      else if (navigator.webkitGetUserMedia) navigator.webkitGetUserMedia({video:true}, this.processStream, () => console.log("no straem"));
      else if (navigator.msGetUserMedia) navigator.msGetUserMedia({video:true, audio:false}, this.processStream, () => console.log("no straem"));
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
      if (this.video.mozSrcObject)
      this.video.mozSrcObject = null;
      this.video.src = "";
      this.video.srcObject = null;
    }
}

 processStream(stream) {
   try {
    document.getElementById('canvasDiv').removeChild(this.canvas)
   } catch (error) {
     
   }
  
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
    const {nextClick} = this.props;

    return (
      <div className="userProfileForm row">
          <Form id='form'>
          Upload Photo: 
            <Input type='file' className="imgUrl" placeholder="Chose a photo" value={imgUrl} onChange={(evt) => this.handleStringChange('imgUrl', evt.target.value)} /> 
            or <div id='canvasDiv'></div><Button id='photoButton' onClick={this.handleTakePhoto}>Take (Retake) a photo now!</Button><Button id='photoSaveButton' onClick={this.handleSavePhoto}>Capture</Button>
            <Button id='photoUploadButton' onClick={this.handlePhotoUpload}>Upload</Button>
            
            
            <br/>
            <Input className="videoUrl" placeholder="Add a video" value={videoUrl} onChange={(evt) => this.handleStringChange('videoUrl', evt.target.value)} />          
            
            </Form>
          <Button onClick={nextClick}>Next</Button>
      </div>
    )
  }
}

const mapDispatch = dispatch => ({
  saveProfileImg: (img) => dispatch (saveProfilePhoto(img))
})

export default withRouter(connect(null, mapDispatch)(UserImageForm))
