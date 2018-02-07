import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getProfileThunk} from '../../store'
import UserProfileForm from './user-profile-form'
import UserImageForm from './user-image-form'
import SkillForm from './skill-form'
import PastEmployerForm from './past-employer-form'
import ProjectForm from './project-form'
import SchoolForm from './school-form'
import { Form, Button, Input, Dropdown, Icon, Card} from 'semantic-ui-react'
import './user-profile-form.css'


class userProfileContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: null
    }

    this.nextClick = this.nextClick.bind(this);
    this.prevClick = this.prevClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && !this.state.step) {
      this.setState({step: nextProps.step})
    }

    if (!this.props.isLoggedIn && nextProps.isLoggedIn) {
      this.props.fetchProfile();
    }
  }

  render() {
    const {step} = this.state;
    let page;

    if (step === 1) {page = <div><Icon name='circle'/><Icon  name='circle thin' /><Icon name='circle thin' /><Icon name='circle thin' /><Icon name='circle thin' /><Icon name='circle thin' /></div>}

    if (step === 2) {page = <div><Icon color='blue' name='circle thin' /><Icon color='blue' name='circle'/><Icon color='blue' name='circle thin' /><Icon color='blue' name='circle thin' /><Icon color='blue' name='circle thin' /><Icon color='blue' name='circle thin' /></div>}

    if (step === 3) {page = <div><Icon color='blue' name='circle thin' /><Icon color='blue' name='circle thin'/><Icon color='blue' name='circle' /><Icon color='blue' name='circle thin' /><Icon color='blue' name='circle thin' /><Icon color='blue' name='circle thin' /></div>}

    if (step === 4) {page = <div><Icon color='blue' name='thin circle' /><Icon color='blue' name='circle thin'/><Icon color='blue' name='circle thin' /><Icon color='blue' name='circle' /><Icon color='blue' name='circle thin' /><Icon color='blue' name='circle thin' /></div>}

    if (step === 5) {page = <div><Icon color='blue' name='circle thin' /><Icon color='blue' name='circle thin'/><Icon color='blue' name='circle thin' /><Icon color='blue' name='circle thin' /><Icon color='blue' name='circle' /><Icon color='blue' name='circle thin' /></div>}

    if (step === 6) {page = <div><Icon color='blue' name='circle thin' /><Icon color='blue' name='circle thin'/><Icon color='blue' name='circle thin' /><Icon color='blue' name='circle thin' /><Icon color='blue' name='circle thin' /><Icon color='blue' name='circle' /></div>}

      return (
        <div className="job-view userProfileContainer row">
          <div className="pagination">
            {page}
          </div>
        {this.renderSubView()}
        </div>
      )
  }

  nextClick() {
    this.setState({step: this.state.step + 1})
    console.log("next click called")
  }

  prevClick() {
    this.setState({step: this.state.step - 1})
  }

  renderSubView() {
    const {step} = this.state;
    console.log("nextClick in parent",this.nextClick)
    switch (step) {
      case 1:
        return <UserProfileForm nextClick={this.nextClick} step={step} />
      case 2:
        return <UserImageForm nextClick={this.nextClick} prevClick={this.prevClick} step={step} />
      case 3:
        return <SkillForm nextClick={this.nextClick} prevClick={this.prevClick} step={step} />
      case 4:
        return <PastEmployerForm nextClick={this.nextClick} prevClick={this.prevClick} step={step} />
      case 5:
        return <ProjectForm nextClick={this.nextClick} prevClick={this.prevClick} step={step} />
      case 6:
        return <SchoolForm  prevClick={this.prevClick} history={this.props.history} step={step} />
      default:
        return <UserProfileForm />
    }
  }
}

const mapState = (state) => {
  return {
    step: state.profile ? state.profile.step : 1,
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = (dispatch) => {
  return {
    fetchProfile() {
      dispatch(getProfileThunk())
    }
  }
}

export default connect(mapState, mapDispatch)(userProfileContainer)
