import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Progress, TextArea, Form, Button} from 'semantic-ui-react'
import {updateEmployerNotesMiddleware, archiveMiddleware, addMessageMiddleware} from '../../store';
import UserTile from '../tile-user/tile-user'
import './employer-application.css'
import UserChatBox from '../user-chat/user-chat-box'
import PracticeSchedue from '../practice-schedule/practice-schedule'

class EmployerApplication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: '',
      newMessage: '',
      view: 'application'
    }
  }

  componentWillMount() {
    this.setState({notes: this.props.application.employerNotes})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.employerNotes !== this.props.employerNotes) {
      alert('Notes Saved!');
    }
  }

  render() {
    const { job, application, handleSaveEmployerNotes, handleArchive, profile } = this.props;
    const { notes, newMessage } = this.state;
    let barPercent;

    switch (application.status) {
      case 'review':
        barPercent = 40;
        break;
      case 'interview':
        barPercent = 60;
        break;
      case 'offer':
        barPercent = 80;
        break;
      case 'hire':
        barPercent = 100;
        break;
      default:
        barPercent = 20;
    }

    console.log("view: ", this.state.view)
    return (
      <div className="application row">
        <UserTile {...profile} key={`profile-${profile.id}`} />
        <div className="col-sm-9">
          <Progress percent={barPercent} />
          <ul className="list-inline progress-labels">
            <li>Apply</li>
            <li>Review</li>
            <li>Interview</li>
            <li>Offer</li>
            <li>Hired!</li>
          </ul>
          {
            this.state.view === 'application' ? this.getApplicationView(application) : this.getSchedulerView(application)
              
          }
          
          {
            this.state.view === 'application' ? this.showApplicationButtons(application) : this.showSchedulerButtons()
          }

          
        </div>
      </div>
    )
  }

  showApplicationButtons (application) {
    return <div>
      {
        !application.archived &&
        <Button className="archive-btn" size="big" onClick={() => handleArchive(application.id)}>Archive</Button>
      }
      <Button className="archive-btn" size="big" onClick={() => handleSaveEmployerNotes(application.id, notes)}>Save Notes</Button>

      <Button className="archive-btn" size="big" onClick={() => this.handleScheduleInterview(application.id)}>Schedule An Interview</Button>
    </div>
  }

  showSchedulerButtons() {
    return <Button className='archive-btn' size='big' onClick={() => this.setState({view: 'application'})}>Done</Button>
  }

  handleNotesChange(evt, notes) {
    this.setState({notes})
  }

  handleChatUpdate(evt, newMessage) {
    this.setState({newMessage})
  }

  handleScheduleInterview(applicaitonId) {
    this.setState({view: 'scheduler'})
  }

  handleSubmitNewMessage(evt) {
    if (evt.charCode === 13) {
      evt.preventDefault();
      this.setState({newMessage: ''});
      this.props.handleAddNewMessage(this.props.application.id, this.state.newMessage);
    }
  }


  getApplicationView (application) {
    return <div className="chat-note-wrapper">
                <UserChatBox application={application} showHeader={true} />
                <div className="notes">
                  <h2>Notes</h2>
                  <Form>
                    <TextArea className="notes" placeholder="Notes" value={this.state.notes} onChange={(evt, {value}) => this.handleNotesChange(evt, value)} />
                  </Form>
                </div>
              </div> 
  }

  getSchedulerView (application) {
    return <PracticeSchedue employerId={application.employerId} userId={application.userId}/>
  }
}
const mapState = (state) => {
  return {

  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSaveEmployerNotes(applicationId, notes) {
      dispatch(updateEmployerNotesMiddleware(applicationId, notes))
    },
    handleArchive(applicationId) {
      dispatch(archiveMiddleware(applicationId))
    },
    handleAddNewMessage(applicaitonId, message) {
      dispatch(addMessageMiddleware(applicaitonId, message))
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(EmployerApplication))
