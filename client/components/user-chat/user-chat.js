import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import UserChatBox from './user-chat-box'
import './user-chat.css'

class UserChat extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
    const { applications, jobs } = this.props;
    return (
      <div className="chat-view">
        <div className="chat-select-wrapper">
          <ul>
            {applications &&
            applications.map(application => {
              const name = jobs[application.jobId].name;
              const logo = jobs[application.jobId].imgUrl;
              return (
              <li key={`chat-${application.id}`}>
                <img className="logo" src={logo} />
                <h3 className="name">{name}</h3>
              </li>
              );
            })}
          </ul>
        </div>
        <div className="chat-box-wrapper">
          <UserChatBox application={applications[0]} showHeader={false} />
        </div>
      </div>
    )
  }
}

const mapState = (state) => {
  return {
    jobs: state.jobs,
    applications: state.applications
  }
}

const mapDispatch = (dispatch) => {
  return {

  }
}

export default withRouter(connect(mapState, mapDispatch)(UserChat))
