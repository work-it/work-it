import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {getProfileThunk} from '../../store'
import UserProfileForm from './user-profile-form'
import UserImageForm from './user-image-form'
import SkillForm from './skill-form'
import PastEmployerForm from './past-employer-form'
import ProjectForm from './project-form'
import SchoolForm from './school-form'
import {Icon} from 'semantic-ui-react'
import './user-profile-form.css'


class userProfileContainer extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   step: props.match && props.match.params.step?props.match.params.step:1
    // }
    this.state = {
      step: props.step
    }

    console.log("Constructor called")
 
    this.nextClick = this.nextClick.bind(this);
    this.prevClick = this.prevClick.bind(this);
  }

  componentDidMount() {
    console.log("COMPONENT DID MOUNT");
    if (this.props.isLoggedIn)
      this.props.fetchProfile();
  }
  componentWillReceiveProps(nextProps) {
    console.log("RENDERING PROFILE CONTAINER");
    // if (nextProps && !this.state.step) {
    //   this.setState({step: nextProps.step})
    // }
    if (nextProps) {
      this.setState({step: nextProps.step})
    }
    // if (nextProps.match && nextProps.match.params.step) {
    //   this.setState({step:+nextProps.match.params.step})
    // }
    if (!this.props.isLoggedIn && nextProps.isLoggedIn) {
      this.props.fetchProfile();
    }
  }

  render() {
    const {step} = this.state;
    let page;

    if (step === 1) {page = <div><Icon name="circle" /><Icon  name="circle thin" /><Icon name="circle thin" /><Icon name="circle thin" /><Icon name="circle thin" /><Icon name="circle thin" /></div>}

    if (step === 2) {page = <div><Icon name="circle thin" /><Icon  name="circle" /><Icon  name="circle thin" /><Icon  name="circle thin" /><Icon name="circle thin" /><Icon  name="circle thin" /></div>}

    if (step === 3) {page = <div><Icon name="circle thin" /><Icon name="circle thin" /><Icon  name="circle" /><Icon name="circle thin" /><Icon  name="circle thin" /><Icon  name="circle thin" /></div>}

    if (step === 4) {page = <div><Icon  name="thin circle" /><Icon  name="circle thin" /><Icon  name="circle thin" /><Icon  name="circle" /><Icon name="circle thin" /><Icon  name="circle thin" /></div>}

    if (step === 5) {page = <div><Icon name="circle thin" /><Icon  name="circle thin" /><Icon name="circle thin" /><Icon  name="circle thin" /><Icon name="circle" /><Icon  name="circle thin" /></div>}

    if (step === 6) {page = <div><Icon name="circle thin" /><Icon  name="circle thin" /><Icon  name="circle thin" /><Icon name="circle thin" /><Icon name="circle thin" /><Icon name="circle" /></div>}

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
    //this.props.history.push('/profile/edit/'+(this.state.step+1))
    //console.log('next click called')
  }

  prevClick() {
    this.setState({step: this.state.step - 1})
   // this.props.history.push('/profile/edit/'+(this.state.step-1))
  }

  renderSubView() {
    const {step} = this.state;
    console.log( "step", step)
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
        return <UserProfileForm nextClick={this.nextClick} step={1}/>
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

const mergeProps = (state, actions, ownProps) => ({
  ...state,
  ...actions,
  ...ownProps,
  //step: ownProps.match && ownProps.match.params ? +ownProps.match.params.step : 1
})

export default withRouter(connect(mapState, mapDispatch, mergeProps)(userProfileContainer))
