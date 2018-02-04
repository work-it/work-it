import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {loadJobThunk, applyThunk} from '../../store'
import renderHTML from 'react-render-html';
import {Grid, Image, Button, Header, TextArea, Divider, Form} from 'semantic-ui-react'
import Tile from '../tile/tile';
import './apply.css';

class Apply extends Component {
    constructor (props) {
        super(props);

        this.state = {
          coverLetter: ''
        }
    }

    componentDidMount () {
      if (!this.props.job && this.props.match && this.props.match.params) {
        this.props.fetchJob(this.props.match.params.id);
      }
    }

    render () {
      const { job, jobs, applyToJob} = this.props;

      if (!this.props.job) return null;

      return (
        <div className="col-sm-10 col-sm-offset-1">
          <Tile {...job} key={job.id} jobs={jobs} />
          <div className="col-sm-9">
            <Form>
              <TextArea className="cover-letter" value={this.state.coverLetter} onChange={(evt, {value}) => this.setState({coverLetter: value})} placeholder="Statement of Interest / Cover Letter" />
            </Form>
            <Button className="apply-btn text-center" size="big" onClick={() => this.handleApplyClick(job.id, job.employerId)}>Apply</Button>
          </div>
        </div>
      )

    }

    handleApplyClick(id, employerId) {
      this.props.applyToJob(id, this.state.coverLetter, employerId);
      this.props.history.push('/user/applications');
    }
}

const mapState = state => ({
    jobs: state.jobs
})

const mapDispatch = (dispatch) => ({
    fetchJob: (id) => dispatch(loadJobThunk(id)),
    applyToJob: (id, coverLetter, employerId) => dispatch(applyThunk(id, coverLetter, employerId))
})


const mergeProps = (state, actions, ownProps) => ({
    ...state,
    ...actions,
    ...ownProps,
    job: state.jobs ? state.jobs.find(job => job.id === ownProps.match.params.id) : null
})

export default withRouter(connect(mapState, mapDispatch, mergeProps)(Apply))
