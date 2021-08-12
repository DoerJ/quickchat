import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import {
  AuthComponent,
  DashboardComponent,
  JoinChatroomComponent,
  CreateChatroomComponent,
  ChatroomComponent
} from '../../script-components';

export default (): any => {
  return (
    <Switch>
      <Route exact path="/" component={AuthComponent} />
      <Route exact path="/auth" component={AuthComponent} />
      <Route exact path="/dashboard" component={DashboardComponent} />
      <Route exact path="/join-chatroom" component={JoinChatroomComponent} />
      <Route exact path="/new-chatroom" component={CreateChatroomComponent} />
      <Route path="/chatroom/:id" component={ChatroomComponent} />
    </Switch>
  );
}