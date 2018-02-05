import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {loadJobThunk} from '../../store'
import renderHTML from 'react-render-html';
import {Grid, Image, Button, Header, TextArea, Divider, Card} from 'semantic-ui-react'
import './jobview.css'

class JobView extends Component {
    constructor (props) {
        super (props);
    }
    componentDidMount () {
        console.log("props", this.props)
        if (!this.props.job && this.props.match && this.props.match.params)
            this.props.fetchJob(this.props.match.params.id);
    }

    render () {
       if (!this.props.job) return null;

       console.log('props', this.props)

       const {comp, companyDesc, employerId, experience, imgUrl, location, name, position, qualifications, roleDesc, salaryRange, savedBy, topSkills, type, zip} = this.props.job

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
                      <Button size="big" basic color="blue">Apply</Button>
                      <Button size="big" basic color="black">Save</Button>
                    </div>
                  </div>
              </div>

              <div className="row">
                <div className="col-sm-12"><Divider /></div>
              </div>

              <div className="row">
                <div className="col-sm-12"><Header textAlign='left' size='large'>Role Description</Header></div>
                <div className="col-sm-12 role-desc">{renderHTML(roleDesc)}</div>
                <div className="col-sm-12"><Header textAlign='left' size='large'>Qualificatons</Header></div>
                <div className="col-sm-12">{renderHTML(qualifications)}</div>
                <div className="col-sm-12"><Header textAlign='left' size='large'>Benefits</Header></div>
                <div className="col-sm-12">{renderHTML(comp)}</div>
              </div>
            </Card>
          </div>
        )
    }
}

const mapState = state => ({
    jobs: state.jobs
})

const mapDispatch = (dispatch) => ({
    fetchJob: (id) => dispatch (loadJobThunk(id))
})


const mergeProps = (state, actions, ownProps) => ({
    ...state,
    ...actions,
    ...ownProps,
    job: state.jobs?state.jobs.find (job => job.id = ownProps.match.params.id):null
})

export default withRouter (connect (mapState, mapDispatch, mergeProps) (JobView))
