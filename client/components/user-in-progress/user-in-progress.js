import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import UserApplication from '../user-application/user-application'
import './user-in-progress.css'

class UserInProgress extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  // TODO: Fetch jobs from an array of jobIds off the applications store...

  render() {
    const { type, jobs, applications} = this.props;
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
          !!filteredApplications.length && jobs &&
          filteredApplications.map(application => {
            const job = jobs[application.jobId];
              return <UserApplication key={application.id} job={job} application={application} notes={application.notes} />
          })
        }
      </div>
    )
  }
}

const mapState = (state, ownProps) => {
  return {
    jobs: state.jobs.all,
    applications: state.applications
  }
}

const mapDispatch = (dispatch) => {
  return {

  }
}

export default withRouter(connect(mapState, mapDispatch)(UserInProgress))
