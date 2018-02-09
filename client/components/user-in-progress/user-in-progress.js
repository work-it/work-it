import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { Card } from 'semantic-ui-react'
import { fetchApplicationsThunk, fetchAppliedJobsThunk } from '../../store'
import UserApplication from '../user-application/user-application'
import './user-in-progress.css'

class UserInProgress extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    if (!this.props.applications.length && this.props.userId) {
      this.props.fetchApplications(this.props.userId);
      this.props.fetchAppliedJobs(this.props.userId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.applications.length && !this.props.userId && nextProps.userId) {
      this.props.fetchApplications(nextProps.userId);
      this.props.fetchAppliedJobs(nextProps.userId);
    }
  }

  render() {
    const { type, jobs, applications, userId } = this.props;

    let filteredApplications;

    if (applications) {
      if (type === 'in-progress') {
        filteredApplications = applications.filter(application => {
          return application && !application.archived;
        })
      } else if (type === 'archived') {
        filteredApplications = applications.filter(application => {
          return application && application.archived;
        })
      }
    }

    return (
      <div className="user-in-progress">
        {
          !!filteredApplications.length && !!jobs.length ?
          filteredApplications.map(application => {
            const jobToDisplay = jobs.filter(job => job.id === application.jobId)[0];
            const key = Math.floor(Math.random()*100000000000000000);
            return <UserApplication key={key} job={jobToDisplay} application={application} applicantNotes={application.applicantNotes} />
          }) :
          this.renderNoApplicationsCard()
        }
      </div>
    )
  }

  renderNoApplicationsCard() {
    return (
      <div className="no-applicaitons-wrapper">
        <Card className="no-applications-card">
          <h4>You Don't Have Any {this.props.type === 'in-progress' ? 'In Progress' : 'Archived'} Applications.</h4>
        </Card>
      </div>
    )
  }
}

const mapState = (state, ownProps) => {
  return {
    userId: state.user.id,
    jobs: state.jobs,
    applications: state.applications
  }
}

const mapDispatch = (dispatch) => {
  return {
    fetchApplications(userId){
      dispatch(fetchApplicationsThunk(userId))
    },
    fetchAppliedJobs(userId){
      dispatch(fetchAppliedJobsThunk(userId))
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(UserInProgress))
