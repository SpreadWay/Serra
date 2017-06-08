import React, { Component } from 'react'
import Config from '../truffle.js'
import Web3 from 'web3'
import DharmaLogo from '../static/dharma_logo_2x.png';
import TermsBox from './TermsBox.jsx';
import Terms from './Terms.jsx';
import SignTerms from './SignTerms.jsx';
import fonts from './styles/fonts.css';
import CSS from './styles/App.css';
import DharmaButton from './DharmaButton.jsx';
import ContractDeploymentModal from './ContractDeploymentModal.jsx';
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      termsSigned: false,
      modalOpen: false
    };

    this.terms =  new Terms(window.location.href);
    this.onTermsSigned = this.onTermsSigned.bind(this);
    this.openDeploymentModal = this.openDeploymentModal.bind(this);
  }

  componentWillMount() {
    this.web3RPC = window.web3;
    this.loanContract = new LoanContract(this.web3RPC);
  }

  onTermsSigned() {
    this.setState({ termsSigned: true, modalOpen: false });
  }

  openDeploymentModal() {
    this.setState({ termsSigned: true, modalOpen: true })
  }

  render() {
    const termsSigned = this.state.termsSigned;
    const modalOpen = this.state.modalOpen;
    const deploymentState = this.state.deploymentState;

    return (
      <div>
        <img style={ logoStyle } src={ DharmaLogo }></img>
        <p style={ textStyle }>Your Loan Terms:</p>
        <TermsBox
          terms={ this.terms } />
        <p style={ disclaimerStyle }>
          By signing below, I agree to pay back the loan principal in
          full in addition to the agreed upon interest as stipulated in
          the terms above.
        </p>
        <SignTerms onSigned={ this.onTermsSigned }/>
        <DharmaButton onClick={ this.openDeploymentModal } disabled= { !termsSigned } label="CONFIRM" />
        <ContractDeploymentModal
            modalOpen={ modalOpen }
            terms={ this.terms }
            loanContract={ this.loanContract }/>
      </div>
    );
  }
}

export default App
