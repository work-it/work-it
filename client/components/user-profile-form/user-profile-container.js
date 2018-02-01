import React, {Component} from 'react'
// import {connect} from 'react-redux'
// import {withRouter} from 'react-router-dom'
import { Form, Button, Input } from 'semantic-ui-react'
import UserProfileForm from './user-profile-form'
import SkillForm from './skill-form'
import PastEmployerForm from './past-employer-form'
import ProjectForm from './project-form'
import SchoolForm from './school-form'
import './user-profile-form.css'


class userProfileContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skills: [],
      experience: [],
      projects: [],
      education: []
    }
  }

  handleStringChange(key, val){
    this.setState({[key]:val})
  }


  render() {
    const { skills, experience, projects, education } = this.state;

    return (
      <div className="userProfileContainer row">
        <UserProfileForm />
        <SkillForm />
        <PastEmployerForm />
        <ProjectForm />
        <SchoolForm />
      </div>
    )
  }
}

export default userProfileContainer
