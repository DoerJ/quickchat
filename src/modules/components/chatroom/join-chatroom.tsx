import { Button, Snackbar, TextField } from '@material-ui/core';
import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import { RoomModel } from '../../../script-model';
import { Modal } from '../modal';

interface JoinChatroomStates {
  isValidRoomCode: boolean,
  roomCode: string | null,
  openAlertModal: boolean,
  response: any
}

export class JoinChatroomComponent extends React.Component<{}, JoinChatroomStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      isValidRoomCode: true,
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
      // navigate to chatroom
      if (response.CODE === '200') {

      }
      // throw out error
      else {
        // error handler
      }
      self.setState({
        openAlertModal: true,
        response: response
      })
    });
  }

  render() {
    return (
      <div className="content-wrapper">
        <TextField
          id="outlined-search"
          label="Enter the room code"
          type="search"
          autoComplete="current-password"
          variant="outlined"
          value={this.state.roomCode}
          onChange={this.handleRoomCodeInput}
        />
        {
          this.state.isValidRoomCode ? <Button onClick={this.sendJoinRequest}>Join</Button> : <Button disabled>Join</Button>
        }
        <Modal open={this.state.openAlertModal} response={this.state.response} onclose={this.modalOnClose} />
      </div>
    );
  }
}