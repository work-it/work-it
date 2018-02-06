import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
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
      console.log('DID MOUNT: ', this.props);
      if (!this.props.job && this.props.match && this.props.match.params) {
        console.log('DID MOUNT FETCH');
        this.props.fetchJob(this.props.match.params.id);
      }
    }

    render () {
      const { job, jobs, applyToJob} = this.props;
      if (!job) return null;

      const {id, comp, companyDesc, employerId, experience, imgUrl, location, name, position, qualifications, roleDesc, salaryRange, savedBy, topSkills, type, zip} = job;

      return (
        <div className="job-view">
        <Card className="job-panel">
          <div className="row">
              <div className="col-sm-3">
                  <Image src={imgUrl} />
              </div>
              <div className="col-sm-9">
                <div className="col-sm-12"><Header size='large' className="name">{name}</Header></div>
                <div className="col-sm-12"><Header size='medium' className="position">{position}</Header></div>
                <div className="col-sm-12"><Header size='small' className="location">{location}</Header></div>
                <div className="col-sm-12 top-skills">{topSkills.map(skill => skill).join(', ')}</div>
                <div className="col-sm-12">{`${experience} - ${type}`}</div>
                <div className="col-sm-12">{`$${salaryRange.min}K - $${salaryRange.max}K`}</div>
                <div className="col-sm-12 company-desc" style={{width: '100%'}}>{renderHTML(companyDesc)}</div>
                <div className="col-sm-12 buttons-wrapper">
                  <Link to={`/job/${id}`}><Button size="big" basic color="blue">View Description</Button></Link>
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
      this.props.history.push('/applications/in-progress');
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
