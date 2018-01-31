import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { Input, Dropdown, Button, Icon } from 'semantic-ui-react'
import { applyFiltersThunk } from '../../store/index'
import { toggleShow } from '../auth/auth-reducer'
import './search-bar.css'

const expOptions = [
  {
    text: 'Entry Level',
    value: 'Entry Level',
  }, {
    text: 'Mid Level',
    value: 'Mid Level',
  }, {
    text: 'Senior Level',
    value: 'Senior Level',
  }
]

const radiusOptions = [
{
  text: '1 Mile',
  value: 1,
}, {
  text: '5 Miles',
  value: 5,
}, {
  text: '10 Miles',
  value: 10,
}, {
  text: '25 Miles',
  value: 25,
}, {
  text: '50 Miles',
  value: 50,
}, {
  text: '100 Miles',
  value: 100,
}
]

const typeOptions = [
{
  text: 'Full-time',
  value: 'Full-time',
}, {
  text: 'Part-time',
  value: 'Part-time',
}, {
  text: 'Contract',
  value: 'Contract',
},
]

const defaultState = {
  advanced: false,
  type: '',
  experience: '',
  radius: '',
  zip: '08648',
  exclude: ''
}

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = defaultState;

    this.toggleAdvanced = this.toggleAdvanced.bind(this);
  }

  render() {
    const { advanced, experience, type, zip, radius, exclude } = this.state;
    const { authShow } = this.props;
    return (
      <div className="search-bar">
        <div className="main-menu row">
          <div className="col-sm-2">
            <h1 className="logo">WorkIt</h1>
          </div>
          <div className="col-sm-5 search-input-wrapper">
            <Input className="search-input" placeholder="Search our jobs..." />
            <Input className="search-input" placeholder="City, State or Zip" />
          </div>
          <div className="col-sm-3 search-btns-wrapper">
            <Button className="search-btn">Search</Button>
            <Button basic className="advanced-btn" onClick={() => this.toggleAdvanced()}>Filter</Button>
          </div>
          <div className="col-sm-2">
            <ul className="list-inline menu-icons text-right">
              <li><Icon name='mail outline' size='big' /></li>
              <li onClick={() => this.handleLogin(authShow)}><Icon name='user outline' size='big' /></li>
            </ul>
          </div>
        </div>
        <div className={advanced ? 'advanced active row' : 'advanced row'}>
          <div className="col-sm-2 advanced-col">
            <Dropdown className="dd-radius" placeholder='Radius' selection value={radius} options={radiusOptions} onChange={(evt, { value }) => this.handleSelect('radius', value)} />
          </div>
          <div className="col-sm-2 advanced-col">
            <Dropdown className="dd-exp" placeholder='Experience' selection value={experience} options={expOptions} onChange={(evt, { value }) => this.handleSelect('experience', value)} />
          </div>
          <div className="col-sm-2 advanced-col">
            <Dropdown className="dd-exp" placeholder='Job Type' selection value={type} options={typeOptions} onChange={(evt, { value }) => this.handleSelect('type', value)} />
          </div>
          <div className="col-sm-2 advanced-col">
            <Input className="input-zip" placeholder='Exlude (Comma Seperated)' value={exclude} onChange={(evt, { value }) => this.handleSelect('exclude', value)} />
          </div>
          <div className="col-sm-2 advanced-col">
            <Button color="blue" className="apply-filters-btn" onClick={() => this.handleApplyFilters()} >Apply</Button>
            <Button basic className="reset-filters-btn" onClick={() => this.handleResetClick()}>Reset</Button>
          </div>
        </div>
      </div>
    )
  }

  handleSelect(filterType, value) {
    this.setState({[filterType]: value}, () => {
      console.log(this.state);
    })
  }

  toggleAdvanced() {
    this.setState({advanced: !this.state.advanced});
  }

  handleResetClick() {
    let newState = defaultState;
    newState.advanced = true;
    this.setState(newState, () => {
      this.handleApplyFilters();
    });
  }

  handleApplyFilters() {
    this.setState({advanced: false}, () => {
      this.props.handleApplyFiltersThunk(this.state);
    })
  }

  handleLogin(authShow) {
    if (this.props.isLoggedIn) {
      this.props.history.push('/user');
    } else {
      this.props.handleShowLogin(authShow)
    }
  }
}

const mapState = (state) => {
  return {
    authShow: state.auth.show,
    isLoggedIn: state.user.id
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleApplyFiltersThunk(filters) {
      dispatch(applyFiltersThunk(filters))
    },
    handleShowLogin(authShow) {
      dispatch(toggleShow(authShow))
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(SearchBar))
