const gridLiteDir = '/grid-lite/';
const gridProDir = '/grid-pro/';
const demoPaths = Cypress.env('demoPaths');

const excludeList = [
    'data/googlesheets-tutorial',
    'demo/personal-portfolio'
];

if (demoPaths && demoPaths.gridLitePaths && demoPaths.gridProPaths) {
    describe('Grid Lite demos', () => {
        demoPaths.gridLitePaths.forEach((demoPath) => {
            it(`should not have console errors in ${demoPath}`, () => {

                if (excludeList.includes(demoPath)) {
                    return;
                }

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
        demoPaths.gridProPaths.forEach((demoPath) => {
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
} else {
    describe('Grid Pro demos', () => {
        it('Should skip - no demoPaths configured', () => {
            cy.log('Skipping - demoPaths not configured');
        });
    });
}