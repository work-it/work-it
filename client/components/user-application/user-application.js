import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Progress, TextArea, Form, Button, Card} from 'semantic-ui-react'
import {updateNotesMiddleware, archiveMiddleware, offerLetterStatusThunk} from '../../store';
import Tile from '../tile/tile'
import PracticeSchedue from '../practice-schedule/practice-schedule'
import './user-application.css'
import UserChatBox from '../user-chat/user-chat-box'
import renderHTML from 'react-render-html';

class UserApplication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: '',
      newMessage: '',
      view: 'application'
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
        <Tile {...job} key={job.id} insideUserApplication={true}/>
        <div className="col-sm-9">
          {
            application.status !== 'hire' ?
            this.renderProgress(barPercent) :
            this.renderHiredMessage()
          }

          {this.renderSubView(application)}

        </div>
      </div>
    </div>
    ) : null;
  }

  renderProgress(barPercent) {
    return (
      <div>
        <Progress percent={barPercent} />
        <ul className="list-inline progress-labels">
          <li>Apply</li>
          <li>Review</li>
          <li>Interview</li>
          <li>Offer</li>
          <li>Hired!</li>
        </ul>
      </div>
    )
  }

  renderHiredMessage() {
    return (
      <div className="hire-message">
        <Progress percent={100} />
        <div className="hire-message-text">
          <span>Congratulations. You're Hired!</span>
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
        return this.renderOfferView(application);
      default:
        return this.renderApplicationView(application);
    }
  }

  renderApplicationView(application) {
    const {notes} = this.state;
    const {handleArchive, handleSaveNotes} = this.props;
    return (
      <div>
        <div className="chat-note-wrapper">
          <UserChatBox application={application} showHeader={false} />
          <div className="notes">
            <Form>
              <TextArea className="notes" placeholder="Notes" value={this.state.notes} onChange={(evt, {value}) => this.setState({notes: value})} />
            </Form>
          </div>
        </div>
        <div className="in-progress-btns-wrapper">
          {
            !application.archived && application.status !== 'hire' &&
            <Button className="archive-btn" size="big" color="red" onClick={() => handleArchive(application.id)}>Archive</Button>
          }
          {
            application.status === 'offer' && <Button className="offer-btn" size="big" color="blue" onClick={() => this.setState({view: 'offer'})}>View Offer</Button>
          }
          {
            application.status === 'interview' && <Button className="interview-btn" size="big" color="blue" onClick={() => this.setState({view: 'scheduler'})}>Schedule an Interview</Button>
          }
          <Button className="save-btn" size="big" color="blue" onClick={() => handleSaveNotes(application.id, notes)}>Save Notes</Button>
        </div>
      </div>
    )
  }

  renderSchedulerView(application) {
    return (
      <div>
        <PracticeSchedue employerId={application.employerId} userId={application.userId}/>
        <div>
          <Button className="archive-btn" size="big" onClick={() => this.setState({view: 'application'})}>Done</Button>
        </div>
      </div>
    )
  }

  renderOfferView(application) {
    return (
      <div>
        <Card className="offer-letter-card">
          {renderHTML(application.offerLetter)}
        </Card>
        <div className="offer-letter-buttons">
          <Button className="accept-offer-btn" size="big" color="blue" onClick={() => this.hanldeOffer('accept', application.id)}>Accept</Button>
          <Button className="back-btn" size="big" onClick={() => this.setState({view: 'application'})}>Back</Button>
        </div>
      </div>
    )
  }

  hanldeOffer(status, appId) {
    this.setState({view: 'application'})
    this.props.handleOfferLetterStatus(status, appId);
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
    handleOfferLetterStatus(status, appId) {
      dispatch(offerLetterStatusThunk(status, appId))
    }
  }
}

export default withRouter(connect(null, mapDispatch)(UserApplication))
