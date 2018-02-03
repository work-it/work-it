import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { List, Button } from 'semantic-ui-react'
import { fetchHistory } from '../practice-pairs/practice-reducer'

class PracticeHistory extends Component{
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.props.loadHistory();
  }

  loadPractice (practice) {
     console.log("PRACTICE LOADING SOON...")
  }

  render () {
      if (this.props.history) {
          const keys = Object.keys (this.props.history);
          <h4>Practice History</h4>
          return keys.map (key => 
            <List.Item key={key}>
                <List.Content>
                    <List.Header >{new Date().setTime(+key)}</List.Header>
                </List.Content>
                <List.Content floated="right">
                    <Button onClick={() => this.loadPractice(this.props.history[key])}>Review</Button>
                </List.Content>
            </List.Item>
          )
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
    }
  }
}


export default withRouter(connect(mapState, mapDispatch)(PracticeHistory))

