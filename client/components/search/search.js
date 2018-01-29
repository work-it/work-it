import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { SearchBar, Tile } from '../index'
import './search.css'

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      advanced: false
    }
  }

  render() {
    const {jobs} = this.props;
    const {advanced} = this.state;

    return (
      <div className="search">
        <SearchBar />
        {advanced && this.renderAdvanced()}
        <div className="jobs-wrapper">
          {jobs && jobs.map(job => {
            return <Tile {...job} key={job.id} />
          })}
        </div>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    jobs: state.jobs
  }
}

export default withRouter(connect(mapState)(Search))
