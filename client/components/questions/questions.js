import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react'
import renderHTML from 'react-render-html';
import './questions.css'

export default class Questions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      state: 0,
    }
  }

  renderQuestion() {
    const {title, question} = this.props;
    return (
      <Tab.Pane key="question">
        <h2>{title}</h2>
        {renderHTML(question)}
      </Tab.Pane>
    )
  }
  renderHint() {
    const {title, hint} = this.props;
    return (
      <Tab.Pane key="hint">
        <h2>{title}</h2>
        {renderHTML(hint)}
      </Tab.Pane>
    )
  }
  renderSolution() {
    const {title, solution} = this.props;
    return (
      <Tab.Pane key="solution">
        <h2>{title}</h2>
        {renderHTML(solution)}
      </Tab.Pane>
    )
  }

  render() {

    const panes = [
      { menuItem: 'Question', render: () => this.renderQuestion() },
      { menuItem: 'Hint', render: () => this.renderHint() },
      { menuItem: 'Solution', render: () => this.renderSolution() }
    ]
    return (
      <div>
        <Tab panes={panes} />
      </div>
    );
  }

}
