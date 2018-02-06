import React, { Component } from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { SearchBar, Tile } from '../index'
import { Button } from 'semantic-ui-react'
import { jobSearchThunk } from '../../store'
import './search.css'

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
   const URLparams = new URLSearchParams(this.props.location.search);
   const term = URLparams.get('term');
   const location = URLparams.get('location');
   this.props.handleJobSearch(term, location);
  }

  componentDidUpdate(prevProps) {
    const prevURLterm = new URLSearchParams(prevProps.location.search).get('term');
    const URLterm = new URLSearchParams(this.props.location.search).get('term');
    const prevURLlocation = new URLSearchParams(prevProps.location.search).get('location');
    const URLlocation = new URLSearchParams(this.props.location.search).get('location');
    if ((prevURLterm !== URLterm) || (prevURLlocation !== URLlocation)) {
      this.props.handleJobSearch(URLterm, URLlocation);
    }
   }

  render() {
    const {jobs, filtered} = this.props;
    const jobsToShow = filtered && filtered.length ? filtered : jobs;
    console.log('jobs to show', jobsToShow);
    return (
      <div className="search">
        <div className="jobs-wrapper row">
          {/* If time, add these back in... */}
          {/* <div className="col-md-12 text-right sort-btns">
          <Button.Group>
            <Button>Relevance</Button>
            <Button>Date</Button>
            <Button>Distance</Button>
          </Button.Group>
          </div> */}
          
          {
            !!jobsToShow && jobsToShow.map( (job, i) => {
            return <Tile {...job} key={i} jobs={jobs} />
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
    jobs: state.jobs,
    filtered: state.filteredJobs
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleJobSearch(term, location) {
      dispatch(jobSearchThunk(term, location))
    }
  }
}


export default withRouter(connect(mapState, mapDispatch)(Search))
