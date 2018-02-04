import React, {Component} from 'react'
import {connect} from 'react-redux'
import { getQuestionsThunk } from '../../store'
// import {withRouter} from 'react-router-dom'
import { Tab } from 'semantic-ui-react'
import renderHTML from 'react-render-html'


class Questions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
    }
  }

  componentDidMount() {
    this.props.fetchQuestions()
  }


  render() {
    const { questions } = this.props;
      if (questions){
        return (
          <div>
            {
              questions.map((question) => {
                return (
                  <div key={question.id}>
                    <Tab.Pane key="question.id">
                      <h2>{question.title}</h2>
                      {renderHTML(question.question)}
                    </Tab.Pane>
                    <Tab.Pane key="question.hint">
                      <h2>{question.title}</h2>
                      {renderHTML(question.hint)}
                    </Tab.Pane>
                    <Tab.Pane key="question.solution">
                      <h2>{question.title}</h2>
                      {renderHTML(question.solution)}
                    </Tab.Pane>
                  </div>
                )
              })
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
