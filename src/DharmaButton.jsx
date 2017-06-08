import React from 'react';
import Button from 'react-button';

const styleEnabled = {
  fontSize: '13px',
  letterSpacing: '0.68px',
  padding: '7px 20px 10px 20px',
  margin: '15px 0 0 0',
  textDecoration: 'none',
  width: '100%',
  transition: 'all ease 0.4s',
  background: '#FFE7AB',
  border: 'solid #FFE7AB 2px',
  color: 'black'
}

const styleDisabled = {
  fontSize: '13px',
  letterSpacing: '0.68px',
  padding: '7px 20px 10px 20px',
  margin: '15px 0 0 0',
  textDecoration: 'none',
  width: '100%',
  transition: 'all ease 0.4s',
  background: 'gray',
  border: 'solid gray 2px',
  color: '#bfbfbf'
}

export default class DharmaButton extends React.Component {
  render() {
    return (
      <Button
        theme=''
        style={ this.props.disabled ? styleDisabled : styleEnabled }
        disabled={ this.props.disabled }
        label={ this.props.label }
        onClick={ this.props.onClick } />
    )
  }
}
