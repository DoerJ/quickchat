import { Button, Snackbar, TextField } from '@material-ui/core';
import React, { SyntheticEvent } from 'react';
import { debounce } from '../../utils/debounce';
import { RoomModel } from '../../../script-model';
import MuiAlert from '@material-ui/lab/Alert';
import { MenuItem } from '../../core/menu';
import { EventService } from '../../core/event';
import { Redirect } from 'react-router-dom';
import { Modal } from '../modal';
 
interface CreateChatroomStates {
  chatroomToken: string | null,
  isValidChatroomName: boolean,
  chatroomName: string,
  roomCreateSuccess: boolean,
  openAlertModal: boolean,
  response: any
}

export class CreateChatroomComponent extends React.Component<{}, CreateChatroomStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      chatroomToken: null,
      isValidChatroomName: true,
      chatroomName: '',
      roomCreateSuccess: false,
      openAlertModal: false,
      response: {}
    }
  }

  modalOnClose = (): void => {
    this.setState({ openAlertModal: false });
  }

  handleChatroomNameInput = (e: any): void => {
    this.setState({ chatroomName: e.target.value })
  }

  createNewChatroom = (): void => {
    var self = this;
    let params = {
      chatroomName: this.state.chatroomName
    }
    RoomModel.createNewRoom(params, (response: any) => {
      var roomToken;
      if (response.CODE === '200') {
        roomToken = response.params.roomToken;
        // generate a menu item and append to room list
        let room: MenuItem = {
          id: roomToken,
          type: 'component',
          label: self.state.chatroomName,
          route: '/chatroom/' + roomToken,
          icon: 'group'
        }
        EventService.newRoomAddedToList.next(room);
      }
      self.setState({
        chatroomToken: roomToken || null,
        roomCreateSuccess: !!roomToken,
        openAlertModal: true,
        response: response
      });
    });
  }

  render() { 
    return (this.state.roomCreateSuccess ? (
      <Redirect to={{
        pathname: '/chatroom/' + this.state.chatroomToken,
        state: {
          roomToken: this.state.chatroomToken,
          modal: this.state.response
        }
      }} />
    ) : (
      <div className="content-wrapper center-layout">
        <TextField id="outlined-basic" className="enter-room-info-input-wrapper" label="Room Name" variant="outlined" onChange={this.handleChatroomNameInput} />
        {this.state.isValidChatroomName ? (<Button className="create-room-btn btn-active" onClick={this.createNewChatroom}>Create</Button>) : (<Button disabled>Create</Button>)}
        <Modal open={this.state.openAlertModal} response={this.state.response} onclose={this.modalOnClose}/>
      </div>
    ));
  }
}