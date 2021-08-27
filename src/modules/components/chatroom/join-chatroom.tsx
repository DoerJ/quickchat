import { Button, Snackbar, TextField } from '@material-ui/core';
import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { EventService, RoomModel } from '../../../script-model';
import { Modal } from '../modal';
import { MenuItem } from '../../core/menu';
import { Redirect } from 'react-router-dom';

interface JoinChatroomStates {
  roomJoinSuccess: boolean
  isValidRoomCode: boolean,
  chatroomToken: string | null,
  roomCode: string | null,
  openAlertModal: boolean,
  response: any,
}

export class JoinChatroomComponent extends React.Component<{}, JoinChatroomStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      roomJoinSuccess: false,
      isValidRoomCode: true,
      chatroomToken: null,
      roomCode: null,
      openAlertModal: false,
      response: {}
    }
  }

  modalOnClose = (): void => {
    this.setState({openAlertModal: false});
  }

  handleRoomCodeInput = (e: any): void => {
    this.setState({roomCode: e.target.value});
  }

  sendJoinRequest = (): void => {
    var self = this;
    var params = {
      roomCode: self.state.roomCode
    }
    RoomModel.joinExistingRoom(params, (response: any) => {
      var roomToken;
      // navigate to chatroom
      if (response.CODE === '200') {
        roomToken = response.params.roomToken;
        console.log('chatroom token: ', roomToken)
        let roomName = response.params.roomName;
        // generate a menu item and append to room list
        let room: MenuItem = {
          id: roomToken,  
          type: 'component',
          label: roomName,
          route: '/chatroom/' + roomToken
        }
        EventService.newRoomAddedToList.next(room);
      }
      // throw out error
      else {
        // error handler
      }
      self.setState({
        chatroomToken: roomToken || null,
        roomJoinSuccess: !!roomToken,
        openAlertModal: true,
        response: response
      })
    });
  }

  render() {
    return (this.state.roomJoinSuccess ? (
      <Redirect to={{
        pathname: '/chatroom/' + this.state.chatroomToken,
        state: {
          roomToken: this.state.chatroomToken,
          modal: this.state.response
        }
      }} />
    ) : (
      <div className="content-wrapper center-layout">
        <TextField
          id="outlined-search"
          className="enter-room-info-input-wrapper"
          label="Enter the Room Code"
          type="search"
          autoComplete="current-password"
          variant="outlined"
          value={this.state.roomCode}
          onChange={this.handleRoomCodeInput}
        />
        {
          this.state.isValidRoomCode ? <Button className="join-room-btn btn-active" onClick={this.sendJoinRequest}>Join</Button> : <Button disabled>Join</Button>
        }
        <Modal open={this.state.openAlertModal} response={this.state.response} onclose={this.modalOnClose} />
      </div>
    ));
  }
  
}