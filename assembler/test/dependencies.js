'use strict';
const {
    describe,
    it
} = require('mocha');
const expect = require('chai').expect;
const defaults = require('../src/dependencies.js');

describe('dependencies.js', () => {
    describe('exported properties', () => {
        it('has export default', () => {
            expect(defaults).to.have.property('cleanPath')
                .that.is.a('function');
            expect(defaults).to.have.property('compileFile')
                .that.is.a('function');
            expect(defaults).to.have.property('regexGetCapture')
                .that.is.a('function');
        });
    });
    describe('getExportStatements', () => {
        const getExportStatements = defaults.getExportStatements;
        it('should return default exports', () => {
            expect(getExportStatements(`
        export default Highcharts;
      `)).to.deep.equal(['export default Highcharts']);
            expect(getExportStatements(`
        export default Highcharts
        const a = 1;
      `)).to.deep.equal(['export default Highcharts']);
            expect(getExportStatements(`
        export default Highcharts
      `)).to.deep.equal(['export default Highcharts']);
            expect(getExportStatements('export default Highcharts;'))
                .to.deep.equal(['export default Highcharts']);
        });
    });
    describe('getFileImports', () => {
        const getFileImports = defaults.getFileImports;
        it('returns empty array when input is not a string', () => {
            // eslint-disable-next-line no-undefined
            expect(getFileImports(undefined)).to.deep.equal([]);
        });
        it('returns tuples of path to module, and the variable name', () => {
            const string = `
      import var1 from 'module1'
      var something = var1.something
      import var2 from 'module2'
      // import notImport from 'module3'
      import 'module4'
      /* import notImport from 'module5' */
      /*
      import notImport from 'module6'
      */
      const b = 'import'
      `;
            expect(getFileImports(string)).to.deep.equal([
                ['module1', 'var1'],
                ['module2', 'var2'],
                ['module4', null]
            ]);
        });
    });
    describe('getImportInfo', () => {
        const getImportInfo = defaults.getImportInfo;
        /**
     * Syntax for the `import` statement can be found at:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import
     */
        it('should support importing defaults', () => {
            expect(getImportInfo('import defaultExport from \'module-name\''))
                .to.deep.equal(['module-name', 'defaultExport']);
        });
        it('should support importing for side effects only', () => {
            expect(getImportInfo('import \'module-name\''))
                .to.deep.equal(['module-name', null]);
        });
        it('should support single quotes', () => {
            expect(getImportInfo('import \'module-name\''))
                .to.deep.equal(['module-name', null]);
        });
        it('should support double quotes', () => {
            expect(getImportInfo('import "module-name"'))
                .to.deep.equal(['module-name', null]);
        });
    });

    describe('getModuleName', () => {
        const { getModuleName } = defaults;

        it('should return undefined if no module tags are found', () => {
            // eslint-disable-next-line no-undefined
            expect(getModuleName('')).to.equal(undefined);
        });

        it('should not allow module tags that are not in a block comment', () => {
            // eslint-disable-next-line no-undefined
            expect(getModuleName('// @module myModule ')).to.equal(undefined);
        });

        it('should return the module name', () => {
            expect(getModuleName('/* @module myModule */')).to.equal('myModule');
        });

        it('should return the first valid module name if multiple are provided', () => {
            expect(getModuleName('// @module invalidModule \n/* @module myModule1 */ /* @module myModule2 */'))
                .to.equal('myModule1');
        });

        it('should support block comment spanning multiple lines', () => {
            const content = `
/**
 * @module myModule
 */
`;
            expect(getModuleName(content)).to.equal('myModule');
        });
    });

    describe('getRequires', () => {
        const { getRequires } = defaults;

        it('should return empty array when no requires set in the file', () => {
            const content = `
/**
 * Module without any requires
 */
import lib from 'somelib'
`;
            expect(getRequires(content)).to.deep.equal([]);
        });

        it('should return empty array when content is undefined', () => {
            expect(getRequires()).to.deep.equal([]);
        });

        it('should an array of the module names that is required', () => {
            const content = `
/**
 * Module with some requirements
 * @requires highcharts
 * @requires highcharts/modules/stock
 */
import lib from 'somelib'
`;
            expect(getRequires(content)).to.deep.equal(
                ['highcharts', 'highcharts/modules/stock']
            );
        });

        it('should not include requires tags that are not in a block comment', () => {
            const content = `
/**
 * Module with some requirements
 * @requires highcharts
 */
// @requires highcharts/not-valid
import lib from 'somelib'
`;
            expect(getRequires(content)).to.deep.equal(
                ['highcharts']
            );
        });
    });

    describe('isInsideSingleComment', () => {
        const isInsideSingleComment = defaults.isInsideSingleComment;
        it('should return true if is index is inside a comment', () => {
            expect(isInsideSingleComment('// comment', 0)).to.equal(true);
            expect(isInsideSingleComment('const a = 1 // comment', 0)).to.equal(false);
            const str = `
      // comment 1
      const a = 1 // comment 2
      // comment 3`;
            expect(isInsideSingleComment(str, str.indexOf('comment 1'))).to.equal(true);
            expect(isInsideSingleComment(str, str.indexOf('comment 2'))).to.equal(true);
            expect(isInsideSingleComment(str, str.indexOf('comment 3'))).to.equal(true);
            expect(isInsideSingleComment(str, str.indexOf('const a'))).to.equal(false);
        });
    });
    describe('isInsideBlockComment', () => {
        it('should return true if index is inside a block comment', () => {
            const isInsideBlockComment = defaults.isInsideBlockComment;
            expect(isInsideBlockComment('/**/', 2)).to.equal(true);
            expect(isInsideBlockComment('/**/ ', 4)).to.equal(false);
            expect(isInsideBlockComment('*/', 1)).to.equal(false);
            expect(isInsideBlockComment('/* comment */', 3)).to.equal(true);
            const str1 = `
        /**
         * comment 1
         */
        const a;
      `;
            expect(isInsideBlockComment(str1, str1.indexOf('comment 1'))).to.equal(true);
            expect(isInsideBlockComment(str1, str1.indexOf('const a'))).to.equal(false);
            const str2 = `
        // /* comment 1
        const a
        // */
      `;
            expect(isInsideBlockComment(str2, str2.indexOf('comment 1'))).to.equal(false);
            expect(isInsideBlockComment(str2, str2.indexOf('const a'))).to.equal(false);
            expect(isInsideBlockComment('const a', 2)).to.equal(false);
        });
    });
    describe.skip('isInsideString', () => {
        const isInsideString = defaults.isInsideString;
        it('should return true if inside a string', () => {
            expect(isInsideString('const a = \'string1\'', 11)).to.equal(true);
            expect(isInsideString('const b = "string2"', 11)).to.equal(true);
            expect(isInsideString('const c = \'\nstring3\n\'', 12)).to.equal(true);
            expect(isInsideString('const a = \'string1\'', 3)).to.equal(false);
        });
    });
    describe('isImportStatement', () => {
        const isImportStatement = defaults.isImportStatement;
        it('should return false when input is not a String', () => {
            expect(isImportStatement()).to.equal(false);
        });
        it('should return false when input is // import \'module\'', () => {
            expect(isImportStatement('// import \'module\'')).to.equal(false);
        });
        it('should return false when input is /* import \'module\' */', () => {
            expect(isImportStatement('/* import \'module\' */')).to.equal(false);
        });
        it('should return true when input is import \'module\'', () => {
            expect(isImportStatement('import \'module\'')).to.equal(true);
        });
        it('should return true when input is import a from \'module\'', () => {
            expect(isImportStatement('import a from \'module\'')).to.equal(true);
        });
        it('should return true when input is import { a } from \'module\'', () => {
            expect(isImportStatement('import { a } from \'module\'')).to.equal(true);
        });
    });
    describe('removeStatement', () => {
        const removeStatement = defaults.removeStatement;
        it('should remove semi-colon', () => {
            expect(removeStatement('const a = 1;', 'const a = 1')).to.equal('');
        });
        it('should remove line ending after', () => {
            expect(removeStatement('const a = 1;\n', 'const a = 1')).to.equal('');
        });
        it('should only remove the line ending after', () => {
            expect(removeStatement('\nconst a = 1;\n', 'const a = 1')).to.equal('\n');
        });
        it('should preserve indentation when there is multiple statements on the same line', () => {
            expect(removeStatement('  const a = 1; const b = 2;\n  const c = 3', 'const a = 1'))
                .to.equal('  const b = 2;\n  const c = 3');
            expect(removeStatement('  const a = 1; const b = 2;\n  const c = 3', 'const b = 2'))
                .to.equal('  const a = 1;\n  const c = 3');
        });
        it('should preserve space when removing a statement in the middle', () => {
            expect(removeStatement('const a = 1; const b = 2; const c = 3;', 'const b = 2'))
                .to.equal('const a = 1; const c = 3;');
        });
        it('should remove statements without the need of a semicolon', () => {
            expect(removeStatement('  const a = 1\n  const b = 2', 'const a = 1'))
                .to.equal('  const b = 2');
        });
        it('should remove line ending before when there is none after', () => {
            expect(removeStatement('\nconst a = 1;', 'const a = 1')).to.equal('');
            expect(removeStatement('  const a = 1\n  const b = 2;', 'const b = 2'))
                .to.equal('  const a = 1');
        });
    });
    describe('removeStatements', () => {
        const removeStatements = defaults.removeStatements;
        const str = `
      const a = 1;
      const b = 2; const c = 3;
      const d = 4
      const e = 5`;
        it('should remove given statements', () => {
            expect(removeStatements(str, ['const a = 1'])).to.equal(`
      const b = 2; const c = 3;
      const d = 4
      const e = 5`);
        });
        it('should remove multiple statements', () => {
            expect(removeStatements(str, ['const a = 1', 'const d = 4'])).to.equal(`
      const b = 2; const c = 3;
      const e = 5`);
        });
        it('should return false when str is not a String', () => {
            // eslint-disable-next-line no-undefined
            expect(removeStatements(undefined, ['const a = 1', 'const d = 4'])).to.equal(false);
        });
        it('should return str when statements is not an Array', () => {
            expect(removeStatements(str)).to.equal(str);
        });
    });
});
