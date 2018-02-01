import React, {Component} from 'react'
// import {connect} from 'react-redux'
// import {withRouter} from 'react-router-dom'
import { Form, Button, Input } from 'semantic-ui-react'
import './user-profile-form.css'



class SkillForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skillName: '',
      skillRank: ''
      }
  }


  handleStringChange(key, val){
    this.setState({[key]:val})
  }


  render() {
    const { skillName, skillRank } = this.state;
    const {nextClick, prevClick} = this.props;

    return (
      <div className="SkillForm row">
          <Form>
            <Input className="skillName" placeholder="Skill" value={skillName} onChange={(evt) => this.handleStringChange('skillName', evt.target.value)} />

            <Input className="skillRank" placeholder="Skill Rank" value={skillRank} onChange={(evt) => this.handleStringChange('skillRank', evt.target.value)} />
            <Button circular icon="plus" className="add-btn" onClick={() => this.addSkill()} />
          </Form>
          <Button onClick={prevClick}>Prev</Button>
          <Button onClick={nextClick}>Next</Button>
      </div>
    )
  }
}

export default SkillForm
