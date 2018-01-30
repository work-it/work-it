import React,  { Component } from 'react';
import getHTMLMediaElement from './getHTMLMediaElement';
import './getHTMLMediaElement.css'

export default class Video extends Component {
    constructor (props) {
        super (props)

        this.addEvent = this.addEvent.bind(this);
        this.setup = this.setup.bind(this);
        this.afterEach = this.afterEach.bind(this);
        this.reCheckRoomPresence = this.reCheckRoomPresence.bind(this);
    }

    componentDidMount () {
        const connection   = new RTCMultiConnection();
        console.log("connection", connection)
        this.setup(connection, this.addEvent, this.afterEach, this.reCheckRoomPresence)
        console.log("setup done");

        connection.checkPresence("abcdef", function(isRoomExists) {
            console.log("checking presence")
            if (isRoomExists) {
              console.log("JOINING")
              connection.join("abcdef");
              //connection1.join("abcdef")
              //connection1.becomePublicModerator();
            } else {
              console.log("OPENING")
              connection.open ("abcdef", true);
              //connection1.join("abcdef")
            }
          })
    }

    afterEach(setTimeoutInteval, numberOfTimes, callback, startedTimes) {
        startedTimes = (startedTimes || 0) + 1;
        if (startedTimes >= numberOfTimes) return;
    
        setTimeout(function() {
            callback();
            afterEach(setTimeoutInteval, numberOfTimes, callback, startedTimes);
        }, setTimeoutInteval);
    }
    
    

    addEvent (event, connection) {
        const existing = document.getElementById(event.streamid)
        if (existing && existing.parentNode) {
          existing.parentNode.removeChild(existing);
        }
        if(event.mediaElement) {
            event.mediaElement.muted = true;
            delete event.mediaElement;
          }

          var video = document.createElement('video');
          video.controls = true;
          if(event.type === 'local') {
            video.muted = true;
          }
          console.log("right before srcObj")
          //video.src = URL.createObjectURL(event.stream);
          video.srcObject = event.stream;
          console.log("got this far")
          //const width = parseInt(connection.videosContainer.clientWidth/2) -20;
          //const width = 120;
          //sconsole.log('width', width)
          const mediaElement = getHTMLMediaElement(video, {
            title: event.userid,
            buttons: ['full-screen'],
            showOnMouseEnter: false
          })


        // console.log("About to add video to screen", connection.videosContainer)
        // event.mediaElement.width=300;
        // connection.videosContainer.appendChild(event.mediaElement);
        // event.mediaElement.id = event.streamid;
        // event.mediaElement.play();
        // console.log("mediaElement is set to play")
        // setTimeOut(() => {
        // console.log("timeout is triggered")
        // event.mediaElement.play();
        // }, 5000);

        console.log("About to add video to screen", connection.videosContainer)
        //mediaElement.width=300;
        connection.videosContainer.appendChild(mediaElement);
        mediaElement.id = event.streamid;
        //mediaElement.play();
        console.log("mediaElement is set to play")
        setTimeOut(() => {
        console.log("timeout is triggered")
        mediaElement.play();
        }, 5000);
        
    }

    setup (connection, addEvent, afterEach, reCheckRoomPresence) {
        connection.autoCloseEntireSession = false;
        connection.socketURL = 'localhost:8080/';
        //connection.socketURL = 'localhost:8080/';

        connection.processSdp = function(sdp) {
            sdp = BandwidthHandler.setApplicationSpecificBandwidth(sdp, connection.bandwidth, !!connection.session.screen);
            sdp = BandwidthHandler.setVideoBitrates(sdp, {
                min: 30,
                max: 50
            });
            sdp = BandwidthHandler.setOpusAttributes(sdp);
            return sdp;
        };
          
        connection.session = {
            audio: true,
            video: true
          };
          connection.sdpConstraints.mandatory = {
              OfferToReceiveAudio: true,
              OfferToReceiveVideo: true
          };
          connection.videosContainer = document.getElementById("videos-container");
          console.log("video container set", connection.videosContainer)
          connection.onstream = function (event) {
            addEvent(event, connection)
          }
          connection.onstreamended = function (event) {
            //console.log(event.streamid)
            const mediaElement = document.getElementById(event.streamid);
     
            //console.log (mediaElement)
            if (mediaElement) {
                mediaElement.parentNode.removeChild(mediaElement);
            }
          }

          connection.onUserStatusChanged = function(event) {
            console.log ("User status changed!!!", event)
            if (connection.userType == "participant" && event.status === 'offline') { //manually set by me for all participants using a cookie
                reCheckRoomPresence(); //window.location.reload(false); this works on chrome/firefox
            }
        };

        // connection.onunmute = function(event) {
        //     // event.isAudio == audio-only-stream
        //     // event.audio == has audio tracks
        
        //     if (event.isAudio || event.session.audio) {
        //         // set volume=0
        //         event.mediaElement.volume = 0;
        
        //         // steadily increase volume
        //         afterEach(200, 5, function() {
        //             event.mediaElement.volume += .20;
        //         });
        //     }
        // };
      }

      reCheckRoomPresence(){
        var findWhenCustomerReconnectsToTheRoom = setInterval(function(){
            connection1.checkPresence("abcdef", function(isRoomExists) {
                if(isRoomExists) {
                    connection1.join("abcdef"); //sessionDetails.token is room-id
                    clearInterval(findWhenCustomerReconnectsToTheRoom);
                    return;
                }
            });
        }, 1);
    }

    render () {
        return <div id="videos-container"></div>
    }
}