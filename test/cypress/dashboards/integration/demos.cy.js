const dashboardsDir = '/dashboards/';

const excludeList = [
    'gui/layout',
    'components/component-error-handler',
    'basic/google-spreadsheets',
    'demo/personal-portfolio'
];

const demoPaths = Cypress.env('demoPaths');

if (demoPaths && demoPaths.dashboardsPaths) {
    describe('Dashboards demos', () => {
        demoPaths.dashboardsPaths.forEach((demoPath) => {
            it(`Should not have console errors in ${demoPath}`, () => {
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

                cy.visit(dashboardsDir + demoPath);
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
    describe('Dashboards demos', () => {
        it('Should skip - no demoPaths configured', () => {
            cy.log('Skipping - demoPaths not configured');
        });
    });
}