import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
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
    const { authShow, practiceStatus } = this.props;

    if (practiceStatus === 'pair_started') {
      notice = <li><a href={`/practice/${this.props.roomName}`}><img src='/yellow.png' width='25px'/></a></li>
    } else if (practiceStatus === 'waiting') {
      notice = <li><a href={`/practice/${this.props.roomName}`}><img src='/green.gif' width='25px'/></a></li>
    }
    <Icon loading name='certificate' />

    return (
      <div className="search-bar">
        <div className="main-menu row">
          <div className="col-sm-2">
            <h1 className="logo">WorkIt</h1>
          </div>
          <div className="col-sm-5 search-input-wrapper">
            <Input
              className="search-input"
              placeholder="Search our jobs..."
              value={this.state.term}
              onChange={(evt, {value}) => this.setState({term: value})}
            />
            <Input
              className="search-input"
              placeholder="City, State or Zip"
              value={this.state.location}
              onChange={(evt, {value}) => this.setState({location: value})}
            />
          </div>
          <div className="col-sm-3 search-btns-wrapper">
            <Button
              className="search-btn"
              onClick={() => this.hanldeSearch()}
            >Search</Button>
            <Button basic className="advanced-btn" onClick={() => this.toggleAdvanced()}>Filter</Button>
          </div>
          <div className="col-sm-2">
            <ul className="list-inline menu-icons text-right">
              <li><Icon name='code' size='big' onClick={() => this.props.history.push('/practice')}/></li>
              <li><Icon name='mail outline' size='big' onClick={() => this.props.history.push('/messages')} /></li>
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
      this.props.history.push('/user');
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
    practiceStatus: state.practice.practiceStatus,
    roomName: state.practice.room?state.practice.room.name:''
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
