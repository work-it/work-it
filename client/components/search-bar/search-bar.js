import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
//import {Link} from 'react-router'
import { Input, Dropdown, Button, Icon } from 'semantic-ui-react'
import { applyFiltersThunk, clearFilters } from '../../store'
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
  term: '',
  location: '',
  advanced: false,
  type: '',
  experience: '',
  radius: 25,
  zip: ''
}

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = defaultState;

    this.toggleAdvanced = this.toggleAdvanced.bind(this);
  }

  componentWillMount() {
    const URLparams = new URLSearchParams(this.props.location.search);
    const term = URLparams.get('term');
    const location = URLparams.get('location');
    if (term && location) {
      this.setState({ term, location });
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextURLterm = new URLSearchParams(nextProps.location.search).get('term');
    const URLterm = new URLSearchParams(this.props.location.search).get('term');
    const nextURLlocation = new URLSearchParams(nextProps.location.search).get('location');
    const URLlocation = new URLSearchParams(this.props.location.search).get('location');
    if ((nextURLterm !== URLterm) || (nextURLlocation !== URLlocation)) {
      this.setState({term: nextURLterm, location: nextURLlocation});
    }
  }

  render() {
    const { advanced, experience, type, zip, radius, exclude } = this.state;
    const { authShow, room, waiting, isLoggedIn } = this.props;
    let notice = null;
    const pairStarted = isLoggedIn && room&&room.initiator===isLoggedIn && !room.initiatorIn
    if (pairStarted && !waiting) {
      notice = <a className="paired-warning" href={`/practice/${room?room.name:''}`}>
      <p>Waiting to be Paired <img className="loading" src="/blocks.gif" /></p></a>
    } else if (waiting) {
      notice = <a className="paired-warning" href={`/practice/${room?room.name:''}`}>Paired! Click to Join!</a>
    }
    <Icon loading name='certificate' />

    return (
      <div className="search-bar">
        <div className="main-menu row">
          <div className="logo-wrapper">
            <Link to="/"><img className="logo" src="/workit-logo3.png" /></Link>
          </div>
          <div className="search-input-wrapper">
            <Input
              className="search-input"
              placeholder="Search our jobs..."
              value={this.state.term?this.state.term:''}
              onChange={(evt, {value}) => this.setState({term: value})}
            />
            <Input
              className="search-input"
              placeholder="City, State or Zip"
              value={this.state.location?this.state.location:''}
              onChange={(evt, {value}) => this.setState({location: value})}
            />
            <Button
              className="search-btn"
              color='blue'
              onClick={() => this.hanldeSearch()}
            >Search</Button>
            {/* <Button
              className="advanced-btn"
              color='black'
              basic
              onClick={() => this.toggleAdvanced()}>
              Filter
            </Button> */}
          </div>
          <div className="links-wrapper">
             { notice }
              {
                isLoggedIn ?
                this.renderLoggedInLinks() :
                this.renderLoggedOutLinks()
              }
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
            <Button color="blue" className="apply-filters-btn" onClick={() => this.handleApplyFilters()} >Apply</Button>
            <Button basic className="reset-filters-btn" onClick={() => this.handleResetClick()}>Reset</Button>
          </div>
        </div>
      </div>
    )
  }

  renderLoggedInLinks() {
    const trigger = (
      <span>
        <Icon name='content' size='big'/> Menu
      </span>
    )

    const options = [
      {
        key: 'user',
        text: <span>Signed in as <strong>{this.props.email}</strong></span>,
        disabled: true,
      },
      { key: 'applications', text: 'Applications', icon: 'edit', value: 'applications'},
      { key: 'code', text: 'Practice', icon: 'code', value: 'practice' },
      { key: 'mail', text: 'Message', icon: 'mail outline', value: 'message' },
      { key: 'profile', text: 'Profile', icon: 'user outline', value: 'profile' },
      { key: 'logout', text: 'Logout', icon: 'sign out', value: 'logout' },

    ]

    return (
      <ul className="list-inline menu-icons text-right">
      {
        // <li onClick={() => this.props.logout()}><Icon name='sign out' size='big' /><span className="link-text">Logout</span></li>
        // <li><Icon name='code' size='big' onClick={() => this.props.history.push('/practice')}/><span className="link-text">Practice</span></li>
        // <li><Icon name='mail outline' size='big' onClick={() => this.props.history.push('/messages')} /><span className="link-text">Message</span></li>
        // <li onClick={() => this.handleLogin(authShow)}><Icon name='user outline' size='big' /><span className="link-text">Profile</span></li>
      }

        <li>
          <Dropdown trigger={trigger} options={options} pointing='top right' icon={null} openOnFocus={true} onChange={(event, data) => this.handleDropdown(event, data)}/>
        </li>
      </ul>
    )
  }

  handleDropdown (event, data) {
    console.log("Handle DropDown", data.value);
    const value = data.value
    if (value==='logout')
      this.props.logout()
    else if (value ==='practice')
      this.props.history.push('/practice')
    else if (value ==='message')
      this.props.history.push('/messages')
    else if (value==='applications')
      this.props.history.push('/applications/in-progress')
    else
      this.handleLogin(this.props.authShow)
  }

  renderLoggedOutLinks() {
    const { authShow } = this.props;
    return (
      <ul className="list-inline menu-icons text-right">
        <li onClick={() => this.handleLogin(authShow)}><Icon name='sign in' size='big' /><span className="link-text">Login</span></li>
      </ul>
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
      this.props.handleClearFilters();
    });
  }

  handleApplyFilters() {
    this.setState({advanced: false}, () => {
      this.props.handleApplyFiltersThunk(this.state);
    })
  }

  handleLogin(authShow) {
    if (this.props.isLoggedIn) {
      this.props.history.push('/profile');
    } else {
      this.props.handleShowLogin(authShow)
    }
  }

  hanldeSearch() {
    const searchString = `/search/?term=${this.state.term}&location=${this.state.location}`;
    this.props.history.push(searchString);
  }
}

const mapState = (state) => {
  return {
    authShow: state.auth.show,
    isLoggedIn: state.user.id,
    email: state.user.email,
    waiting: state.practice.waiting,
    room: state.practice.room
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleApplyFiltersThunk(filters) {
      dispatch(applyFiltersThunk(filters))
    },
    handleShowLogin(authShow) {
      dispatch(toggleShow(authShow))
    },
    handleClearFilters() {
      dispatch(clearFilters())
    }
  }
}

export default withRouter(connect(mapState, mapDispatch)(SearchBar))
