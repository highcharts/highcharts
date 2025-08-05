const { dashboardsPaths } = Cypress.env('demoPaths') || [];
const dashboardsDir = '/dashboards/';

describe('Dashboards demos', () => {
    (dashboardsPaths || []).forEach((demoPath) => {
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