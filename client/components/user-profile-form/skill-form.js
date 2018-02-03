import React, {Component} from 'react'
import {connect} from 'react-redux'
import { updateProfileThunk } from '../../store'
// import {withRouter} from 'react-router-dom'
import { Form, Button, Input, Dropdown, Icon} from 'semantic-ui-react'
import './user-profile-form.css'

// Options for the skills dropdown menu
const skillRanks = [
  {text: 'Beginner', value: 'beginner'},
  {text: 'Intermediate', value: 'intermediate'},
  {text: 'Advanced', value: 'advanced'},
]

class SkillForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      skillsArr: [], // Array for holding added skills
      skillName: '', // Skill name we are currenlty entering
      skillRank: '',  // Skill rank we are currently entering
      topSkill: false, // Set to true if is a top skill
      topSkillsCount: 0, // Keep count of top skills as added and removed
      showTopSkillWarning: false, // Show too many top skills warning if true
      showDupSkillWarning: false, // Show duplicate skill warning if tyring to add skill with same name
      editing: false, // Shows the pencil icon with the editSkill function rather than the add icon with the addSkill function
      editingIdx: null // Keeps track of which skill we are trying to edit
    }
  }

  // Grab the profile and update the skillsArr with what was previously saved to the db.
  componentWillMount() {
    if (this.props.profile) {
      this.setState(this.props.profile);
    }
  }

  // Updates the local state when the inputs are updated.
  handleStringChange(key, val){
    this.setState({[key]: val, showDupSkillWarning: false})
  }


  render() {
    // Pull of all of the key/values from this.state and this.props to keep the code clean.
    const { skillName, skillRank, skillsArr, showTopSkillWarning, showDupSkillWarning, topSkillsCount } = this.state;
    const { prevClick } = this.props;

    return (
      <div className="SkillForm row">
        {/* If showTopSkillsWarning is true, show the warning */}
        {showTopSkillWarning && <h3>Only 3 Top Skills Allowed. Remove A Top Skill To Add Another.</h3>}
        {/* If showDupSkillsWarning is true, show the warning */}
        {showDupSkillWarning && <h3>You Already Added This Skill.</h3>}
        <ul>
          {
            /* Map over the skillsArr and only return the skills that match the condition in the if statement */
            !!skillsArr.length &&
            skillsArr.map((skill, idx) => {
              if (skill.topSkill) {
                return (
                <li key={skill.name}>
                  {`${skill.name} - ${skill.rank}`}
                  <Button circular icon="star" className="remtop-btn" onClick={() => this.removeFromTop(idx)} />
                  <Button circular icon="trash" className="remove-btn" onClick={() => this.removeSkill(idx)} />
                  <Button circular icon="pencil" className="edit-btn" onClick={() => this.editSkill(idx)} />
                </li>
              )
              }
            })
          }
        </ul>
        <hr />
        <ul>
          {
            /* Map over the skillsArr and only return the skills that match the condition in the if statement */
            !!skillsArr.length &&
            skillsArr.map((skill, idx) => {
              if (skill.rank === 'advanced' && !skill.topSkill) {
                return (
                  <li key={skill.name}>
                  {`${skill.name} - ${skill.rank}`}
                  <Button circular icon="empty star" className="addtop-btn" onClick={() => this.addToTop(idx)} />
                  <Button circular icon="trash" className="remove-btn" onClick={() => this.removeSkill(idx)} />
                  <Button circular icon="pencil" className="edit-btn" onClick={() => this.editSkill(idx)} />
                  </li>
                )
              }
            })
          }
        </ul>
        <ul>
          {
            /* Map over the skillsArr and only return the skills that match the condition in the if statement */
            !!skillsArr.length &&
            skillsArr.map((skill, idx) => {
              if (skill.rank === 'intermediate' && !skill.topSkill) {
                return (
                  <li key={skill.name}>
                    {`${skill.name} - ${skill.rank}`}
                    <Button circular icon="empty star" className="addtop-btn" onClick={() => this.addToTop(idx)} />
                    <Button circular icon="trash" className="remove-btn" onClick={() => this.removeSkill(idx)} />
                    <Button circular icon="pencil" className="edit-btn" onClick={() => this.editSkill(idx)} />
                  </li>
                )
              }
            })
          }
        </ul>
        <ul>
          {
            /* Map over the skillsArr and only return the skills that match the condition in the if statement */
            !!skillsArr.length &&
            skillsArr.map((skill, idx) => {
              if (skill.rank === 'beginner' && !skill.topSkill) {
                return (
                  <li key={skill.name}>
                  {`${skill.name} - ${skill.rank}`}
                  <Button circular icon="empty star" className="addtop-btn" onClick={() => this.addToTop(idx)} />
                  <Button circular icon="trash" className="remove-btn" onClick={() => this.removeSkill(idx)} />
                  <Button circular icon="pencil" className="edit-btn" onClick={() => this.editSkill(idx)} />

                  </li>
                )
              }
            })
          }
        </ul>
        <Form>
          <Input className="skillName" placeholder="Skill" value={skillName} onChange={(evt) => this.handleStringChange('skillName', evt.target.value)} />

          <Dropdown selection className="skillRank" placeholder="Skill Rank" value={skillRank} onChange={(evt, {value}) => this.handleStringChange('skillRank', value)} options={skillRanks} />
          {
            /* If editing is true, show the pencil icon and call the updateSkill function if the button is clicked
            * If editing is false, show the add icon and call the addSkills function if the button is clicked
            */
            this.state.editing ?
            <Button circular icon="pencil" className="add-btn" onClick={() => this.updateSkill()} /> :
            <Button circular icon="plus" className="add-btn" onClick={() => this.addSkill()} />
          }
        </Form>
        {/* prevClick is a callback function passed down as props from the parent. It increments the step down by 1.*/}
        <Button onClick={prevClick}>Prev</Button>
        {/* handleNextClick takes care of calling the nextClick callback function passed down by the parent AND calls the redux thunk to save the info to the db. */}
        <Button onClick={() => this.handleNextClick()}>Next</Button>
      </div>
    )
  }

  removeSkill(idx) {
      // Get current skills array
      let currentSkillsArr = this.state.skillsArr;
      // Change the topskills flag on the skill at the idx
      const skillRemoved = currentSkillsArr.splice(idx, 1);
      // If the skill being removed is a top skill, increment the top skills count down by 1.
      if (skillRemoved[0].topSkill) {
        this.setState({skillsArr: currentSkillsArr, topSkillsCount: this.state.topSkillsCount - 1});
      } else {
        // Otherwise, just update the skills array with the array with the skills removed.
        this.setState({skillsArr: currentSkillsArr});
      }
  }

  editSkill(idx) {
    // Get current skills array
    let currentSkillsArr = this.state.skillsArr;
    // Get the skill we want to edit
    const skill = currentSkillsArr[idx];
    // Update the form inputs to show skill we are editing
    this.setState({skillName: skill.name, skillRank: skill.rank, editing: true, editingIdx: idx});
  }

  updateSkill() {
    // Get current skills array
    let currentSkillsArr = this.state.skillsArr;
    // Update the info for the skill we want to edit. editingIdx was saved on state at the time the edit button was clicked.
    currentSkillsArr[this.state.editingIdx].name = this.state.skillName;
    currentSkillsArr[this.state.editingIdx].rank = this.state.skillRank;
    // Update state with the edited skill information AND reset the rest of the appropriate state values.
    this.setState({skillsArr: currentSkillsArr, editing: false, editingIdx: null, skillName: '', skillRank: ''});
  }

  addSkill() {
    // Get current skills array
    let currentSkillsArr = this.state.skillsArr;
    // Count up how many skills in the array already have the name of the skill being added
    const dupCheck = currentSkillsArr.filter(skill => {
      const skillName = skill.name.toLowerCase();
      const newSkillName = this.state.skillName.toLowerCase();

      if (skillName === newSkillName) return skill;
    }).length;

    if (dupCheck > 0) {
      // If duplicate name count > 0, i.e. the skill is already in the array, show warning and don't push into the array
      this.setState({showDupSkillWarning: true});
    } else {
      // If duplicate name count = 0, the skill does not already exist so push in new skill
      currentSkillsArr.push({name: this.state.skillName, rank: this.state.skillRank})
      // Replace the skills array on the local state
      this.setState({skillsArr: currentSkillsArr, skillName: '', skillRank: ''});
    }
  }

  addToTop(idx) {
    // Check the top skills count on state, if there are < 3 skills continue on...
    if (this.state.topSkillsCount < 3) {
      // Get current skills array.
      let currentSkillsArr = this.state.skillsArr;
      // Change the topskills flag on the skill at the idx.
      console.log('selected skill', currentSkillsArr[idx])
      currentSkillsArr[idx].topSkill = true;
      // Replace the skills array on the local state.
      this.setState({skillsArr: currentSkillsArr, topSkillsCount: this.state.topSkillsCount + 1});
    } else {
      // Update the state to show the top skills warnging.
      this.setState({showTopSkillWarning: true})
    }
  }

  removeFromTop(idx) {
    // Get current skills array
    let currentSkillsArr = this.state.skillsArr;
    // Change the topskills flag on the skill at the idx
    currentSkillsArr[idx].topSkill = false;
    // Replace the skills array on the local state
    this.setState({skillsArr: currentSkillsArr, topSkillsCount: this.state.topSkillsCount - 1, showTopSkillWarning: false});
  }

  handleNextClick() {
    // increment the step in the parent
    this.props.nextClick();
    // consolidate data and prepare it to be sent to the redux thunk.
    let data = { skillsArr: this.state.skillsArr };
    data.step = this.props.step;
    // call the thunk to update profile in firebase
    this.props.handleProfileFormThunk(data);
  }
}

const mapState = (state) => {
  return {
    profile: state.profile // Get profile for updating the component on initial load.
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleProfileFormThunk(data) {
      dispatch(updateProfileThunk(data)) // Dispatch the thunk with the data for updating the db.
    }
  }
}

export default connect(mapState, mapDispatch)(SkillForm)
