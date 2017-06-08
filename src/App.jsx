import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import Config from '../truffle.js'
import Web3 from 'web3'

import DharmaLogo from '../static/dharma_logo_2x.png';
import TermsBox from './TermsBox.jsx';
import Terms from './Terms.jsx';
import SignTerms from './SignTerms.jsx';
import CSS from './styles/App.css';
import DharmaButton from './DharmaButton.jsx';
import LoanContract from './lib/LoanContract.jsx';


const logoStyle = {
  display: 'block',
  margin: '0 auto 20px',
  width: '58px',
  height: '56px'
}

const textStyle = {
  fontSize: '20px',
  textAlign: 'center',
  margin: '0 0 20px'
}

const disclaimerStyle =  {
  fontSize: '18px',
  fontWeight: 100,
  margin: '25px 0',
  lineHeight: '23px',
  textAlign: 'center'
}

const cancelLink = {
  fontSize: "13px",
  color: "white",
  textAlign: "center",
  margin: "15px auto"
}

const terms = new Terms(window.location.href);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { termsSigned: false, message: "asdf" };

    this.onTermsSigned = this.onTermsSigned.bind(this);
    this.deployLoanContract = this.deployLoanContract.bind(this);
    this.updateMessage = this.updateMessage.bind(this);
  }

  componentWillMount() {
    this.web3RPC = window.web3;
  }

  onTermsSigned() {
    this.setState({ termsSigned: true, message: "ready to go" });
  }

  updateMessage(message) {
    this.setState({ termsSigned: true, message: message})
  }

  deployLoanContract() {
    const loanContract = new LoanContract(this.web3RPC);
    loanContract.deploy(terms, function(error, contract) {
      if (error) {
        alert("Error: " + error);
      } else {
        if (!contract.address) {
          alert("TX Hash: " + contract.transactionHash);
        } else {
          alert("Contract Address: " + contract.address);
        }
      }
    });
  }

  render() {
    const termsSigned = this.state.termsSigned;
    const message = this.state.message;

    return (
      <div>
        <img style={ logoStyle } src={ DharmaLogo }></img>
        <p style={ textStyle }>Your Loan Terms:</p>
        <TermsBox
          principal={ terms.principalStr() }
          interest={ terms.interestStr() }
          term={ terms.termStr() }
          debtPerPeriod={ terms.debtPerPeriod() }
          totalDebt={ terms.totalDebt() }
          periodStr={ terms.periodStr() } />
        <p style={ disclaimerStyle }>
          By signing below, I agree to pay back the loan principal in
          full in addition to the agreed upon interest as stipulated in
          the terms above.
        </p>
        <SignTerms onSigned={ this.onTermsSigned }/>
        <DharmaButton onClick={ this.deployLoanContract } disabled= { !termsSigned } label="CONFIRM" />
        <div style={ cancelLink }>
          <a>CANCEL</a>
        </div>
        <p style={ disclaimerStyle }>{ message }</p>

      </div>
    );
  }
}

export default App
