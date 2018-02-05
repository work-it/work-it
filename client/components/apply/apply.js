import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {loadJobThunk, applyThunk} from '../../store'
import renderHTML from 'react-render-html';
import {Card, Image, Button, Header, TextArea, Divider, Form} from 'semantic-ui-react'
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
      console.log('PROPS: ', this.props);
      if (!this.props.job && this.props.match && this.props.match.params) {
        this.props.fetchJob(this.props.match.params.id);
      }
    }

    componentDidUpdate() {
      console.log('PROPS: ', this.props);
      if (!this.props.job && this.props.match && this.props.match.params) {
        this.props.fetchJob(this.props.match.params.id);
      }
    }

    render () {
      const { job, jobs, applyToJob} = this.props;
      if (!job) return null;

      const { companyDesc, imgUrl, location, name, position, salaryRange, type} = job;

      return (
        <div className="job-view">
        <Card className="job-panel">
            <div className="row">
                <div className="col-sm-3">
                    <Image src={imgUrl} />
                </div>
                <div className="col-sm-9">
                  <div className="col-sm-12"><Header size='large' className="name">{name}</Header></div>
                  <div className="col-sm-6"><Header size='medium' className="position">{position}</Header></div>
                  <div className="col-sm-6"><Header textAlign='right' size='small' className="location">{location}</Header></div>
                  <div className="col-sm-12">{type}</div>
                  <div className="col-sm-12">{`$${salaryRange.min}K - $${salaryRange.max}K`}</div>
                  <div className="col-sm-12 company-desc" style={{width: '100%'}}>{renderHTML(companyDesc)}</div>
                  <div className="col-sm-12">
                    <Button size="big" basic color="blue">View Description</Button>
                  </div>
                </div>
            </div>

            <div className="row">
              <div className="col-sm-12 text-right">
                <Form>
                  <TextArea className="cover-letter" value={this.state.coverLetter} onChange={(evt, {value}) => this.setState({coverLetter: value})} placeholder="Statement of Interest / Cover Letter" />
                </Form>
                <Button className="apply-btn" size="big" color="blue" onClick={() => this.handleApplyClick(job.id, job.employerId)}>Apply</Button>
              </div>
            </div>
          </Card>
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
