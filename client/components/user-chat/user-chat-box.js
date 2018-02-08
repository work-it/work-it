import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import {TextArea, Form} from 'semantic-ui-react'
import {addMessageMiddleware} from '../../store'
import renderHTML from 'react-render-html';

class UserChatBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newMessage: ''
    }
  }

  render() {
    const { newMessage } = this.state;
    const { application, showHeader } = this.props;
    return (
      <div className="chat-history">
        <Form>
          <div className="chat-box" >
            {application.chat ? renderHTML(application.chat) : 'No chat started...'}
          </div>
          <TextArea className="new-message" placeholder="Type to start message. Press Enter to send." value={newMessage} onChange={(evt, {value}) => this.handleChatUpdate(evt, value)} onKeyPress={evt => this.handleSubmitNewMessage(evt)} />
        </Form>
      </div>
    )
  }

  handleChatUpdate(evt, newMessage) {
    this.setState({newMessage})
  }

  handleSubmitNewMessage(evt) {
    if (evt.charCode === 13) {
      evt.preventDefault();
      this.setState({newMessage: ''});
      //console.log("application", this.props.application.id)
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
    handleAddNewMessage(applicaitonId, message) {
      dispatch(addMessageMiddleware(applicaitonId, message))
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(UserChatBox))
