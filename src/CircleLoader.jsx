import React from 'react';
import Modal from 'react-modal';
import CircleCSS from './styles/CircleLoader.scss';

export default class CircleLoader extends React.Component {
  render() {
    const loadingComplete = this.props.loadingComplete;
    const circleClassName = "circle-loader" +
      (loadingComplete ? ' load-complete' : '');
    const checkmarkStyle = {
      display: loadingComplete ? 'block' : 'none'
    }
    return (
      <div className={ circleClassName }>
        <div style={ checkmarkStyle }className="checkmark draw"></div>
      </div>

    )
  }
}
