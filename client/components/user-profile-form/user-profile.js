import React, {Component} from 'react'
import {connect} from 'react-redux'
// import {withRouter} from 'react-router-dom'
import {getProfileThunk} from '../../store'
import UserProfileForm from './user-profile-form'
import UserImageForm from './user-image-form'
import SkillForm from './skill-form'
import PastEmployerForm from './past-employer-form'
import ProjectForm from './project-form'
import SchoolForm from './school-form'
import UserProfile from './user-profile'
import {Card, Grid, Image, Button, Header, TextArea, Divider, Label, Icon, Segment, Container} from 'semantic-ui-react'
import './user-profile-form.css'


class userProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: null
    }

    this.nextClick = this.nextClick.bind(this);
    this.prevClick = this.prevClick.bind(this);
  }

  componentDidMount() {
    if (!this.props.profile && this.props.userId) {
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
    return (
      <div className="job-view">
        <Card className="job-panel">
          <div className="col-sm-12">
            <div className="col-sm-3">
                <Image src={imgUrl} />
            </div>
            <div className="col-sm-9">
              <div className="col-sm-12"><Header className="name" size='large'>{firstName + ' ' + lastName}</Header></div>
              <div className="col-sm-12"><Header className="position" size='medium'>{position + ' ' + experience}</Header></div>
              <div className="col-sm-12"><Header className="location" size='small'>{location}</Header></div>
              <div className="col-sm-12 type">{type}</div>
              <div className="col-sm-12">{`$${minSalary}K - $${maxSalary}K`}</div>
              <div className="col-sm-12 summary">{userDesc}</div>
          </div>

          <div className="row">
            <div className="col-sm-12"><Divider /></div>
          </div>

          <div className="col-sm-3">
            <Header textAlign='left' size='large'>Skills</Header>
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
            <div className="col-sm-9">
              <div className="col-sm-12">
                <Header textAlign='left' size='large'>Work Experience</Header>
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
              <div className="col-sm-12">
                <Header textAlign='left' size='large'>Projects</Header>
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
              <div className="col-sm-12">
                <Header textAlign='left' size='large'>Education</Header>
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
}

const mapState = (state) => {
  return {
    step: state.profile ? state.profile.step : 1,
    isLoggedIn: !!state.user.id,
    profile: state.profile
  }
}

const mapDispatch = (dispatch) => {
  return {
    fetchProfile() {
      dispatch(getProfileThunk())
    }
  }
}

export default connect(mapState, mapDispatch)(userProfile)
