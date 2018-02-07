import React, {Component} from 'react'
import {connect} from 'react-redux'
// import {withRouter} from 'react-router-dom'
import { TextArea, Form, Button, Input, Dropdown, Card} from 'semantic-ui-react'
import { updateProfileThunk } from '../../store'
import './user-profile-form.css'


const experienceOptions = [
  {text: 'Junior-Level', value: 'Junior-Level'},
  {text: 'Mid-Level', value: 'Mid-Level'},
  {text: 'Senior-Level', value: 'Senior-Level'},
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

    return (
      <Card className="job-panel row">
        <div className="userProfileForm ">
          <div className = "col-sm-6">
            <h2>Profile Builder</h2>
          </div>
          <div className = "col-sm-6">
            <Button color="blue" size="big" className="save-button" floated="right" onClick={() => this.handleNextClick()}>Next</Button>
          </div>
          <div className = "col-sm-12">
            <hr />
            <h4> Step 1 - Tell Us About Yourself
            </h4>
          </div>
          <Form>
            <div className = "col-sm-6 add-space">
              <Input className="firstName" placeholder="First Name" fluid value={firstName} onChange={(evt) => this.handleStringChange('firstName', evt.target.value)} />
            </div>
            <div className = "col-sm-6 add-space">
              <Input className="lastName" placeholder="Last Name" fluid value={lastName} onChange={(evt) => this.handleStringChange('lastName', evt.target.value)} />
            </div>
            <div className = "col-sm-12">
              <Input className="location" placeholder="Location" fluid value={location} onChange={(evt) => this.handleStringChange('location', evt.target.value)} />
            </div>
            <div className = "col-sm-12">
              <Input className="position" placeholder="Position" fluid value={position} onChange={(evt) => this.handleStringChange('position', evt.target.value)} />
            </div>
            <div className = "col-sm-4">
              <Dropdown className="experience" placeholder="Experience Level" options ={experienceOptions} fluid selection value={experience} onChange={(evt, { value }) => this.handleSelect('experience', value)} />
            </div>
            <div className = "col-sm-4">
              <Dropdown className="type" placeholder="Job Type" options={typeOptions} fluid selection value={type}onChange={(evt, { value }) => this.handleSelect('type', value)} />
            </div>
            <div className = "col-sm-2">
              <Input className="minSalary"  placeholder="$ Min Salary" fluid value={minSalary} onChange={(evt) => this.handleStringChange('minSalary', evt.target.value)} />
            </div>
            <div className = "col-sm-2">
              <Input className="maxSalary"  placeholder="$ Max Salary" fluid value={maxSalary} onChange={(evt) => this.handleStringChange('maxSalary', evt.target.value)} />
            </div>
            <div className = "col-sm-12">
              <TextArea className="userDesc" placeholder="Personal Bio" value={userDesc} onChange={(evt) => this.handleStringChange('userDesc', evt.target.value)} />
            </div>


          </Form>
        </div>
      </Card>
    )
  }

  handleNextClick() {
    // increment the step in the parent
    console.log(this.props)
    this.props.nextClick();
    // consolidate data
    let data = this.state;
    data.step = this.props.step;
    // call the thunk to update profile in firebase
    this.props.handleProfileFormThunk(data);
  }
}

const mapState = (state) => {
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
