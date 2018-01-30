import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { SearchBar, Tile } from '../index'
import { Button } from 'semantic-ui-react'
import './search.css'

const Search = (props) => {
  const {jobs} = props;

  return (
    <div className="search">
      <div className="jobs-wrapper">
        <div className="col-md-12 text-right sort-btns">
        <Button.Group>
          <Button>Relevance</Button>
          <Button>Date</Button>
          <Button>Distance</Button>
        </Button.Group>
        </div>
        {jobs && jobs.map(job => {
          return <Tile {...job} key={job.id} />
        })}
      </div>
    </div>
  )
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    jobs: state.search
  }
}


export default withRouter(connect(mapState)(Search))
