import React from 'react';
import { render } from 'react-dom';

export class DashboardComponent extends React.Component {
  constructor(props: any) {
    super(props);
  }

  render(): any {
    return (<div className="content-wrapper center-layout">Dashboard component</div>);
  }
}