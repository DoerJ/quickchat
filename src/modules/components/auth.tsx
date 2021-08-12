import React from 'react';
import { render } from 'react-dom';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Button, Link } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { Session } from '../utils/session';
import { ClientSocket } from '../../script-model';

const BASE_URL = 'http://localhost:8443';

interface AuthStates {
  redirectAuthUser: boolean
}

export class AuthComponent extends React.Component<{}, AuthStates> {
  constructor(props: any) {
    super(props);
    this.state = {
      redirectAuthUser: false
    };
  }

  componentDidMount(): void {
    // parse url to determine whether the user has been authenticated 
    var callback = (token: string): void => {
      // store auth token to the current session 
      Session.setMultipleSessionItems({
        'user_type': 'ot',
        'auth_token': token
      });
      // initialize client socket connection 
      ClientSocket.initClientSocketConnection();
      // redirect authenticated user to dashboard 
      this.setState({redirectAuthUser: true});
    }
    this.verifyAuthToken(callback)
  }

  verifyAuthToken(cb: Function) {
    var auth = window.location.pathname;
    // if the user hasn't been authenticated yet
    if (auth === '/') return;
    else  {
      let auth_token = auth.split('/')[1];
      let token = auth_token.split('=')[1];
      // validate token sent from server to avoid possibility of cross-site injection
      if (/^[a-zA-Z0-9]*$/.test(token)) {
        cb(token);
      }
      else return;
    }
  }

  render(): any {
    if (this.state.redirectAuthUser) {
      return (<Redirect to='/dashboard' />)
    }
    else {
      return (
        <div>
          <form className="form-group" method="POST" action={BASE_URL + "/auth/login"}>
            <div id="auth-userid">
              <Grid container spacing={1} alignItems="flex-end">
                <Grid item>
                  <AccountCircle />
                </Grid>
                <Grid item>
                  <TextField type="text" id="userid" label="User ID" />
                </Grid>
              </Grid>
            </div>
            <div id="auth-pwd">
              <Grid container spacing={1} alignItems="flex-end">
                <Grid item>
                  <AccountCircle />
                </Grid>
                <Grid item>
                  <TextField type="password" id="userpwd" label="User Password" />
                </Grid>
              </Grid>
            </div>
            <Button type="submit" color="primary">Log In</Button>
          </form>
          <Link href={BASE_URL + "/auth/guest"} id="guest-auth-entry"><small>Continue as guest</small></Link>
        </div>
      );
    }
  }
}