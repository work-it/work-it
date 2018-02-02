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

  componentDidMount() {
    this.props.handleFetchSavedJobs(this.props.userId);
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
    userId: state.user.id,
    savedJobs: state.savedJobs
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
