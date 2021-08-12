import React from 'react';
import { Button, Dialog, DialogTitle, Divider, FormControl, IconButton, InputAdornment, InputBase, Paper, Snackbar, TextField } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import SendIcon from '@material-ui/icons/Send';
import Container from '@material-ui/core/Container';
import MuiAlert from '@material-ui/lab/Alert';
import { Modal } from '../modal';
import { AccountCircle } from '@material-ui/icons';
import { UserModel, ClientSocket, RoomModel } from '../../../script-model';

interface ChatroomStates {
  roomToken: string,
  openNameDialog: boolean,
  openAlertModal: boolean,
  nameOnDialog: string,
  response: any,
  roomDataLoaded: boolean,
  roomMemberList: any[],
  historyMessageList: any[],
  messageToSend: string | null
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
      messageToSend: null
    }
  }

  memberList: any[] = [];
  messageList: any[] = [];

  componentDidMount(): void {
    // validate member name for the room 
    UserModel.retrieveMemberNameForRoom({ token: this.state.roomToken }, (res: any) => {
      console.log('retrieve member name: ', res)
      if (res.CODE === '200') {
        this.setState({ nameOnDialog: res.params.name }, () => {
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
        this.setState({ openNameDialog: false }, () => {
          // broadcast join event
          this.broadcastJoinEvent();
          var promise = new Promise((resolve: Function) => {
            this.initRoomData(resolve);
          })
          promise.then(() => {
            this.registerRoomSocketListeners();
          });
        });    
      }
      else {
        // error handler
      }
    });
  }

  broadcastJoinEvent = (): void => {
    ClientSocket.joinHandler({
      roomToken: this.state.roomToken,
      name: this.state.nameOnDialog,
      callback: this.receivePropsFromSocketEvent
    })
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
      // TODO
      resolve([]);
    });
    return promise;
  }

  // handle socket data sent from server socket
  receivePropsFromSocketEvent = (res: any): void => {
    console.log('receiving data: ', res)
    switch (res.event) {
      case 'join':
        break;
      case 'leave':
        break;
      case 'message':
        this.setState((prevState: ChatroomStates) => {
          return {
            ...prevState,
            historyMessageList: [...prevState.historyMessageList, {
              member: res.data.member,
              message: res.data.text
            }]
          }
        })
        break;
      default: break;
    }
  }

  handleMessageSend = (): void => {
    ClientSocket.roomMessageHandler({
      roomToken: this.state.roomToken,
      member: this.state.nameOnDialog,
      message: this.state.messageToSend,
    });
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
      <div className="content-wrapper">
        <Container maxWidth="xl" style={{height:'100vh', position:'relative'}}>
          <div className="member-list" style={{display:'inline-block', position:'relative', height:'100vh', width:'20%'}}>
            {this.state.roomMemberList.map((name: string) => {
              return (<div>{name}</div>);
            })} 
          </div>
          <div className="chatbox" style={{display:'inline-block', position:'absolute', height:'100%', width:'60%'}}>
            <div className="chatbox-container" style={{height:'90vh'}}>
              {this.state.historyMessageList.map((msgObj: any) => {
                return (<div>{msgObj.member}: {msgObj.message}</div>)
              })}
            </div>
            <div className="chatbox-form-contaienr">
              <Paper component="form" style={{width:'735px', marginLeft:'108px', display:'flex', alignItems:'center'}}>
                <InputBase placeholder="Say something..." inputProps={{ 'aria-label': 'Say something...' }} style={{width:'85%'}} onChange={this.messageOnUpdate} />
                <Divider orientation="vertical" style={{height:'25px'}} />
                <IconButton color="primary" aria-label="directions" onClick={this.handleMessageSend}>
                  <SendIcon />
                </IconButton>
              </Paper>
            </div>
          </div>
        </Container>
        <Modal open={this.state.openAlertModal} response={this.state.response} onclose={this.modalOnClose} />
        <Dialog aria-labelledby="simple-dialog-title" open={this.state.openNameDialog}>
          <FormControl style={{margin:'23px'}}>
            <TextField id="input-with-icon-textfield" label="Give yourself a name"
              onChange={this.nameOnUpdate}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"><AccountCircle /></InputAdornment>
                ),
              }}
            />
            <Button variant="contained" color="primary" style={{width:'100px', marginTop:'10px'}} onClick={this.handleNameSubmit}>Confirm</Button>
          </FormControl>
        </Dialog>
      </div>
    );
  }
}