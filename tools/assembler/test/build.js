'use strict';
const {
    describe,
    it
} = require('mocha');

const expect = require('chai').expect;
const defaults = require('../src/build.js');

describe('build.js', () => {
    describe('exported properties', () => {
        it('has export default', () => {
            expect(defaults).to.have.property('build')
                .that.is.a('function');
            expect(defaults).to.have.property('buildModules')
                .that.is.a('function');
            expect(defaults).to.have.property('getFilesInFolder')
                .that.is.a('function');
        });
    });
});
