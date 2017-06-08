import React from 'react';
import Term from './Term.jsx';
import TermsSummary from './TermsSummary.jsx';
import Shine from '../static/shine.png';

const style = {
  width: '100%',
  background: 'black',
  border: '3px solid #FFE7AB',
  margin: '15px 0',
  padding: '20px',
  boxSizing: 'border-box',
  boxShadow: '0 2px 22px 0 rgba(0,0,0,0.50)',
  position: 'relative'
}

const termsInnerStyle = {
  padding: '10px 20px 0'
}

const shineStyle = {
  position: 'absolute',
  left: 0,
  top: 0
}

export default class TermsBox extends React.Component {
  render() {
    return (
      <div style={ style }>
        <div style={ termsInnerStyle }>
          <Term label="Principal:" value={ this.props.terms.principalStr() } />
          <Term label="Interest:" value={ this.props.terms.interestStr() } />
          <Term label="Term:" value={ this.props.terms.termStr() } />
        </div>
        <hr></hr>
        <TermsSummary
          debtPerPeriod={ this.props.terms.debtPerPeriod() }
          totalDebt={ this.props.terms.totalDebt() }
          periodStr={ this.props.terms.periodStr() } />
        <img style={ shineStyle } src={ Shine }></img>
      </div>
    );
  }
}
