import React, { Component } from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { Card } from 'semantic-ui-react'
import {fetchSavedJobsThunk} from '../../store'
import Tile from '../tile/tile'
import './user-favorites.css'

class UserFavorites extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    if (!this.props.savedJobs.length && this.props.userId) {
      this.props.handleFetchSavedJobs(this.props.userId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.savedJobs.length && !this.props.userId && nextProps.userId) {
      this.props.handleFetchSavedJobs(nextProps.userId);
    }
  }

  render() {
    const { savedJobs } = this.props;

    return (
      <div className="user-saved">
        <div className="jobs-wrapper row">
          {savedJobs.length ? savedJobs.map(job => {
            return <Tile {...job} key={job.id} />
          }) :
          this.renderNoSavedJobsCard()
        }
        </div>
      </div>
    )
  }

  renderNoSavedJobsCard() {
    return (
      <div className="no-saved-jobs-wrapper">
        <Card className="no-saved-jobs-card">
          <h4>You Don't Have Any Saved Jobs.</h4>
        </Card>
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    user: state.user,
    userId: state.user.id,
    savedJobs: state.jobs.length && state.user.saved ? state.jobs.filter(job => state.user.saved.includes(job.id)) : []
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
