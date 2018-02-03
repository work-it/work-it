import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { fetchApplicationsThunk, fetchAppliedJobsThunk } from '../../store'
import UserApplication from '../user-application/user-application'
import './user-in-progress.css'

class UserInProgress extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.userId && nextProps.userId) {
      this.props.fetchApplications(nextProps.userId);
      this.props.fetchAppliedJobs(nextProps.userId);
    }
    if (this.props.applications.length !== nextProps.applications.length) {
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
          return !application.archived;
        })
      } else if (type === 'archived') {
        filteredApplications = applications.filter(application => {
          return application.archived;
        })
      }
    }

    return (
      <div className="user-in-progress">
        {
          !!applications.length && !!jobs.length &&
          filteredApplications.map(application => {
            const jobToDisplay = jobs.filter(job => job.id === application.jobId)[0];
            return <UserApplication key={`${application.id}-${userId}`} job={jobToDisplay} application={application} notes={application.notes} />
          })
        }
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
