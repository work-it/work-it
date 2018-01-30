import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Tab } from 'semantic-ui-react'
import renderHTML from 'react-render-html';
import './questions.css'

class Questions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      state: 0,
    }
  }
componentDidMount(){
  console.log(this.props)
}

  renderQuestion() {
    const {title, question} = this.props.questions;
    return (
      <Tab.Pane key="question">
        <h2>{title}</h2>
        {renderHTML(question)}
      </Tab.Pane>
    )
  }
  renderHint() {
    const {title, hint} = this.props.questions;
    return (
      <Tab.Pane key="hint">
        <h2>{title}</h2>
        {renderHTML(hint)}
      </Tab.Pane>
    )
  }
  renderSolution() {
    const {title, solution} = this.props.questions;
    return (
      <Tab.Pane key="solution">
        <h2>{title}</h2>
        {renderHTML(solution)}
      </Tab.Pane>
    )
  }

  render() {
    if (this.props.questions) {  const panes = [
      { menuItem: 'Question', render: () => this.renderQuestion() },
      { menuItem: 'Hint', render: () => this.renderHint() },
      { menuItem: 'Solution', render: () => this.renderSolution() }
    ]
    return <Tab panes={panes} />
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

export default withRouter(connect(mapState)(Questions))
