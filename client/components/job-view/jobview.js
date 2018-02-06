import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter, Link} from 'react-router-dom';
import {loadJobThunk, saveJobThunk, addSavedToFilteredThunk, removeSavedJobThunk }  from '../../store'
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
       if (!this.props.job || !this.props.user) return null;
       const {user, handleSaveJob, handleRemoveSavedJob} = this.props;

       console.log('props', this.props)

       const {comp, companyDesc, employerId, experience, imgUrl, location, name, position, qualifications, roleDesc, salaryRange, savedBy, topSkills, type, zipm ,id} = this.props.job

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
                        <Link to={`/apply/${id}`}><Button size="big" basic color="blue">Apply</Button></Link>
                        {
                            user.saved && user.saved.includes(id) ?
                            <Button size="big" basic color="blue" onClick={() => handleRemoveSavedJob(id)}>Unsave</Button> :
                            <Button size="big" basic color="blue" onClick={() => handleSaveJob(id)}>Save</Button>
                          }
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
    jobs: state.jobs,
    user: state.user
})

const mapDispatch = (dispatch) => ({
    fetchJob: (id) => dispatch (loadJobThunk(id)),
    handleSaveJob(id) {
        dispatch(saveJobThunk(id))
        dispatch(addSavedToFilteredThunk(id))
      },
      handleRemoveSavedJob(id) {
        dispatch(removeSavedJobThunk(id))
      }
})


const mergeProps = (state, actions, ownProps) => ({
    ...state,
    ...actions,
    ...ownProps,
    job: state.jobs?state.jobs.find (job => job.id === ownProps.match.params.id):null
})

export default withRouter (connect (mapState, mapDispatch, mergeProps) (JobView))
