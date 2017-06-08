const parse = require('url-parse');
const currency = require('currency-formatter');

const periodTypes = {
  'Daily': {
    value: 0,
    unit: 'Day'
  },
  'Weekly': {
    value: 1,
    unit: 'Week'
  },
  'Monthly': {
    value: 2,
    unit: 'Month'
  },
  'Year': {
    value: 3,
    unit: 'Year'
  }
}

class Terms {
  constructor(queryString) {
    this.borrower = '0xd721fac5ffc9cc5b7324df740673c4c2c2ccd09a';
    this.attestor = '0xa373f68a65df45a9ca041885c2e07d143f07b5d2';
    this.principal = 100;
    this.interest = 1;
    this.period = periodTypes['Monthly'];
    this.periodLength = 2;
    this.termLength = 2;
    this.fundingTimelock = 10000000000;
    // const parsed = parse(queryString, location, true);
    // this.borrower = parsed.query.borrower;
    // this.attestor = parsed.query.attestor;
    // this.principal = Number(parsed.query.principal);
    // this.interest = Number(parsed.query.interest);
    // this.period = periodTypes[parsed.query.periodType];
    // this.periodLength = Number(parsed.query.periodLength);
    // this.termLength = Number(parsed.query.termLength);
    // this.fundingTimelock = Number(parsed.query.fundingTimelock);
  }

  principalStr () {
    return currency.format(this.principal, { code: 'USD' });
  }

  interestStr () {
    return currency.format(this.interest, { code: 'USD' });
  }

  termStr() {
    const numTimeUnits = this.periodLength*this.termLength;
    let termStr = numTimeUnits + " " + this.period.unit;
    if (numTimeUnits > 1) {
      termStr += 's';
    }
    return termStr;
  }

  debtPerPeriod() {
    return currency.format((this.principal + this.interest) / this.termLength,
        { code: 'USD' });
  }

  totalDebt() {
    return currency.format(this.principal + this.interest, { code: 'USD' })
  }

  periodStr() {
    if (this.periodLength > 1) {
      return "Every " + this.periodLength + " " + this.period.unit + "s";
    } else {
      return "Per " + this.period.unit;
    }
  }
}

export default Terms;
