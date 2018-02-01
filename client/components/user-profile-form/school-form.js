import React, {Component} from 'react'
// import {connect} from 'react-redux'
// import {withRouter} from 'react-router-dom'
import { Form, Input, TextArea, Button} from 'semantic-ui-react'
import './user-profile-form.css'


class SchoolForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      schoolName: '',
      startDate: '',
      endDate: '',
      degree:  ''
      }
  }


  handleStringChange(key, val){
    this.setState({[key]:val})
  }


  render() {
    const { schoolName, startDate, endDate, degree } = this.state;

    return (
      <div className="SchoolForm row">
          <Form>
            <Input className="schoolName" placeholder="School Name" value={schoolName} onChange={(evt) => this.handleStringChange('schoolName', evt.target.value)} />

            <Input className="startDate" placeholder="Start Date" value={startDate} onChange={(evt) => this.handleStringChange('startDate', evt.target.value)} />

            <Input className="endDate" placeholder="End Date" value={endDate} onChange={(evt) => this.handleStringChange('endDate', evt.target.value)} />

            <TextArea className="degree" placeholder="Degree" value={degree} onChange={(evt) => this.handleStringChange('degree', evt.target.value)} />

            <Button circular icon="plus" className="add-btn" onClick={() => this.addSchool()} />
          </Form>

      </div>
    )
  }
}

export default SchoolForm
