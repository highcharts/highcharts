const { dashboardsPaths } = Cypress.env('demoPaths') || [];
const dashboardsDir = '/dashboards/';

const excludeList = [
    'gui/layout',
    'components/component-error-handler',
    'basic/google-spreadsheets',
    'data/googlesheets-tutorial'
];

describe('Dashboards demos', () => {
    it('No dashboardsPaths defined', () => {
        assert.ok(dashboardsPaths === void 0);
    });

    (dashboardsPaths || []).forEach((demoPath) => {
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