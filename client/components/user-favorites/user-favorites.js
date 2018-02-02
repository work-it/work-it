import React, { Component } from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {fetchFavoriteJobsThunk} from '../../store'
import Tile from '../tile/tile'

class UserFavorites extends Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  componentDidMount() {
    this.props.handleFetchFavoriteJobs(this.props.favorites);
  }

  render() {
    const { jobs } = this.props;

    return (
      <div>
        {!!jobs.length && jobs.map(job => {
            return <Tile {...job} key={job.id} />
          })}
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    jobs: state.jobs,
    favorites: state.user.favorites
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleFetchFavoriteJobs(favorites) {
      dispatch(fetchFavoriteJobsThunk(favorites))
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(UserFavorites))


