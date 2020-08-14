'use strict';

var expect = require('chai').expect;
var indianCurrencyToWordsConverter = require('../index');

describe('#indianCurrencyToWordsConverter', function() {
  it('should convert two digit numbers', function() {
    var result = indianCurrencyToWordsConverter(21);
    expect(result).to.equal('Twenty One Rupees');
  });

  it('should convert hundreds', function() {
    var result = indianCurrencyToWordsConverter(115);
    expect(result).to.equal('One Hundred Fifteen Rupees');
  });

  it('should convert thousands', function() {
    var result = indianCurrencyToWordsConverter(12677);
    expect(result).to.equal('Twelve Thousand Six Hundred Seventy Seven Rupees');
  });

  it('should convert 1000 correctly', function() {
    var result = indianCurrencyToWordsConverter(1000);
    expect(result).to.equal('One Thousand Rupees');
  });

  it('should convert lakhs', function() {
    var result = indianCurrencyToWordsConverter(567123);
    expect(result).to.equal('Five Lakh Sixty Seven Thousand One Hundred Twenty Three Rupees');
  });
  
  it('should convert 100000 correctly', function() {
    var result = indianCurrencyToWordsConverter(100000);
    expect(result).to.equal('One Lakh Rupees');
  });

  it('should convert crores', function() {
    var result = indianCurrencyToWordsConverter(160567123);
    expect(result).to.equal('Sixteen Crore Five Lakh Sixty Seven Thousand One Hundred Twenty Three Rupees');
  });

  it('should convert 10000000 correctly', function() {
    var result = indianCurrencyToWordsConverter(10000000);
    expect(result).to.equal('One Crore Rupees');
  });

  it('should convert 10000000 correctly', function() {
    var result = indianCurrencyToWordsConverter(10000000);
    expect(result).to.equal('One Crore Rupees');
  });

  it('should convert 10000000000 correctly', function() {
    var result = indianCurrencyToWordsConverter(1000000000);
    expect(result).to.equal('');
  });

  it('should convert 100.12 correctly', function() {
    var result = indianCurrencyToWordsConverter(100.12);
    expect(result).to.equal('Hundred Rupees and Twelve Paisa');
  });

  it('should convert 200.200 correctly', function() {
    var result = indianCurrencyToWordsConverter(200.200);
    expect(result).to.equal('Two Hundred Rupees and Twenty Paisa');
  });

  it('should convert 212.02 correctly', function() {
    var result = indianCurrencyToWordsConverter(212.02);
    expect(result).to.equal('Two Hundred Twelve Rupees and Two Paisa');
  });
});
