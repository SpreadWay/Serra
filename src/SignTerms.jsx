import React from 'react';
import SignaturePad from 'react-signature-pad';
import SignaturePadCSS from './styles/SignaturePad.css';

const signaturePadContainer = {
  position: 'relative'
}

const signatureLineStyle = {
  color: 'black',
  position: 'absolute',
  bottom: '10px',
  width: '90%',
  left: 0,
  right: 0,
  margin: 'auto'
}

const xStyle = {
  position: 'absolute',
  fontWeight: 100,
  color: '#9e9e9e',
  bottom: '15px',
  left: '15px'
}
export default class SignTerms extends React.Component {
  render() {
    return (
      <div style={ signaturePadContainer }>
        <SignaturePad onEnd={ this.props.onSigned } />
        <span style={ xStyle }>x</span>
        <hr style={ signatureLineStyle }></hr>
      </div>
    )
  }
}
