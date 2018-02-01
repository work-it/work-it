import React, {Component} from 'react'
// import {connect} from 'react-redux'
// import {withRouter} from 'react-router-dom'
import { TextArea, Form, Button, Input, Dropdown} from 'semantic-ui-react'
import './user-profile-form.css'

class UserImageForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
        imgUrl: '',
        videoUrl: '',
      }
  }

  handleStringChange(key, val){
    this.setState({[key]:val})
  }

  handleSelect(filterType, value) {
    this.setState({[filterType]: value}, () => {
      console.log(this.state);
    })
  }

  render() {
    const {imgUrl, videoUrl} = this.state;
    const {nextClick} = this.props;

    return (
      <div className="userProfileForm row">
          <Form>
            <Input className="imgUrl" placeholder="Add a photo" value={imgUrl} onChange={(evt) => this.handleStringChange('imgUrl', evt.target.value)} />

            <Input className="videoUrl" placeholder="Add a video" value={videoUrl} onChange={(evt) => this.handleStringChange('videoUrl', evt.target.value)} />
          </Form>
          <Button onClick={nextClick}>Next</Button>
      </div>
    )
  }
}

export default UserImageForm
