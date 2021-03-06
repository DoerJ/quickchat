import React from 'react';
import { Button, Dialog, DialogTitle, Divider, FormControl, IconButton, InputAdornment, InputBase, Paper, Snackbar, TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';
import Container from '@material-ui/core/Container';
import MuiAlert from '@material-ui/lab/Alert';
import { Modal } from '../modal';
import { AccountCircle } from '@material-ui/icons';
import { UserModel, ClientSocket, RoomModel, Menu } from '../../../script-model';
import { generateNameCard } from '../../ui/name-card';
import { DateTimeService } from '../../utils/datetime';

interface ChatroomStates {
  roomToken: string,
  openNameDialog: boolean,
  openAlertModal: boolean,
  nameOnDialog: string,
  response: any,
  roomDataLoaded: boolean,
  roomMemberList: any[],
  historyMessageList: any[],
  messageToSend: string | null,
  nameLoaded: boolean
}

export class ChatroomComponent extends React.Component<any, ChatroomStates> {
  constructor(props: any) {
    super(props);
    var pathParams = this.props.match.params;
    var state = this.props.location.state;
    // copy props value to internal state since we don't need to listen to the change of props 
    this.state = {
      roomToken: pathParams.id,
      openNameDialog: false,
      openAlertModal: !!(state?.modal),
      nameOnDialog: '',
      response: state?.modal || {},
      roomDataLoaded: false,
      roomMemberList: [],
      historyMessageList: [],
      messageToSend: '',
      nameLoaded: false
    }
  }

  memberList: any[] = [];
  messageList: any[] = [];

  componentDidMount(): void {
    // validate member name for the room 
    UserModel.retrieveMemberNameForRoom({ token: this.state.roomToken }, (res: any) => {
      if (res.CODE === '200') {
        this.setState({
          nameOnDialog: res.params.name,
          nameLoaded: true
        }, () => {
          // TODO: broadcast on condiiton
          this.broadcastJoinEvent();
          var promise = new Promise((resolve: Function) => {
            this.initRoomData(resolve);
          });
          // register socket listeners 
          promise.then(() => {
            this.registerRoomSocketListeners();
          })
        });
      }
      else {
        // otherwise prompt user to create new memeber name
        this.setState({ openNameDialog: true });
      }
    });
  }


  componentWillUnmount(): void {
    // remove room socket listeners
  }

  registerRoomSocketListeners = (): void => {
    ClientSocket.receiveRoomJoinEvent(this.receivePropsFromSocketEvent);
    ClientSocket.receiveRoomLeaveEvent(this.receivePropsFromSocketEvent);
    ClientSocket.receiveRoomMessageEvent(this.receivePropsFromSocketEvent);
  }

  handleNameSubmit = (): void => {
    UserModel.validateMemberNameForRoom({
      token: this.state.roomToken,
      memberName: this.state.nameOnDialog
    }, (res: any) => {
      if (res.CODE === '200') {
        this.setState({
          openNameDialog: false,
          nameLoaded: true
        }, () => {
          var promise = new Promise((resolve: Function) => {
            this.initRoomData(resolve);
          });
          promise.then(() => {
            this.registerRoomSocketListeners();
            // broadcast join event
            this.broadcastJoinEvent();
          });
        });    
      }
      else {
        // error handler
      }
    });
  }

  broadcastJoinEvent = (): void => {
    // broadcast join event only if it's the first-time join
    if (!Menu.roomsOnList.get(this.state.roomToken)) {
      ClientSocket.roomJoinHandler({
        type: 'join-event',
        roomToken: this.state.roomToken,
        name: this.state.nameOnDialog,
        timestamp: DateTimeService.formatCurrentTimestamp()
      })
      // set the room as visited
      Menu.roomsOnList.set(this.state.roomToken, true);
    }
  }

  // fetch chatroom data
  initRoomData = (resolve: Function): void => {
    var promises: Promise<any>[] = [this.loadRoomMembers(), this.loadRoomHistory()];
    Promise.all(promises).then(([memberList, historyList]) => {
      this.setState({
        roomDataLoaded: true,
        roomMemberList: memberList,
        historyMessageList: historyList
      }, () => {
        resolve();
      });
    });
  }

  loadRoomMembers = (): Promise<any> => {
    var promise = new Promise((resolve: Function) => {
      RoomModel.getRoomMembers({ token: this.state.roomToken }, (res: any) => {
        if (res.CODE === '200') {
          resolve(res.params.members);
        }
      });
    });
    return promise;
  }

  loadRoomHistory = (): Promise<any> => {
    var promise = new Promise((resolve: Function) => {
      RoomModel.getRoomHistory({ token: this.state.roomToken }, (res: any) => {
        if (res.CODE === '200') {
          resolve(res.params.history);
        }
      })
    });
    return promise;
  }

  // handle socket data sent from server socket
  receivePropsFromSocketEvent = (res: any): void => {
    console.log('receiving data: ', res)
    switch (res.event) {
      case 'join':
        this.setState((prevState: ChatroomStates) => {
          return {
            ...prevState,
            historyMessageList: [...prevState.historyMessageList, {
              type: 'join-event',
              member: res.data.member
            }]
          };
        });
        break;
      case 'leave':
        this.setState((prevState: ChatroomStates) => {
          return {
            ...prevState,
            historyMessageList: [...prevState.historyMessageList, {
              type: 'event',
              message: `${res.data.member} has left the room.`
            }]
          };
        });
        break;
      case 'message':
        this.setState((prevState: ChatroomStates) => {
          return {
            ...prevState,
            messageToSend: '',
            historyMessageList: [...prevState.historyMessageList, {
              type: 'message',
              member: res.data.member,
              message: res.data.text
            }]
          };
        });
        break;
      default: break;
    }
  }

  handleMessageSend = (e: any): void => {
    if (this.state.messageToSend) {
      ClientSocket.roomMessageHandler({
        roomToken: this.state.roomToken,
        type: 'message',
        member: this.state.nameOnDialog,
        message: this.state.messageToSend,
      });
    }
  }

  // update name dialog 
  nameOnUpdate = (e: any): void => {
    this.setState({ nameOnDialog: e.target.value });
  }

  // update chat bar
  messageOnUpdate = (e: any): void => {
    this.setState({ messageToSend: e.target.value });
  }

  // close out alert modal
  modalOnClose = (): void => {
    this.setState({ openAlertModal: false });
  }

  render() {
    return (
      <div className="content-wrapper col-layout">                                                                                                                                                                                                         
        <div className="member-list" style={{display:'inline-block', position:'relative', height:'100vh', width:'20%'}}>

          {/* profile */}
          {this.state.nameLoaded && (
            <div className="profile-wrapper">
              {generateNameCard(this.state.nameOnDialog, 'lg')}
              <div className="profile-name">
                <span className="profile-name-label">{this.state.nameOnDialog}</span>
              </div>
            </div>
          )}

          {/* member list */}
          {this.state.roomMemberList.length > 0 && (
            <div className="member-list-wrapper">
              <div className="member-list-title">
                <span className="member-list-title-label">Room members</span>
              </div>
              <div className="member-list-items-wrapper">
                {this.state.roomMemberList.map((name: string) => {
                  return (
                    <div className="room-member-list-item">
                      {generateNameCard(name, 'sm')}
                      <div className="room-member-list-item-info">
                        <span className="room-member-name">{name}</span>
                      </div>
                    </div>
                  );
                })} 
              </div>
            </div>
          )}
        </div>
        <div className="chatbox" style={{display:'inline-block', position:'absolute', height:'100%', width:'60%'}}>
          <div className="chatbox-container" style={{height:'90vh'}}>
            {this.state.historyMessageList.map((msgObj: any) => {
              switch (msgObj.type) {
                case 'message':
                  return (<div>{msgObj.member}: {msgObj.message}</div>);
                case 'join-event':
                  return (<div>{msgObj.member === this.state.nameOnDialog ? 'You have' : msgObj.member + ' has'} joined the room.</div>);
                case 'leave-event':
                  return (<div>{msgObj.member} has left the room.</div>);
                default:
                  return (<div></div>);
              }     
            })}
          </div>
          <div className="chatbox-form-contaienr">
            <Paper component="form" style={{width:'735px', marginLeft:'108px', display:'flex', alignItems:'center'}}>
              <InputBase placeholder="Say something..." inputProps={{ 'aria-label': 'Say something...' }} style={{width:'85%'}} value={this.state.messageToSend} onChange={this.messageOnUpdate} />
              <Divider orientation="vertical" style={{height:'25px'}} />
              <IconButton color="primary" aria-label="directions" onClick={this.handleMessageSend}>
                <SendIcon />
              </IconButton>
            </Paper>
          </div>
        </div>

        {/* modal */}
        <Modal open={this.state.openAlertModal} response={this.state.response} onclose={this.modalOnClose} />
        
        {/* name dialog */}
        <Dialog className="name-dialog-wrapper" aria-labelledby="simple-dialog-title" open={this.state.openNameDialog}>
          <FormControl className="name-dialog">
            <TextField 
              id="input-with-icon-textfield"
              className="name-dialog-textfield" 
              label="Your Name in the Room"
              onChange={this.nameOnUpdate}
              InputProps={{
                startAdornment: (
                  <InputAdornment className="name-dialog-icon-wrapper" position="start"><AccountCircle /></InputAdornment>
                ),
              }}
            />
            <Button color="primary" className="name-dialog-btn" style={{width:'100px', marginTop:'16px'}} onClick={this.handleNameSubmit}>Confirm</Button>
          </FormControl>
        </Dialog>
      </div>
    );
  }
}