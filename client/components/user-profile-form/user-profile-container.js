import React, {Component} from 'react'
import {connect} from 'react-redux'
// import {withRouter} from 'react-router-dom'
import { Form, Button, Input } from 'semantic-ui-react'
import {getProfileThunk} from '../../store'
import UserProfileForm from './user-profile-form'
import UserImageForm from './user-image-form'
import SkillForm from './skill-form'
import PastEmployerForm from './past-employer-form'
import ProjectForm from './project-form'
import SchoolForm from './school-form'
import './user-profile-form.css'


class userProfileContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1
    }

    this.nextClick = this.nextClick.bind(this);
    this.prevClick = this.prevClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.step !== 1) {
      this.setState({step: nextProps.step})
    }
  }

  render() {
    const {step} = this.state;

    return (
      <div className="userProfileContainer row">
        <div className="pagination">
          Page: {step}
        </div>
        {this.renderSubView()}
      </div>
    )
  }

  nextClick() {
    this.setState({step: this.state.step + 1})
  }

  prevClick() {
    this.setState({step: this.state.step - 1})
  }

  renderSubView() {
    const {step} = this.state;

    switch (step) {
      case 1:
        return <UserImageForm nextClick={this.nextClick} step={step} />
      case 2:
        return <UserProfileForm nextClick={this.nextClick} prevClick={this.prevClick} step={step} />
      case 3:
        return <SkillForm nextClick={this.nextClick} prevClick={this.prevClick} step={step} />
      case 4:
        return <PastEmployerForm nextClick={this.nextClick} prevClick={this.prevClick} step={step} />
      case 5:
        return <ProjectForm nextClick={this.nextClick} prevClick={this.prevClick} step={step} />
      case 6:
        return <SchoolForm  prevClick={this.prevClick} step={step} />
      default:
        return <UserImageForm />
    }
  }
}

const mapState = (state, ownProps) => {
  return {
    step: state.profile ? state.profile.step : 1
  }
}

const mapDispatch = (dispatch) => {
  return {

  }
}

export default connect(mapState, mapDispatch)(userProfileContainer)
