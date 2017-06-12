const request = require('request');
const Web3 = require('web3');
const uuidV4 = require('uuid/v4');

const CURRENT_LOAN_ABI =
  '/ipfs/QmenAvq6MbrLRwDNTSmW9VFgKfwNp2wt4ywG5J4YdmC7fQ';
const ETH_PRICE_API_ENDPOINT =
  'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'

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

    var  _this = this;

    this._pullAbiFromIPFS(this.abiUrl).catch(function(error) {
       callback("Couldn't pull ABI from IPFS", null);
    }).then(function(raw) {
       _this.abi = JSON.parse(raw);
       return _this._pullCurrentETHPriceUSD();
    }).catch(function(error) {
      callback("Couldn't pull price feed", null);
    }).then(function(price) {
        _this.ethPrincipal = terms.principalInETH(price.USD);
        _this.ethInterest = terms.interestInETH(price.USD);
        _this._createLoanRequest(terms, callback);
    });
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
    const contract = this.web3.eth.contract(this.abi).at('0x29bede679f82cfe352795d375d0bfe51ffbb05f1')
    const uuid = this.web3.sha3(uuidV4());
    console.log("UUID is: " + uuid);

    try {
      contract.createLoan(uuid,
                          terms.borrower,
                          terms.attestor,
                          this.web3.toWei(this.ethPrincipal, 'ether'),
                          terms.period.value,
                          terms.periodLength,
                          this.web3.toWei(this.ethInterest, 'ether'),
                          terms.termLength,
                          terms.fundingTimelock,
                          { from: terms.borrower },
                          callback);
    } catch (error) {
      callback("contract error " + error, null);
    }

  }

  _pullAbiFromIPFS(url) {
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

  _pullCurrentETHPriceUSD() {
    return new Promise(function(accept, reject) {
      request(ETH_PRICE_API_ENDPOINT, function(error, response, body) {
        if (error) {
          reject(error);
        } else  {
          accept(JSON.parse(body));
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
