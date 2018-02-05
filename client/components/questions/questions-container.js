import React, {Component} from 'react'
import {connect} from 'react-redux'
import { getQuestionsThunk } from '../../store'
// import {withRouter} from 'react-router-dom'
import { Tab } from 'semantic-ui-react'
import renderHTML from 'react-render-html'
import Question from './question'


class Questions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    }
  }

  componentDidMount() {
    this.props.fetchQuestions()
  }

  handleNext() {
    if (this.state.index === this.props.questions.length - 1){
      this.setState({index: 0})
    } else {
      let nextIndex = this.state.index + 1
      this.setState({index: nextIndex})
    }
  }

  handlePrevious() {
    if (this.state.index === 0){
      this.setState({index: this.props.questions.length - 1})
    } else {
      let previousIndex = this.state.index - 1
      this.setState({index: previousIndex})
    }
  }

  render() {
    const { questions } = this.props;
    console.log(questions)
      if (questions.length){
        return (
          <div>
            {
              <div key={questions[this.state.index].id}>
                  <Question question={questions[this.state.index]} />
                  <button onClick={() => this.handlePrevious()}>Previous</button>
                  <button onClick={() => this.handleNext()}>Next</button>
              </div>


            }
          </div>
        )
      } else {
        return null
      }
  }
}

const mapState = (state) => {
  return {
    questions: state.questions
  }
}

const mapDispatch = (dispatch) => {
  return {
    fetchQuestions() {
      dispatch(getQuestionsThunk())
    }
  }
}

export default connect(mapState, mapDispatch)(Questions)
