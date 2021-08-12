import React from 'react';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

interface ModalProps {
  open: boolean,
  response: any,
  onclose: Function
}

interface ModalStates {
  openAlertModal: boolean,
  alertModalType: string | null,
  alertModalMessage: string | null
}

function Alert(props: any) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// the modal component constructs alert-modal view based on the response
export class Modal extends React.Component<ModalProps, ModalStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      openAlertModal: false,
      alertModalType: null,
      alertModalMessage: null
    }
  }

  // catch the initial render
  componentDidMount(): void {
    this.updateModalStates();
  }

  // listen to the change of open props and update the internal states with new response 
  componentDidUpdate(prevProps: any): void {
    this.updateModalStates();
  } 

  updateModalStates(): void {
    if (this.props.open) {
      var res = this.props.response;
      this.setState({
        openAlertModal: true,
        alertModalType: res.params.message.type,
        alertModalMessage: res.params.message.text
      });
      // uplifting state change to parent to close modal
      this.props.onclose();
    }
  }

  handleModalClose = (): void => {
    this.setState({openAlertModal: false});
  }

  render() {
    return (
      <div className="modal-container">
        <Snackbar open={this.state.openAlertModal} autoHideDuration={3000} onClose={this.handleModalClose}>
          <Alert onClose={this.handleModalClose} severity={this.state.alertModalType}>{this.state.alertModalMessage}</Alert>
        </Snackbar>
      </div>
    )
  }
}