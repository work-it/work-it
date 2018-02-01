'use strict';

import React,  { Component } from 'react';
const Video = require('twilio-video');
import axios from 'axios'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import './video.css'

class VideoContainer extends Component {
    constructor (props) {
        super (props)

        this.activeRoom = '';
        this.previewTracks;
        this.identity;
        this.roomName;

        this.connect = this.connect.bind(this)
        this.attachParticipantTracks = this.attachParticipantTracks.bind(this)
        this.attachTracks = this.attachTracks.bind(this)
        this.detachParticipantTracks = this.detachParticipantTracks.bind(this)
        this.attachParticipantTracksCB = this.attachParticipantTracksCB.bind(this)
        this.detachTracks = this.detachTracks.bind(this)
        this.roomJoined = this.roomJoined.bind(this);
        this.leaveRoomIfJoined = this.leaveRoomIfJoined.bind(this)
        this.trackAdded = this.trackAdded.bind(this)
        this.trackRemoved = this.trackRemoved.bind(this)
        this.participantDisconnected = this.participantDisconnected.bind(this)
        this.disconnected = this.disconnected.bind(this);
        this.loadLocalVideo = this.loadLocalVideo.bind(this);
        this.pause = this.pause.bind(this);
        this.resume = this.resume.bind(this)
    }
    componentDidMount () {
        // When we are about to transition away from this page, disconnect
      // from the room, if joined.
      window.addEventListener('beforeunload', this.leaveRoomIfJoined);
      window.addEventListener('blur', this.pause);
      window.addEventListener('focus', this.resume)

      console.log("status", this.props)
      if (this.props.practiceStatus === 'pair_in_room') {
        console.log("Connecting joint practice")
        this.connect(this.props.status)
      }  else {
        //only preview yourself
        console.log("I SHOULD BE LEAVING THE ROOM")
        this.leaveRoomIfJoined();
        const localTracksPromise = this.previewTracks?Promise.resolve(previewTracks) : Video.createLocalTracks()
        localTracksPromise.then(this.loadLocalVideo, err=>console.log);
      
      } 
    }

    componentWillUnmount () {
      this.leaveRoomIfJoined();
    }

    pause () {
      if (this.previewTracks) {
        this.previewTracks.forEach(function(track) {
          track.disable();
        });
      }
    }

    resume () {
      console.log("resume triggered")
      if (this.previewTracks) {
        this.previewTracks.forEach(function(track) {
          track.enable();
        });
      }
    }

    loadLocalVideo (tracks) {
        window.previewTracks =  this.previewTracks = tracks;
        const previewContainer = document.getElementById('local-media');
        if (!previewContainer.querySelector('video')) {
          this.attachTracks(tracks, previewContainer);
        }
      }

    connect (data) {
        console.log("got data", data)
        if (data.room) {
          this.identity = data.id;
          //document.getElementById('videos-container').style.display = 'block';
        
          // Bind button to join Room.
          //document.getElementById('button-join').onclick = function() {
          this.roomName = data.room.name;
          //   if (!roomName) {
          //     alert('Please enter a room name.');
          //     return;
          //   }
        
          console.log("Joining room '" + this.roomName + "'...");
            const connectOptions = {
              name: this.roomName,
            //  logLevel: 'debug'
            };
        
          //   if (previewTracks) {
          //     connectOptions.tracks = previewTracks;
          //   }
        
            // Join the Room with the token from the server and the
            // LocalParticipant's Tracks.
            console.log("connecting to twilio with token", data.authToken)
            Video.connect(data.authToken, connectOptions).then(this.roomJoined, function(error) {
              console.log('Could not connect to Twilio: ' + error.message);
            });
      //   };
        
          // Bind button to leave Room.
          // document.getElementById('button-leave').onclick = function() {
          //   log('Leaving room...');
          //   activeRoom.disconnect();
          // };
          }
      }


    attachTracks(tracks, container) {
        tracks.forEach(function(track) {
          console.log("appending track", track.isEnabled)
          container.appendChild(track.attach());
        });
    }

      attachParticipantTracks(participant, container) {
        var tracks = Array.from(participant.tracks.values());
        this.attachTracks(tracks, container);
      }

      detachTracks(tracks) {
        tracks.forEach(function(track) {
          track.detach().forEach(function(detachedElement) {
            detachedElement.remove();
          });
        });
      }

      detachParticipantTracks(participant) {
        var tracks = Array.from(participant.tracks.values());
        this.detachTracks(tracks);
      }

      attachParticipantTracksCB (participant) {

        console.log("Already in Room: '" + participant.identity + "'");
        const previewContainer = document.getElementById('remote-media');
        this.attachParticipantTracks(participant, previewContainer);
      }
      
      trackAdded (track, participant) {
          console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        console.log(participant.identity + " added track: " + track.kind);
        const previewContainer = document.getElementById('remote-media');
        this.attachTracks([track], previewContainer);
      }

    // When a Participant removes a Track, detach it from the DOM.
     trackRemoved (track, participant) {
        console.log(participant.identity + " removed track: " + track.kind);
        this.detachTracks([track]);
    }

    disconnected (room) {
        console.log('Left');
      if (this.previewTracks) {
        this.previewTracks.forEach(function(track) {
          track.stop();
        });
      }
      this.detachParticipantTracks(room.localParticipant);
      room.participants.forEach(this.detachParticipantTracks);
      this.activeRoom = null;
      //document.getElementById('button-join').style.display = 'inline';
      //document.getElementById('button-leave').style.display = 'none';
    }

    // When a Participant leaves the Room, detach its Tracks.
    participantDisconnected (participant) {
        console.log("Participant '" + participant.identity + "' left the room");
        this.detachParticipantTracks(participant);
    };

      roomJoined(room) {
        window.room = this.activeRoom = room;
      
        console.log("Joined as '" + this.identity + "'");
        //document.getElementById('button-join').style.display = 'none';
        //document.getElementById('button-leave').style.display = 'inline';
      
        // Attach LocalParticipant's Tracks, if not already attached.
        var previewContainer = document.getElementById('local-media');
        if (!previewContainer.querySelector('video')) {
          console.log("=============================================")
          this.attachParticipantTracks(room.localParticipant, previewContainer);
        }
      
        // Attach the Tracks of the Room's Participants.
        room.participants.forEach(this.attachParticipantTracksCB);
      
        // When a Participant joins the Room, log the event.
        room.on('participantConnected', function(participant) {
          console.log("Joining: '" + participant.identity + "'");
        });
      
        // When a Participant adds a Track, attach it to the DOM.
        room.on('trackAdded', this.trackAdded);
      
        // When a Participant removes a Track, detach it from the DOM.
        room.on('trackRemoved', this.trackRemoved);
      
        // When a Participant leaves the Room, detach its Tracks.
        room.on('participantDisconnected', this.participantDisconnected);
      
        // Once the LocalParticipant leaves the room, detach the Tracks
        // of all Participants, including that of the LocalParticipant.
        room.on('disconnected', () => this.disconnected(room));
      }
  
  // Leave Room.
  leaveRoomIfJoined() {
      console.log("Leave room called")
    if (this.activeRoom) {
      this.activeRoom.disconnect();
    }
  }


    render () {
        return (
            <div id="videos-container">
                <div id='local-media'></div>
                <div id='remote-media'></div>
            </div>
        )
    }
}

const mapState = state => ({
  status: state.practice,
  practiceStatus: state.practice.practiceStatus
})

export default withRouter (connect (mapState)(VideoContainer));