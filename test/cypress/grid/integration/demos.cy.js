const { gridLitePaths, gridProPaths } = Cypress.env('demoPaths') || [];
const gridLiteDir = '/grid-lite/';
const gridProDir = '/grid-pro/';

describe('Grid Lite demos', () => {
    (gridLitePaths || []).forEach((demoPath) => {
        it(`should not have console errors in ${demoPath}`, () => {
            let errorMessages = [];
            cy.on('window:before:load', (win) => {
                cy.stub(win.console, 'error').callsFake((msg) => {
                    errorMessages.push(msg);
                });
                win.onerror = function (msg) {
                    errorMessages.push(msg);
                };
                win.addEventListener('unhandledrejection', (event) => {
                    errorMessages.push(event.reason);
                });
            });
            cy.visit(gridLiteDir + demoPath);
            cy.then(() => {
                expect(
                    errorMessages,
                    `Console errors in ${demoPath}`
                ).to.be.empty;
            });
        });
    });
});

describe('Grid Pro demos', () => {
    (gridProPaths || []).forEach((demoPath) => {
        it(`should not have console errors in ${demoPath}`, () => {
            let errorMessages = [];
            cy.on('window:before:load', (win) => {
                cy.stub(win.console, 'error').callsFake((msg) => {
                    errorMessages.push(msg);
                });
                win.onerror = function (msg) {
                    errorMessages.push(msg);
                };
                win.addEventListener('unhandledrejection', (event) => {
                    errorMessages.push(event.reason);
                });
            });
            cy.visit(gridProDir + demoPath);
            cy.then(() => {
                expect(
                    errorMessages,
                    `Console errors in ${demoPath}`
                ).to.be.empty;
            });
        });
    });
});