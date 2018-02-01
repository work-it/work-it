import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import PracticeMenu from '../practice-menu/practice-menu'
import PracticeSchedule from '../practice-schedule/practice-schedule'
import PracticePairs from '../practice-pairs/practice-pairs'
import InterviewBoardContainer from '../interview-container/interview-board-container';

class PracticeContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'pair',
      available: true
    }

    this.changeView = this.changeView.bind(this)
    this.changeAvailability = this.changeAvailability.bind(this);
  }

  render() {
    const { view, available } = this.state;
    const roomName = this.props.match.params.roomName
    return (
      <div className="practice-container">
        <PracticeMenu changeView={this.changeView} available={available} changeAvailability={this.changeAvailability} join={roomName}/>
        {this.renderSubView()}
      </div>
    )
  }

  renderSubView() {
    const { view } = this.state;
    switch (view) {
      case 'schedule':
        return this.renderScheduleView();
      case 'solo':
        return this.renderSoloView();
      case 'history':
        return this.renderHistoryView();
      case 'settings':
        return this.renderSettingsView();
      default:
        return this.renderPairView();
    }
  }

  renderPairView() {
    return <PracticePairs />
  }

  renderScheduleView() {
    return <PracticeSchedule />
  }

  renderHistoryView() {
    return <div>History View</div>
  }

  renderSoloView() {
    //return <div>Solo View</div>
    return <InterviewBoardContainer />
  }

  renderSettingsView() {
    return <div>Settings View</div>
  }

  changeView(view) {
    this.setState({view})
  }

  changeAvailability() {
    this.setState({available: !this.state.available})
  }
}

const mapState = (state) => {
  return {

  }
}

const mapDispatch = (dispatch) => {
  return {
    startSoloPractice: () => dispatch(startSolo())
  }
}

export default withRouter(connect(mapState, mapDispatch)(PracticeContainer))
