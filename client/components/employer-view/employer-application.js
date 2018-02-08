import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Progress, TextArea, Form, Button} from 'semantic-ui-react'
import {updateEmployerNotesMiddleware, archiveMiddleware, sendOfferThunk} from '../../store';
import UserTile from '../tile-user/tile-user'
import '../user-application/user-application.css'
import UserChatBox from '../user-chat/user-chat-box'
import PracticeSchedule from '../practice-schedule/practice-schedule'
import TinyMCE from 'react-tinymce';

class EmployerApplication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: '',
      view: 'application',
      offerLetter: '<p>Offer Letter to Applicant</p>'
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
    const { application, profile } = this.props;
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

          {this.renderSubView(application)}

        </div>
      </div>
    )
  }

  renderSubView(application) {
    switch (this.state.view) {
      case 'application':
        return this.renderApplicationView(application);
      case 'scheduler':
        return this.renderSchedulerView(application);
      case 'offer':
        return this.renderOfferView();
      default:
        return this.renderApplicationView(application);
    }
  }

  renderApplicationView(application) {
    const {handleSaveEmployerNotes, handleArchive} = this.props;
    const {notes} = this.state;

    return (
      <div>
        <div className="chat-note-wrapper">
          <UserChatBox application={application} showHeader={true} />
          <div className="notes">
            <Form>
              <TextArea className="notes" placeholder="Notes" value={this.state.notes} onChange={(evt, {value}) => this.setState({notes: value})} />
            </Form>
          </div>
        </div>
        <div>
          {
            !application.archived &&
            <Button className="decline-btn" size="big" color="red" onClick={() => handleArchive(application.id)}>Decline</Button>
          }
          <Button className="save-notes-btn" size="big" color="blue" onClick={() => handleSaveEmployerNotes(application.id, notes)}>Save Notes</Button>

          {application.status === 'review' &&
          <Button className="interview-btn" size="big" color="blue" onClick={() => this.setState({view: 'scheduler'})}>Schedule An Interview</Button>}

          {application.status === 'interview' &&
          <Button className="interview-btn" size="big" color="blue" onClick={() => this.setState({view: 'offer'})}>Send Offer</Button>}
        </div>
      </div>
    )
  }

  renderSchedulerView(application) {
      return (
        <div>
          <PracticeSchedule employerId={application.employerId} userId={application.userId} />
          <div>
            <Button className="archive-btn" size="big" onClick={() => this.setState({view: 'application'})}>Done</Button>
          </div>
        </div>
      )
  }

  renderOfferView() {
    return (
      <div>
        <TinyMCE
          className="offer-letter"
          content={this.state.offerLetter}
          config={{
            height: '223',
            plugins: 'autolink link image lists print preview',
            toolbar: 'undo redo | bold italic | alignleft aligncenter alignright'
          }}
          onChange={evt => this.setState({offerLetter: evt.target.getContent()})}
        />
        <Button className="send-btn" size="big" color="blue" onClick={() => this.handleOfferLetter()}>Send</Button>
        <Button className="back-btn" size="big" onClick={() => this.setState({view: 'application'})}>Back</Button>
      </div>
    )
  }

  handleOfferLetter() {
    this.setState({view: 'application'});
    this.props.handleOfferLetterSubmit(this.state.offerLetter);
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
    handleOfferLetterSubmit(offerLetter) {
      dispatch(sendOfferThunk(offerLetter))
    }
  }
}

export default withRouter(connect(null, mapDispatch)(EmployerApplication))
