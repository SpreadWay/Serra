import React from 'react';
import Modal from 'react-modal';
import CircleLoader from './CircleLoader.jsx';
import DharmaButton from "./DharmaButton.jsx";

const modalStyle = {
  overlay : {
    position          : 'fixed',
    height            : '100%',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(255, 255, 255, 0.50)'
  },
  content : {
    position                   : 'fixed',
    top                        : '100px',
    left                       : '40px',
    right                      : '40px',
    bottom                     : '100px',
    border                     : '1px solid #ccc',
    background                 : 'black',
    overflow                   : 'auto',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '3px',
    outline                    : 'none',
    padding                    : '40px',
    boxShadow                  : '0px 0px 6px 0px rgba(0,0,0,0.75)'
  }
}

const loaderContainerStyle = {
  position: 'relative',
  width: '100%',
  height: '100%'
}

const loaderStyleVisible = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  marginLeft: '-5em',
  marginTop: '-4.5em',
  boxSizing: 'border-box'
}

const messageStyle = {
  transition: 'fade',
  textAlign: 'center',
  lineHeight: '20px',
  fontSize: '14px'
}

const receiptStyle = {
  color: "#8edeff",
  fontSize: '14px',
  lineHeight: '22px',
  position: 'absolute',
  textAlign: 'center',
  bottom: '10px',
  textDecoration: 'none',
  width: '100%'
}

const errorStyle = {
  marginTop: '40px',
  transition: 'fade',
  textAlign: 'center',
  lineHeight: '20px',
  fontSize: '14px'
}

const retryStyleVisible = {
  width: '100%',
  margin: '10px 0',
}

export default class ContractDeploymentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { deploymentState: "broadcasting" }
    this.terms = props.terms;
    this.loanContract = props.loanContract;

    this.contractDeployCallback = this.contractDeployCallback.bind(this);
    this.retryDeploy = this.retryDeploy.bind(this);
  }


  retryDeploy() {
    this.setState({ deploymentState: "broadcasting" });
  }

  deployLoanContract() {
    this.loanContract.deploy(this.terms, this.contractDeployCallback);
  }

  contractDeployCallback(error, contract) {
    if (error) {
      console.log(error);
      this.setState({ deploymentState: "error", error: error });
    } else {
      this.setState({ deploymentState: 'confirmed' });
      // Due to bug in iOS Token implementation, second callback never fires
      // for contract deployments

    //   if (!contract.address) {
    //     console.log("TX Hash: " + contract.txHash);
    //     this.setState({ deploymentState: 'confirming', txHash: contract.transactionHash });
    //   } else {
    //     console.log("Contract Address: " + contract.address);
    //     this.setState({ deploymentState: 'confirmed' });
    //   }
    // }
    }
  }

  getMessage(deploymentState) {
    console.log("Current state: " + deploymentState)
    switch (deploymentState) {
      case 'broadcasting':
        return "Broadcasting Loan Request";
      case 'confirming':
        return "Awaiting Confirmation: " + this.state.txHash;
      case 'confirmed':
        return "Loan Request Successfuly Broadcasted";
      case 'error':
        return "Something went wrong.  Please check your network connection \
          and try again.: " + this.state.error;
    }
  }

  render() {
    const message = this.getMessage(this.state.deploymentState)

    if (this.state.deploymentState == 'broadcasting' && this.props.modalOpen) {
      this.deployLoanContract();
    }

    const error = this.state.deploymentState == 'error';

    const loaderStyle = error ? { display: 'none' } : loaderStyleVisible;
    const retryStyle = error ? retryStyleVisible : { display: 'none' };

    // const retryButtonStyle = error ? retryButtonStyleVisible : { display: 'none' };
    return (
      <Modal
        isOpen={ this.props.modalOpen }
        style={ modalStyle }>
        <div style={ loaderContainerStyle }>
          <p style={ messageStyle }>{ message }</p>
          <div style={ loaderStyle }>
            <CircleLoader loadingComplete={ this.state.deploymentState == 'confirmed' }/>
          </div>
          <DharmaButton style={ retryStyle } onClick={ this.retryDeploy } label="TRY AGAIN" />
        </div>
      </Modal>
    )
  }
}
