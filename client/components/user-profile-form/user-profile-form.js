import React, {Component} from 'react'
import {connect} from 'react-redux'
// import {withRouter} from 'react-router-dom'
import { TextArea, Form, Button, Input, Dropdown} from 'semantic-ui-react'
import { updateProfileThunk } from '../../store'
import './user-profile-form.css'


const experienceOptions = [
  {text: 'Junior', value: 'Junior'},
  {text: 'Mid-Level', value: 'Mid-Level'},
  {text: 'Senior', value: 'Senior'},
]

const typeOptions = [
  {text: 'Full-time', value: 'Full-time'},
  {text: 'Part-time', value: 'Part-time'},
  {text: 'Contract', value: 'Contract'},
]

class UserProfileForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
        firstName: '',
        lastName: '',
        position: '',
        location: '',
        experience: '',
        type: '',
        minSalary: '',
        maxSalary: '',
        imgUrl: '',
        videoUrl: '',
        userDesc: '',
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

  componentWillMount() {
    if (this.props.profile) {
      this.setState(this.props.profile);
    }
  }

  render() {
    const { firstName, lastName, position, location, experience, type, minSalary, maxSalary, imgUrl, videoUrl, userDesc } = this.state;
    const {nextClick, prevClick} = this.props;

    return (
      <div className="userProfileForm row">
          <Form>
            <Input className="firstName" placeholder="First Name" value={firstName} onChange={(evt) => this.handleStringChange('firstName', evt.target.value)} />

            <Input className="lastName" placeholder="Last Name" value={lastName} onChange={(evt) => this.handleStringChange('lastName', evt.target.value)} />

            <Input className="position" placeholder="Position" value={position} onChange={(evt) => this.handleStringChange('position', evt.target.value)} />

            <Input className="location" placeholder="Location" value={location} onChange={(evt) => this.handleStringChange('location', evt.target.value)} />

            <Dropdown className="experience" placeholder="Experience Level" options ={experienceOptions} selection value={experience} onChange={(evt, { value }) => this.handleSelect('experience', value)} />

            <Dropdown className="type" placeholder="Job Type" options={typeOptions} selection value={type}onChange={(evt, { value }) => this.handleSelect('type', value)} />

            <Input className="minSalary" placeholder="Minimum Salary" value={minSalary} onChange={(evt) => this.handleStringChange('minSalary', evt.target.value)} />

            <Input className="maxSalary" placeholder="Max Salary" value={maxSalary} onChange={(evt) => this.handleStringChange('maxSalary', evt.target.value)} />

            <Input className="imgUrl" placeholder="Add a photo" value={imgUrl} onChange={(evt) => this.handleStringChange('imgUrl', evt.target.value)} />

            <Input className="videoUrl" placeholder="Add a video" value={videoUrl} onChange={(evt) => this.handleStringChange('videoUrl', evt.target.value)} />

            <TextArea className="userDesc" placeholder="Personal Bio" value={userDesc} onChange={(evt) => this.handleStringChange('userDesc', evt.target.value)} />
          </Form>
          <Button onClick={prevClick}>Prev</Button>
          <Button onClick={() => this.handleNextClick()}>Next</Button>
      </div>
    )
  }

  handleNextClick() {
    // increment the step in the parent
    this.props.nextClick();
    // call the thunk
    let data = this.state;
    data.step = this.props.step;

    this.props.handleProfileFormThunk(data);
  }
}

const mapState = (state, ownProps) => {
  return {
    profile: state.profile
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleProfileFormThunk(data) {
      dispatch(updateProfileThunk(data))
    }
  }
}

export default connect(mapState, mapDispatch)(UserProfileForm)
