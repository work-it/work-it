import React, {Component} from 'react'
// import {connect} from 'react-redux'
// import {withRouter} from 'react-router-dom'
import { Form, Input, TextArea, Button} from 'semantic-ui-react'
import './user-profile-form.css'


class ProjectForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projName: '',
      startDate: '',
      endDate: '',
      projWebsite: '',
      projDesc:  ''
      }
  }


  handleStringChange(key, val){
    this.setState({[key]:val})
  }


  render() {
    const { projName, startDate, endDate, projWebsite, projDesc } = this.state;

    return (
      <div className="PastEmployerForm row">
          <Form>
            <Input className="projName" placeholder="Project Name" value={projName} onChange={(evt) => this.handleStringChange('projName', evt.target.value)} />

            <Input className="startDate" placeholder="Start Date" value={startDate} onChange={(evt) => this.handleStringChange('startDate', evt.target.value)} />

            <Input className="endDate" placeholder="End Date" value={endDate} onChange={(evt) => this.handleStringChange('endDate', evt.target.value)} />

            <Input className="projWebsite" placeholder="Project Website" value={projWebsite} onChange={(evt) => this.handleStringChange('projWebsite', evt.target.value)} />

            <TextArea className="projDesc" placeholder="Project Description" value={projDesc} onChange={(evt) => this.handleStringChange('projDesc', evt.target.value)} />

            <Button circular icon="plus" className="add-btn" onClick={() => this.addProject()} />
          </Form>

      </div>
    )
  }
}

export default ProjectForm
