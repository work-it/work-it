import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {fetchEmployerJobsThunk, fetchAppsWithProfilesThunk} from '../../store'
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

  componentWillReceiveProps(nextProps) {
    if (!this.props.userId && nextProps.userId) {
      this.props.fetchEmployerJobs(nextProps.userId);
      this.props.fetchAppsWithProfiles(nextProps.userId);
    }
  }

  render() {
    return (
      <div className="employer-view">
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
      <div>
         {
          !!jobs.length &&
          jobs.map(job => {
            return (
            <div key={`job-${job.id}`}>
              <h2>{job.position}</h2>
              <h4>{job.location}</h4>
              <h5>Job ID: {job.id}</h5>
              {
                !!applications.length &&
                applications
                  .filter(application => application.jobId === job.id)
                  .map(application => {
                    console.log('PROFILE', application.profile);
                    return <UserTile key={`utile-${application.id}`} {...application.profile} handleViewClick={this.handleViewApplicationClick} appId={application.id} jobId={job.id} />
                  })
              }
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
      <div>
        <h2>{job.position}</h2>
        <h4>{job.location}</h4>
        <h5>Job ID: {job.id}</h5>
        <EmployerApplication key={`app-${application.id}`} profile={application.profile} application={application} notes={application.notes} />
      </div>

    )
  }

  handleViewApplicationClick(appId, jobId) {
    this.setState({view: 'application', jobId, appId})
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
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(EmployerView))
