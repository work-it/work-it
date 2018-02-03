import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
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
        <div className="chat-select-wrapper">
          <ul>
            {
            !!applications.length && !!jobs.length &&
            applications.map((application, idx) => {
              const jobToDisplay = jobs.filter(job => job.id === application.jobId)[0];
              const name = jobToDisplay.name;
              const logo = jobToDisplay.imgUrl;
              let liClass;
              if (this.state.currentAppIdx === idx) {
                liClass = "message-select selected"
              } else {
                liClass = "message-select"
              }
              return (
              <li className={liClass} onClick={() => this.handleChangeAppIdx(idx)} key={`chat-${application.id}`}>
                <img className="logo" src={logo} />
                <h3 className="name">{name}</h3>
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
