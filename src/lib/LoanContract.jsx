const request = require('request');
const Web3 = require('web3');
const uuidV4 = require('uuid/v4');

const CURRENT_LOAN_ABI =
  '/ipfs/QmRxgCsyA5ZmkkuEpuLH1kxm6WNLjcBpSB58JdVGg4FXPR';

const IPFS_GATEWAY = "https://gateway.ipfs.io";
const DHARMA_CHATBOT_ROOT = "https://alma.dharma.io";

class LoanContract {
  constructor(web3, abiUrl=CURRENT_LOAN_ABI) {
    this.web3 = web3;
    this.abiUrl = abiUrl;

    this.createLoanRequest = this.createLoanRequest.bind(this);
    this._createLoanRequest = this._createLoanRequest.bind(this);
  }

  createLoanRequest(terms, callback) {
    console.log(terms);
    if (typeof this.web3 === 'undefined') {
      alert("I'm unable to reach the Ethereum network right now.  Make sure \
        you are accessing this page from either the Token or Status Ethereum \
        browsers.");
      return;
    }

    this._pullFromIPFS(this.abiUrl).catch(function(error) {
       alert(error);
    }).then(function(raw) {
       this.abi = JSON.parse(raw);
      this._createLoanRequest(terms, callback);
    }.bind(this));
  }

  generateReceiptMessage(terms, txHash) {
    var url = DHARMA_CHATBOT_ROOT + "/" + terms.tokenId + "/generateReceipt/" + txHash;
    console.log("Requesting " + url);
    request(url,
      function(error, response, body) {
        if (error) {
          console.log(error);
        } else {
          console.log(body);
        }
    })
  }

  _createLoanRequest(terms, callback) {
    const contract = this.web3.eth.contract(this.abi).at('0xfccfc1a5606a42844244610e181e218ac75db0aa')
    const uuid = uuidV4();

    try {
      contract.createLoan(uuid,
                          terms.borrower,
                          terms.attestor,
                          this.web3.toWei(terms.principal, 'ether'),
                          terms.period.value,
                          terms.periodLength,
                          this.web3.toWei(terms.interest, 'ether'),
                          terms.termLength,
                          terms.fundingTimelock,
                          { from: terms.borrower },
                          callback);
    } catch (error) {
      callback("contract error " + error, null);
    }

  }

  _pullFromIPFS(url) {
    return new Promise(function(accept, reject) {
      request(IPFS_GATEWAY + url, function(error, response, body) {
        if (error) {
          reject(error);
        } else {
          accept(body);
        }
      })
    })
  }

  _gasEstimate(web3, bytecode) {
    return new Promise(function(accept, reject) {
      try {
        web3.eth.estimateGas({data: bytecode}, function(error, gas) {
          if (error) {
            reject(error);
          } else {
            accept(gas);
          }
        })
      } catch (error) {
        reject("gas error: " + error.stack);
      }
    })
  }
}

export default LoanContract;
