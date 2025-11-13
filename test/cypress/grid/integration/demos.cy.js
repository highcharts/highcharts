const gridLiteDir = '/grid-lite/';
const gridProDir = '/grid-pro/';
const demoPaths = Cypress.env('demoPaths');

const expectedBodyStyles = `body {
    font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Helvetica,
        Arial,
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        sans-serif;
    background: var(--highcharts-background-color);
    color: var(--highcharts-neutral-color-100);
}`;

const expectedDemoStyles = `.demo {
    padding: 8px 12px;
}`;

const expectedDescriptionStyles = `.highcharts-description {
    padding: 0 8px;
}`;

const validateStyles = (cssPath) => {
    it('should contain proper body styles', () => {
        cy.readFile(cssPath).then((cssContent) => {
            expect(cssContent).to.include(expectedBodyStyles);
        });
    });

    it('should contain proper .demo styles', () => {
        cy.readFile(cssPath).then((cssContent) => {
            expect(cssContent).to.include(expectedDemoStyles);
        });
    });

    it('should contain proper .highcharts-description styles', () => {
        cy.readFile(cssPath).then((cssContent) => {
            expect(cssContent).to.include(expectedDescriptionStyles);
        });
    });
};

if (demoPaths && demoPaths.gridLitePaths && demoPaths.gridProPaths) {
    describe('Grid Lite demos', () => {
        demoPaths.gridLitePaths.forEach((demoPath) => {
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

            describe(demoPath, () => {
                validateStyles(gridLiteDir + 'demo/' + demoPath + '/demo.css');
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

            describe(demoPath, () => {
                validateStyles(gridProDir + 'demo/' + demoPath + '/demo.css');
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