import React, { Component } from 'react';
import { render } from 'react-dom';
import Calculator from './Calculator';

class App extends React.Component {
  render () {
    return <Calculator />;
  }
}

render (
  <App/>,
  document.getElementById('app')
);
