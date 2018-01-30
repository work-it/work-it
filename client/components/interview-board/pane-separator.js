import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { emitPaneSepEvent } from './panesep-reducer'
import './interview-board.css'

class PaneSeparator extends Component {
    constructor (props) {
        super (props);
        this.bottomPaneName = props.bottomPaneName;
        this.topPaneName = props.topPaneName;
        this.outerDivName = props.outerDivName;
        this.bottomPane = null;
        this.topPane = null;
        this.topLimit = 10;
        this.bottomLimit = 90;

        this.dragFunc = this.dragFunc.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }

    componentDidMount () {
        const paneSep = document.getElementById('panes-separator');
        this.topPane = document.getElementById(this.topPaneName);
        this.bottomPane = document.getElementById(this.bottomPaneName);
        this.outerDiv = document.getElementById(this.outerDivName);
        // The script below constrains the target to move vertically between a top and a bottom virtual boundaries.
        // - the top limit is positioned at 10% of the screen width
        // - the bottom limit is positioned at 90% of the screen width
        paneSep.sdrag(this.dragFunc (this.topPane, this.bottomPane, this.topLimit, this.bottomLimit, this.handleDrag, this.outerDiv), null, 'vertical');
    }

    componentDidUpdate () {
        this.setPosition(this.props.topHeight, this.props.bottomHeight);
    }

    handleDrag (topHeight, bottomHeight) {
        if (this.props.status==='pair_in_room' )
             this.props.emitPaneSep(topHeight, bottomHeight);
    }

    render () {
        return <div className="panes-separator" id="panes-separator">...</div>
    }

    setPosition (topHeight, bottomHeight) {
        this.topPane.style.height = topHeight + '%';
        this.bottomPane.style.height = bottomHeight + '%';
    }

    dragFunc (topPane, bottomPane, topLimit, bottomLimit, handleDrag, outerDiv) {
        return function (el, pageX, startX, pageY, startY, fix) {
            //console.log('y', pageY, startY)
            //console.log("outerDiv", outerDiv.clientHeight, outerDiv.offsetHeight, outerDiv.clientTop, outerDiv.offsetTop)
            fix.skipX = true;
            fix.skipY = true;

            if (pageY < outerDiv.clientHeight * topLimit / 100) {
                pageY = outerDiv.clientHeight * topLimit / 100;
                fix.pageY = pageY;
            }
            if (pageY > outerDiv.clientHeight * bottomLimit / 100) {
                pageY = outerDiv.clientHeight * bottomLimit / 100;
                fix.pageY = pageY;
            }
        
            pageY -= outerDiv.offsetTop;

            let cur = pageY / outerDiv.clientHeight * 100;
            if (cur < 0) {
                cur = 0;
            }
            if (cur > outerDiv.clientHeight) {
                cur = outerDiv.clientHeight;
            }
            const bottom = (100-cur-2);
        
            topPane.style.height = cur + '%';
            bottomPane.style.height = bottom + '%';

            handleDrag(cur, bottom);

       }
   }
}

const mapState = state => ({
    topHeight: state.panesep.topHeight,
    bottomHeight: state.panesep.bottomHeight,
    status: state.saved.practiceStatus
})

const mapDispatch = dispatch => ({
    emitPaneSep: (topHeight, bottomHeight) => dispatch (emitPaneSepEvent(topHeight, bottomHeight))
})

export default withRouter(connect (mapState, mapDispatch) (PaneSeparator))