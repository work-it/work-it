import React, { Component } from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { saveJobThunk, addSavedToFilteredThunk, removeSavedJobThunk } from '../../store'
import { Card, Icon, Image, Button } from 'semantic-ui-react'
import renderHTML from 'react-render-html'
import './tile.css'

class Tile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 0,
      maxView: 4,
    }
  }

  render() {
    const {view} = this.state;
    return (
      <div className="tile col-sm-3">
        {!view ? this.renderHomeView() : this.renderDescView()}
      </div>
    );
  }

  handleNextClick() {
    const {view, maxView} = this.state;
    if (view === maxView) {
      this.setState({view: 0})
    } else {
      this.setState({view: view + 1})
    }
  }

  handlePrevClick() {
    const {view, maxView} = this.state;
    if (view === 0) {
      this.setState({view: maxView})
    } else {
      this.setState({view: view - 1})
    }
  }

  renderHomeView() {
    const {userId, id, savedBy, name, position, location, experience, type, salaryRange, topSkills, handleSaveJob, handleRemoveSavedJob} = this.props;
    return (
      <Card>
        <div className="logo-wrapper">
          <Image className="logo" src={this.props.imgUrl} />
        </div>
        <Card.Content>
          <Card.Header>
            <span className="name">
              {name}
            </span>
            <span className="position">
              {position}
            </span>
          </Card.Header>
          <Card.Meta>
            <span className="location">
              {location}
            </span>
          </Card.Meta>
          <Card.Description>
            <span className="top-skills">
          {topSkills.map(skill => skill).join(', ')}
            </span>
            <span className="exp-type">
            {`${experience} - ${type}`}
            </span>
            <span className="range">
              {`$${salaryRange.min}K - $${salaryRange.max}K`}
            </span>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
        <div className="prev" onClick={() => this.handlePrevClick()}>
          <i className="fa fa-chevron-left" aria-hidden="true"></i>
        </div>
        <div className="btn-group-wrapper text-center">
          <Button.Group className="btn-group">
            <Button>View</Button>
            <Button>Apply</Button>
            {
              savedBy && savedBy.includes(userId) ?
              <Button onClick={() => handleRemoveSavedJob(id)}>Unsave</Button> :
              <Button onClick={() => handleSaveJob(id)}>Save</Button>
            }

          </Button.Group>
        </div>
        <div className="next" onClick={() => this.handleNextClick()}>
          <i className="fa fa-chevron-right" aria-hidden="true"></i>
        </div>
        </Card.Content>
      </Card>
    )
  }

  renderDescView() {
    const {savedBy, userId, id, name, companyDesc, roleDesc, qualifications, comp, handleSaveJob, handleRemoveSavedJob} = this.props;
    const {view} = this.state;

    let title
    let desc
    switch (view) {
      case 1:
        title = 'Company Description';
        desc = companyDesc;
        break;
      case 2:
        title = 'Role Description';
        desc = roleDesc;
        break;
      case 3:
        title = 'Qualifications';
        desc = qualifications;
        break;
      default:
        title = 'Compensation & Benefits';
        desc = comp;
    }

    return (
      <Card>
        <Image className="small-logo" src={this.props.imgUrl} />
        <Card.Content>
          <Card.Header>
          <span className="name">
              {name}
            </span>
            <span className="title">
              {title}
            </span>
          </Card.Header>
          <Card.Description>
            <span className="description">
              {renderHTML(desc)}
            </span>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
        <div className="prev" onClick={() => this.handlePrevClick()}>
          <i className="fa fa-chevron-left" aria-hidden="true"></i>
        </div>
        <div className="btn-group-wrapper text-center">
          <Button.Group className="btn-group">
            <Button>View</Button>
            <Button>Apply</Button>
            {
              savedBy && savedBy.includes(userId) ?
              <Button onClick={() => handleRemoveSavedJob(id)}>Unsave</Button> :
              <Button onClick={() => handleSaveJob(id)}>Save</Button>
            }
          </Button.Group>
        </div>
        <div className="next" onClick={() => this.handleNextClick()}>
          <i className="fa fa-chevron-right" aria-hidden="true"></i>
        </div>
        </Card.Content>
      </Card>
    )
  }
}

const mapState = (state) => {
  return {
    userId: state.user.id
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSaveJob(id) {
      dispatch(saveJobThunk(id))
      dispatch(addSavedToFilteredThunk(id))
    },
    handleRemoveSavedJob(id) {
      dispatch(removeSavedJobThunk(id))
    }
  }
}

export default connect(mapState, mapDispatch)(Tile)
