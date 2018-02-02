import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'

class JobView extends Component {
    constructor (props) {
        super (props);
    }
    componentDidMount () {
        this.props.loadJobs();
    }
 
    render () {
        const id = this.props.match.params.id
        const job = this.props.jobs[id];
        console.log("jobs", this.props.jobs, "id", id)
        return (job || null)
    }
}

const mapState = state => ({
    jobs: state.jobs
})

export default withRouter (connect (mapState, null) (JobView))