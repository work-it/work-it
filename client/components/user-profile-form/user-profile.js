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
import {Grid, Image, Button, Header, TextArea, Divider, Label, Icon, Segment, Container} from 'semantic-ui-react'
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
    const {firstName, lastName, position, location, experience, type, minSalary, maxSalary, imgUrl, videoUrl, userDesc, skillsArr, pastEmployersArr, ProjectsArr, SchoolArr} = this.props.profile
    return (
      <div className="userProfileContainer">
        <Grid relaxed='very' columns={12} centered>
          <Grid.Row>
            <Grid.Column width={4}>
              <Image src={imgUrl} />
            </Grid.Column>
            <Grid.Column width={8}>
              <Grid.Row>
                <Grid.Column width={8}><Header size='large'>{firstName + ' ' + lastName}</Header></Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={4}><Header size='medium'>{position + ' ' + experience}</Header></Grid.Column>
                <Grid.Column width={4}><Header size='small'>{location}</Header></Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={4}>
                  <div>{type}</div>
                </Grid.Column>
                <Grid.Column width={4}>
                  <div>{`$${minSalary}K - $${maxSalary}K`}</div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={8}>
                  <div>{userDesc}</div>

                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={4}/>
                <Grid.Column width={8}>
                  <Divider hidden />
                  <Button floated='left' >Apply</Button>
                  <Button floated='left'>Message</Button>
                  <Button floated='left'>Save</Button>
                </Grid.Column>
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={12}>
              <Divider />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <Header size='large'>Skills</Header>
            </Grid.Column>
            <Grid.Column width={8}>
             <Header size='large'>Work Experience</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <div>

                  {
                    skillsArr && skillsArr.map((skill) => {
                      return (
                        <Segment compact inverted color='black' key={skill.name}>{skill.name}</Segment>
                      )
                    })
                  }
              </div>
            </Grid.Column>
            <Grid.Column width={8}>
              <div>
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
                <Divider />
                </div>

          </Grid.Column>
        </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={8}>
              <Header size='large'>Projects</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={8}>
              <div>
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
                  <Divider />
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={8}>
              <Header size='large'>Education</Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4} />
            <Grid.Column width={8}>
              <div>
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
            </Grid.Column>
          </Grid.Row>
      </Grid>


        {this.renderSubView()}
      </div>

    )}


  nextClick() {
    this.setState({step: this.state.step + 1})
  }

  prevClick() {
    this.setState({step: this.state.step - 1})
  }

  renderSubView() {
    const {step} = this.state;

    return (
      console.log('hello')

    )
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
