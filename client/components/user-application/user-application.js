import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Progress, TextArea, Form, Button} from 'semantic-ui-react'
import {updateNotesMiddleware, archiveMiddleware, addMessageMiddleware} from '../../store';
import Tile from '../tile/tile'
import './user-application.css'
import UserChatBox from '../user-chat/user-chat-box'

class UserApplication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: '',
      newMessage: ''
    }
  }

  componentWillMount() {
    this.setState({notes: this.props.application.applicantNotes})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.applicantNotes !== this.props.applicantNotes) {
      alert('Notes Saved!');
    }
  }

  render() {
    const { job, application, handleSaveNotes, handleArchive } = this.props;
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
    return job ? (
    <div>
      <div className="application row">
        <Tile {...job} key={job.id} />
        <div className="col-sm-9">
          <Progress percent={barPercent} />
          <ul className="list-inline progress-labels">
            <li>Apply</li>
            <li>Review</li>
            <li>Interview</li>
            <li>Offer</li>
            <li>Hired!</li>
          </ul>
          <div className="chat-note-wrapper">
            <UserChatBox application={application} showHeader={false} />
            <div className="notes">
              <Form>
                <TextArea className="notes" placeholder="Notes" value={this.state.notes} onChange={(evt, {value}) => this.handleNotesChange(evt, value)} />
              </Form>
            </div>
          </div>
          <div className="in-progress-btns-wrapper">
            {
              !application.archived &&
              <Button className="archive-btn" size="big" color="blue" onClick={() => handleArchive(application.id)}>Archive</Button>
            }
            <Button className="archive-btn" size="big" color="blue" onClick={() => handleSaveNotes(application.id, notes)}>Save Notes</Button>
          </div>
        </div>
      </div>
    </div>
    ) : null;
  }

  handleNotesChange(evt, notes) {
    this.setState({notes})
  }

  handleChatUpdate(evt, newMessage) {
    this.setState({newMessage})
  }

  handleSubmitNewMessage(evt) {
    if (evt.charCode === 13) {
      evt.preventDefault();
      this.setState({newMessage: ''});
      this.props.handleAddNewMessage(this.props.application.id, this.state.newMessage);
    }
  }
}

const mapState = (state) => {
  return {

  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSaveNotes(applicationId, notes) {
      dispatch(updateNotesMiddleware(applicationId, notes))
    },
    handleArchive(applicationId) {
      dispatch(archiveMiddleware(applicationId))
    },
    handleAddNewMessage(applicaitonId, message) {
      dispatch(addMessageMiddleware(applicaitonId, message))
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(UserApplication))
