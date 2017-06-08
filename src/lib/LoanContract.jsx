const request = require('request');
const Web3 = require('web3');

const CURRENT_LOAN_IMPLEMENTATION =
  '/ipfs/QmYXP4oVAYwZy81uDq1Daf2RbtsqpfT2wRNpyvcaeXD7RH';

const IPFS_GATEWAY = "https://gateway.ipfs.io";

class LoanContract {
  constructor(web3, contractUrl=CURRENT_LOAN_IMPLEMENTATION) {
    this.web3 = web3;
    this.contractUrl = contractUrl;

    this._deploy = this._deploy.bind(this);
  }

  deploy(terms, callback) {
    if (typeof this.web3 === 'undefined') {
      alert("I'm unable to reach the Ethereum network right now.  Make sure \
        you are accessing this page from either the Token or Status Ethereum \
        browsers.");
      return;
    }

    this._pullFromIPFS(this.contractUrl).catch(function(error) {
       alert(error);
    }).then(function(raw) {
       this.contractRaw = JSON.parse(raw);
      return this._gasEstimate(this.web3, this.contractRaw.bytecode);
    }.bind(this)).catch(function(error) {
      alert(error);
    }).then(function(gasEstimate) {
      this.gasEstimate = gasEstimate;
      this._deploy(terms, callback);
    }.bind(this));
  }

  _deploy(terms, callback) {
    const Contract = this.web3.eth.contract(this.contractRaw.abi);
    try {
      Contract.new(terms.attestor,
                   this.web3.toWei(terms.principal, 'ether'),
                   terms.period.value,
                   terms.periodLength,
                   this.web3.toWei(terms.interest,  'ether'),
                   terms.termLength,
                   terms.fundingTimelock,
                   {
                     from: this.web3.defaultAccount,
                     data: this.contractRaw.bytecode,
                     gasPrice: this.web3.toWei(1, 'gwei'),
                     gas: this.gasEstimate*2
                   }, callback);
    } catch (error) {
      alert(error.stack);
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
        alert(error);
      }
    })
  }
}

export default LoanContract;
