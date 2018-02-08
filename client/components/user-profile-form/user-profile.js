import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {getProfileThunk, updateStep} from '../../store'
import {Card, Image, Header, Divider, Label, Icon, Segment, Container, Button} from 'semantic-ui-react'
import './user-profile-form.css'
const SKILLS_STEP = 3;
const PROFILE_STEP = 1;
const VIDEO_STEP = 2;
const EMPLOYERS_STEP = 4;
const PROJECTS_STEP = 5;
const SCHOOLS_STEP = 6;

class userProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: null,
      profile: 'img'
    }

    this.nextClick = this.nextClick.bind(this);
    this.prevClick = this.prevClick.bind(this);
  }

  componentDidMount() {
    if (this.props.userId) {
      this.props.fetchProfile(this.props.userId);
    } else {
      this.props.fetchProfile();
    }
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
    if (!this.props.profile) return null;
    const {firstName, lastName, position, location, experience, type, minSalary, maxSalary, imgUrl, videoUrl, userDesc, skillsArr, pastEmployersArr, ProjectsArr, SchoolArr} = this.props.profile
      console.log("video URL exists", videoUrl)
    return (
      <div className="job-view row">
        <Card className="job-panel">
          <div className="col-sm-12">
            <div className="col-sm-3">
              {
                this.state.profile==='img'?(imgUrl?<Image src={imgUrl} />:'No image uploaded'):(videoUrl?<video src={videoUrl} controls/>:null)
              }
              {
                videoUrl?<Button onClick={() =>this.toggleVideo()}>{this.state.profile==='img'?'Video Introduction':'Profile Photo'}</Button>:null
              }
              
               <div className="float-this">{
                  this.showEdit(VIDEO_STEP)
                }</div>

            </div>
{
         (firstName && lastName) ?
            <div className="col-sm-9">
              <div className="col-sm-12"><Header className="name" size='large'>{firstName + ' ' + lastName} </Header></div>
              <div className="col-sm-12"><Header className="position" size='medium'>{position && experience? position + ' ' + experience: ''}</Header></div>
              <div className="col-sm-12"><Header className="location" size='small'>{location? location: ''}</Header></div>
              <div className="col-sm-12 type">{type? type:''}</div>
              <div className="col-sm-12">{minSalary && maxSalary? `$${minSalary}K - $${maxSalary}K`: ''}</div>
              <div className="col-sm-12 summary">{userDesc}</div>
              <div className="col-sm-12"><Divider /></div>
          </div>

          :
          <div className="col-sm-9">
            <div className="col-sm-11">
              <Header className="position" size="medium"> Your profile is empty.  Please, fill it out! </Header>
            </div>
            <div className="col-sm-1">
              {this.showEdit(PROFILE_STEP)}
            </div>

            <div className="col-sm-12"><Divider /></div>
          </div>
}
        <div className="col-sm-3">
          <div className="col-sm-2">
            <Header textAlign='left' size='large'>Skills</Header>
          </div>
          <div className="col-sm-1">
              {this.showEdit(SKILLS_STEP)}
          </div>
          <div className="col-sm-3">
            <div className="skills-wrapper">
              {
                skillsArr && skillsArr.map((skill) => {
                  if(skill.topSkill) {
                    return (
                      <Segment compact inverted color='blue' size="big" key={skill.name}>{skill.name}</Segment>
                    )
                  } else {
                    return (
                      <Segment compact inverted color='black' size="big" key={skill.name}>{skill.name}</Segment>
                    )
                  }
                })
              }
            </div>
            </div>
          </div>
            <div className="col-sm-9">
              <div className="col-sm-11">
                <Header textAlign='left' size='large'>Work Experience</Header>
              </div>
              <div className="col-sm-1">
                { this.showEdit(EMPLOYERS_STEP) }
              </div>
              <div className="col-sm-12">
                {
                      pastEmployersArr && pastEmployersArr.map((pastEmployer) => {
                        return (
                          <div key ={pastEmployer.companyName + pastEmployer.startDate + pastEmployer.endDate}>
                            <Header>
                              {pastEmployer.companyName}
                            </Header>
                            <Header.Subheader>
                              {pastEmployer.jobTitle}
                            </Header.Subheader>

                            <Label as='a' basic color='blue' >
                              <Icon name='linkify' />{pastEmployer.companyWebsite}
                            </Label>
                            <Label as='a' basic color='grey' >
                              {pastEmployer.startDate + ' - ' + pastEmployer.endDate}
                            </Label>
                            <p className='text-padding'>
                              {pastEmployer.workDesc}
                            </p>
                            <Divider hidden />
                          </div>
                        )
                      })
                    }
              </div>
              <div className="col-sm-12">
                <Divider />
              </div>
              <div className="col-sm-11">
                <Header textAlign='left' size='large'>Projects</Header>
              </div>
              <div className="col-sm-1">
              <Container textAlign="right">{this.showEdit(PROJECTS_STEP)}</Container>
              </div>
              <div className="col-sm-12">
                {
                  ProjectsArr && ProjectsArr.map((project) => {
                    return (
                      <div key ={project.projectName + project.startDate + project.endDate}>
                      <Header>
                        {project.projectName}
                      </Header>
                      <Label as='a' basic color='blue'>
                        {project.projectWebsite}
                      </Label>
                      <Label as='a' basic color='grey'>
                        {project.startDate + ' - ' + project.endDate}
                      </Label>
                      <p className='text-padding'>
                        {project.projectDesc}
                      </p>
                      <Divider hidden />
                    </div>
                    )
                  })
                }
              </div>
              <div className="col-sm-12">
                <Divider />
              </div>
              <div className="col-sm-11">
                <Header textAlign='left' size='large'>Education</Header>
              </div>
              <div className="col-sm-1">
                <Container textAlign="right">{this.showEdit(SCHOOLS_STEP)}</Container>
              </div>
              <div className="col-sm-12">
                {
                  SchoolArr && SchoolArr.map((school) => {
                    return (
                      <div key ={school.schoolName + school.startDate + school.endDate}>
                      <Header>
                        {school.schoolName}
                      </Header>
                      <Label as='a' basic color='grey'>
                        {school.startDate + ' - ' + school.endDate}
                      </Label>
                      <p className='text-padding'>
                        {school.degree}
                      </p>
                      <Divider hidden />
                    </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </Card>
      </div>
  )}

  nextClick() {
    this.setState({step: this.state.step + 1})
  }

  prevClick() {
    this.setState({step: this.state.step - 1})
  }

  toggleVideo () {
    this.setState ({profile: this.state.profile==='video'?'img':'video'})
  }

  showEdit (step) {
    if (this.props.userId && this.props.profile && this.props.userId === this.props.profile.userId && !this.props.isEmployer){
      return <Icon name="pencil" color="grey"onClick={() => this.setEditStep(step)} />
    }
    return null;
  }

  setEditStep (step) {
    this.props.setStep (step)
  }
}

const mapState = (state) => {
  return {
    step: state.profile ? state.profile.step : 1,
    isLoggedIn: !!state.user.id,
    profile: state.profile,
    userId: state.user?state.user.id:null,
    isEmployer: state.user&&state.user.employer
  }
}

const mapDispatch = (dispatch) => {
  return {
    fetchProfile(userId) {
      dispatch(getProfileThunk(userId))
    },
    setStep (step) {
      dispatch (updateStep(step))
    }

  }
}

const mergeProps = (state, actions, ownProps) => ({
  ...state,
  ...actions,
  ...ownProps,
  setStep (step) {
    actions.setStep(step)
    ownProps.history.push('/profile/edit')
  }

})

export default withRouter(connect(mapState, mapDispatch, mergeProps)(userProfile))
