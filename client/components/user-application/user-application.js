import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {Progress, TextArea, Form, Button} from 'semantic-ui-react'
import {updateNotesMiddleware, archiveMiddleware} from '../user-in-progress/applications-reducer'
import Tile from '../tile/tile'
import './user-application.css'

class UserApplication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: ''
    }
  }

  componentWillMount() {
    this.setState({notes: this.props.application.notes})
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.notes !== this.props.notes) {
      alert('Notes Saved!');
    }
  }

  render() {
    const { type, job, application, handleSaveNotes, handleArchive } = this.props;
    const { notes } = this.state;
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
          <Form>
            <TextArea className="notes" placeholder="Notes" value={this.state.notes} onChange={(evt, {value}) => this.handleNotesChange(evt, value)} />
          </Form>
          {
            !application.archived &&
            <Button className="archive-btn" size="big" onClick={() => handleArchive(application.id)}>Archive</Button>
          }
          <Button className="archive-btn" size="big" onClick={() => handleSaveNotes(application.id, notes)}>Save Notes</Button>
        </div>
      </div>
    )
  }

  handleNotesChange(evt, notes) {
    this.setState({notes})
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
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(UserApplication))