import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { Table, Button } from 'semantic-ui-react'
import { fetchHistory, startSolo } from '../practice-pairs/practice-reducer'
import { setWhiteboard } from '../interview-board/whiteboard-reducer'
import { setTextarea } from '../interview-board/textarea-reducer'
import { setPanesep, updatePaneSep } from '../interview-board/panesep-reducer'
import './practice-history.css'


import InterviewBoardContainer from '../interview-container/interview-board-container'
import textarea from '../interview-board/textarea';

class PracticeHistory extends Component{
  constructor (props) {
    super(props)

    this.state = {
      view: 'list'
    }
  }

  componentDidMount () {
    this.props.loadHistory();
  }

  loadPractice (practice) {
    this.setState({view: practice})
  }

  render () {
      if (this.props.history) {
         if (this.state.view === 'list') {
            const keys = Object.keys (this.props.history);
            return (
              <div id='table-container'>
                <Table color='black' id='history-table' compact>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colSpan='2' textAlign='center'>Practice History</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                {
                  keys.map (key => {
                    const d = new Date();
                    d.setTime(+key);
                  return <Table.Row key={key}>

                    <Table.Cell>{d.toLocaleString('en-US')}</Table.Cell>
                    <Table.Cell textAlign='right'><Button onClick={() => this.loadPractice(this.props.history[key])}>Review</Button></Table.Cell>
                  </Table.Row>
                  
                  }
                ) }
                </Table.Body>
              </Table>
            </div>)
            } else {
              console.log("history", this.props.history, this.state.view)
              this.props.setPracticeState(this.state.view)
              return <InterviewBoardContainer/>
            }
      }
        else return <div>No History Available</div>
  }

}
const mapState = (state) => {
  return {
    history: state.practice.history,
  }
}

const mapDispatch = (dispatch) => {
  return {
    loadHistory () {
      dispatch(fetchHistory())
    },
    setPracticeState (practice) {
      dispatch (startSolo())
      dispatch(setWhiteboard(practice.board))
      dispatch(setTextarea(practice.text))
      dispatch(updatePaneSep(practice.panesep.topHeight, practice.panesep.bottomHeight))
    }
  }
}


export default withRouter(connect(mapState, mapDispatch)(PracticeHistory))

