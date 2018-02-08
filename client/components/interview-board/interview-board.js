import React, { Component } from 'react'
import './interview-board.css'
import './simpledrag'
import WhiteBoard from './whiteboard'
import TextArea from './textarea'

export default class InterviewBoard extends Component {
    constructor (props) {
        super (props);
        this.topLimit = 10;
        this.bottomLimit = 90;

        this.dragFunc = this.dragFunc.bind(this);
    }

    componentDidMount () {
        const c = document.getElementById('canvas');

        // const ctx = c.getContext("2d");
        // ctx.font = "25px Arial";
        // ctx.fillText("Hello World",10,50);
        //c.width = c.height * (c.clientWidth / c.clientHeight);

        const leftPane = document.getElementById('left-pane');
        const rightPane = document.getElementById('right-pane');
        const paneSep = document.getElementById('panes-separator');

        // The script below constrains the target to move horizontally between a left and a right virtual boundaries.
        // - the left limit is positioned at 10% of the screen width
        // - the right limit is positioned at 90% of the screen width
        paneSep.sdrag(this.dragFunc (leftPane, rightPane, this.topLimit, this.bottomLimit), null, 'vertical');
    }


    render () {

        return (

            <div className="panes-container">
                <div className="left-pane" id="left-pane">
                    <TextArea />
                </div>
                <div className="panes-separator" id="panes-separator">...</div>
                <div className="right-pane" id="right-pane" >
                    <WhiteBoard />
                </div>
            </div>
        )

    }

     dragFunc (leftPane, rightPane, topLimit, bottomLimit, stateCB) {
         return function (el, pageX, startX, pageY, startY, fix) {

        fix.skipX = true;
        fix.skipY = true;

        if (pageY < window.innerHeight * topLimit / 100) {
            pageY = window.innerHeight * topLimit / 100;
            fix.pageY = pageY;
        }
        if (pageY > window.innerHeight * bottomLimit / 100) {
            pageY = window.innerHeight * bottomLimit / 100;
            fix.pageY = pageY;
        }

        var cur = pageY / window.innerHeight * 100;
        if (cur < 0) {
            cur = 0;
        }
        if (cur > window.innerHeight) {
            cur = window.innerHeight;
        }

        const bottom = (100-cur-2);
        leftPane.style.height = cur + '%';
        rightPane.style.height = bottom + '%';

        }
    }
}
