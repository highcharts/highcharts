'use strict';
const {
    describe,
    it
} = require('mocha');
const expect = require('chai').expect;
const main = require('../index.js');

require('./build.js');
require('./defaultOptions.js');
require('./dependencies.js');
require('./process.js');
// require('./utilities.js');

describe('index.js', () => {
    it('has a primary entry point', () => {
        expect(main).to.be.a('function');
        expect(main.name).to.equal('build');
    });
});
