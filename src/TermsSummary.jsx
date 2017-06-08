import React from 'react';

const smallTextStyle = {
  fontSize: '14px',
  textAlign: 'center',
  color: '#8E8E8E',
  margin: '15px 0'
}

const summaryItemStyle = {
  textAlign: 'center',
  margin: '10px'
}

const valueStyle = {
  fontWeight: 500,
  margin: '5px'
}

const labelStyle = {
  fontWeight: 100
}

export default class TermsSummary extends React.Component {
  render() {
    return (
      <div>
        <p style={ smallTextStyle }>You'll Owe</p>
        <div style={ summaryItemStyle }>
          <span style={ valueStyle }>{ this.props.debtPerPeriod }</span>
          <span style={ labelStyle }>{ this.props.periodStr }</span>
        </div>
        <div style={ summaryItemStyle }>
          <span style={ valueStyle }>{ this.props.totalDebt }</span>
          <span style={ labelStyle }>Total</span>
        </div>
      </div>
    );
  }
}
