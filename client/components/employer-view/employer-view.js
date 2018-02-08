import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {fetchEmployerJobsThunk, fetchAppsWithProfilesThunk, reviewApplicationThunk} from '../../store'
import UserTile from '../tile-user/tile-user'
import EmployerApplication from './employer-application'
import './employer-view.css'

class EmployerView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'home',
      jobId: '',
      appId: ''
    }

    this.handleViewApplicationClick = this.handleViewApplicationClick.bind(this);
  }

  componentDidMount () {
    console.log ("Mounting......")
    if (this.props.userId) {
      this.props.fetchEmployerJobs(this.props.userId);
      this.props.fetchAppsWithProfiles(this.props.userId);

    }
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log("comp will receive props", this.props.userId, nextProps.userId)
  //   if (!this.props.userId && nextProps.userId) {
  //     this.props.fetchEmployerJobs(nextProps.userId);
  //     this.props.fetchAppsWithProfiles(nextProps.userId);

  //   }
  // }

  render() {
    return (
      <div className="user-in-progress">
       {this.renderSubView(this.state.view)}
      </div>
    )
  }

  renderSubView(view) {
    switch (view) {
      case 'application':
        return this.renderApplication();
      default:
        return this.renderHome();
    }
  }

  renderHome() {
    const { jobs, applications } = this.props;

    return (
      <div className="employer-home">
         {
          !!jobs.length &&
          jobs.map(job => {
            return (
            <div key={`job-${job.id}`} style={{margin: 0}}>
              <div className="job-desc-wrapper row">
                <h2 className="job-position">{job.position}</h2>
                <h4 className="job-location">{job.location}</h4>
                <h5 className="job-id">Job ID: {job.id}</h5>
              </div>
              <div className="row">
              {
                !!applications.length &&
                applications
                  .filter(application => application.jobId === job.id)
                  .map(application => {
                    console.log('PROFILE', application.profile);
                    return <UserTile key={`utile-${application.id}`} {...application.profile} {...application} handleViewClick={this.handleViewApplicationClick} employer={true} appId={application.id} jobId={job.id} link={'application'} />
                  })
              }
              </div>
            </div>
            )
          })
        }
      </div>
    )
  }

  renderApplication(){
    const { jobs, applications } = this.props;
    const job = jobs.find(jobToCheck => jobToCheck.id === this.state.jobId);
    const application = applications.find(appToCheck => appToCheck.id === this.state.appId);
    return (
      <div className="employer-home">
        <div className="job-desc-wrapper row">
          <h2 className="job-position">{job.position}</h2>
          <h4 className="job-location">{job.location}</h4>
          <h5 className="job-id">Job ID: {job.id}</h5>
        </div>
        <EmployerApplication key={`app-${application.id}`} profile={application.profile} application={application} employerNotes={application.employerNotes} />
      </div>

    )
  }

  handleViewApplicationClick(appId, jobId) {
    const {applications} = this.props;
    const status = applications[0].status;

    this.setState({view: 'application', jobId, appId})
    if (status === 'apply') {
      this.props.reviewApplication();
    }
  }
}

const mapState = (state) => {
  return {
    userId: state.user.id,
    jobs: state.jobs,
    applications: state.applications
  }
}

const mapDispatch = (dispatch) => {
  return {
    fetchEmployerJobs(id) {
      dispatch(fetchEmployerJobsThunk(id))
    },
    fetchAppsWithProfiles(id) {
      dispatch(fetchAppsWithProfilesThunk(id))
    },
    reviewApplication() {
      dispatch(reviewApplicationThunk())
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(EmployerView))
