/* global describe beforeEach it */

import {expect} from 'chai'
import React from 'react'
import enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Tile from './tile'
import 'ignore-styles'


const adapter = new Adapter()
enzyme.configure({adapter})

describe('Tile', () => {
  let tile

  const props = {
    name: 'Google',
    position: 'Software Enginer',
    location: 'New York, NY',
    topSkills: ['JavaScript', 'Jasmine', 'Java'],
    salaryRange: {
      min: 50,
      max: 100
    },
    imgUrl: 'https://image.flaticon.com/teams/slug/google.jpg',
    companyDesc: '<ul><li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.</li><li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li><li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li><li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</li></ul>',
    roleDesc: '<ul><li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.</li><li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li><li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li><li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</li></ul>',
    qualifications: '<ul><li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.</li><li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li><li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li><li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</li></ul>',
    comp: '<ul><li>Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.</li><li>Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.</li><li>Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.</li><li>Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.</li></ul>'
  }

  before(() => {
    tile = shallow(<Tile {...props} />)
  })

  it('renders the home view', () => {
    console.log('running');
    expect(tile.state().view).to.be.equal(0);
    expect(tile.find('.name').text()).to.be.equal('Google')
    expect(tile.find('.position').text()).to.be.equal('Software Enginer')
    expect(tile.find('.location').text()).to.be.equal('New York, NY')
    expect(tile.find('.range').text()).to.be.equal('$50K - $100K')
    expect(tile.find('.top-skills').text()).to.be.equal('JavaScript, Jasmine, Java')
    expect(tile.find('.logo').prop('src')).to.be.equal('https://image.flaticon.com/teams/slug/google.jpg')
  })

  it('renders the company description view', () => {
    // Clicked next
    tile.find('.next').simulate('click');
    console.log('State', tile.state());
    expect(tile.state().view).to.be.equal(1);
    expect(tile.find('.name').text()).to.be.equal('Google');
    expect(tile.find('.title').text()).to.be.equal('Company Description');
    expect(tile.find('.description').text()).to.be.equal('Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.');
  })

  it('renders the role description view', () => {
    // Clicked next
    tile.find('.next').simulate('click');
    expect(tile.state().view).to.be.equal(2);
    expect(tile.find('.name').text()).to.be.equal('Google');
    expect(tile.find('.title').text()).to.be.equal('Role Description');
    expect(tile.find('.description').text()).to.be.equal('Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.');
  })

  it('renders the qualification view', () => {
    // Clicked next
    tile.find('.next').simulate('click');
    expect(tile.state().view).to.be.equal(3);
    expect(tile.find('.name').text()).to.be.equal('Google');
    expect(tile.find('.title').text()).to.be.equal('Qualifications');
    expect(tile.find('.description').text()).to.be.equal('Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.');
  })

  it('renders the compensation view', () => {
    // Clicked next
    tile.find('.next').simulate('click');
    expect(tile.state().view).to.be.equal(4);
    expect(tile.find('.name').text()).to.be.equal('Google');
    expect(tile.find('.title').text()).to.be.equal('Compensation & Benefits');
    expect(tile.find('.description').text()).to.be.equal('Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat.Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.Pellentesque fermentum dolor. Aliquam quam lectus, facilisis auctor, ultrices ut, elementum vulputate, nunc.');
  })

})
