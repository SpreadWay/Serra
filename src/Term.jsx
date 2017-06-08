import React from 'react';

const termContainerStyle = {
  width: '100%',
  clear: 'both',
  minHeight: '30px'
}

const labelStyle = {
  fontSize: '16px',
  float: 'left'
}

const valueStyle = {
  fontSize: '16px',
  color: '#FFE7AB',
  float: 'right'
}

export default class Term extends React.Component {
  render() {
    return (
      <div style={ termContainerStyle }>
        <span style={ labelStyle }>{ this.props.label }</span>
        <span style={ valueStyle }>{ this.props.value }</span>
      </div>
    );
  }
}
