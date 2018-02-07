import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {fetchEmployerJobsThunk, fetchAppsWithProfilesThunk} from '../../store'
import UserTile from '../tile-user/tile-user'
import Tile from '../tile/tile'
import EmployerApplication from './employer-application'
import './employer-view.css'

class EmployerView extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.userId && nextProps.userId) {
      this.props.fetchEmployerJobs(nextProps.userId);
      this.props.fetchAppsWithProfiles(nextProps.userId);
    }
  }

  render() {
    const { applications } = this.props;

    return (
      <div className="user-in-progress">
      {
        !!applications.length &&
        applications.map(application => {
          return <EmployerApplication key={`app-${application.id}`} profile={application.profile} application={application} employerNotes={application.employerNotes} />
        })
      }
      </div>
    )
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
