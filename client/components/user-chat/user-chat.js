import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { Card } from 'semantic-ui-react'
import UserChatBox from './user-chat-box'
import {fetchApplicationsThunk, fetchAppliedJobsThunk} from '../../store'
import './user-chat.css'

class UserChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentAppIdx: 0
    }
  }

  componentDidMount() {
    if (!this.props.applications.length && this.props.userId) {
      this.props.fetchApplications(this.props.userId);
      this.props.fetchAppliedJobs(this.props.userId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.userId && nextProps.userId) {
      this.props.fetchApplications(nextProps.userId);
      this.props.fetchAppliedJobs(nextProps.userId);
    }
    if (this.props.applications.length !== nextProps.applications.length) {
      this.props.fetchApplications(nextProps.userId);
      this.props.fetchAppliedJobs(nextProps.userId);
    }
  }

  render() {
    const { applications, jobs } = this.props;
    return (
      <div className="chat-view">
        <Card>
        <div className="chat-select-wrapper">
            <ul>
              {
              !!applications.length && !!jobs.length &&
              applications.map((application, idx) => {
                const jobToDisplay = jobs.filter(job => job.id === application.jobId)[0];
                const {name, imgUrl, position} = jobToDisplay;
                let liClass;
                if (this.state.currentAppIdx === idx) {
                  liClass = "message-select selected"
                } else {
                  liClass = "message-select"
                }
                return (
                <li className={liClass} onClick={() => this.handleChangeAppIdx(idx)} key={`chat-${application.id}`}>
                  <div className="col-sm-2 logo-wrapper">
                    <img className="logo" src={imgUrl} />
                  </div>
                  <div className="col-sm-10 text-wrapper">
                    <div className="col-sm-12">
                      <span className="name">{name}</span>
                    </div>
                    <div className="col-sm-12">
                      <span className="position">{position}</span>
                    </div>
                  </div>
                </li>
                );
              })}
            </ul>
          </div>
          <div className="chat-box-wrapper">
            {
              !!applications.length && !!jobs.length &&
              <UserChatBox application={applications[this.state.currentAppIdx]} showHeader={false} />
            }
          </div>
        </Card>
      </div>
    )
  }

  handleChangeAppIdx(newIdx){
    this.setState({currentAppIdx: newIdx})
  }
}

const mapState = (state) => {
  return {
    userId: state.user.id,
    jobs: state.jobs,
    applications: state.applications
  }
}

const mapDispatch = (dispatch) => {
  return {
    fetchApplications(userId){
      dispatch(fetchApplicationsThunk(userId))
    },
    fetchAppliedJobs(userId){
      dispatch(fetchAppliedJobsThunk(userId))
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(UserChat))
