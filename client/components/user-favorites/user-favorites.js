import React, { Component } from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {fetchSavedJobsThunk} from '../../store'
import Tile from '../tile/tile'

class UserFavorites extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.userId && nextProps.userId) {
      this.props.handleFetchSavedJobs(nextProps.userId);
    }
  }

  render() {
    const { savedJobs } = this.props;

    return (
      <div>
        {!!savedJobs.length && savedJobs.map(job => {
            return <Tile {...job} key={job.id} />
          })}
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    user: state.user,
    userId: state.user.id,
    savedJobs: state.jobs.filter(job => state.user.saved.includes(job.id))
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleFetchSavedJobs(userId) {
      dispatch(fetchSavedJobsThunk(userId))
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(UserFavorites))
