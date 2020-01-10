'use strict';
const {
    describe,
    it
} = require('mocha');
const expect = require('chai').expect;
const defaults = require('../src/process.js');

describe('process.js', () => {
    describe('exported properties', () => {
        it('has export default', () => {
            expect(defaults).to.have.property('getFunction')
                .that.is.a('function');
            expect(defaults).to.have.property('getPalette')
                .that.is.a('function');
            expect(defaults).to.have.property('preProcess')
                .that.is.a('function');
            expect(defaults).to.have.property('printPalette')
                .that.is.a('function');
            expect(defaults).to.have.property('transpile')
                .that.is.a('function');
        });
    });
});
