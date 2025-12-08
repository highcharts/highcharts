const gridLiteDir = '/grid-lite/';
const gridProDir = '/grid-pro/';
const demoPaths = Cypress.env('demoPaths');

const expectedBodyStylesRegex = /body\s*\{[^}]*font-family:\s*-apple-system,\s*BlinkMacSystemFont,\s*"Segoe UI",\s*Roboto,\s*Helvetica,\s*Arial,\s*"Apple Color Emoji",\s*"Segoe UI Emoji",\s*"Segoe UI Symbol",\s*sans-serif[^}]*background:\s*var\(--highcharts-background-color\)[^}]*color:\s*var\(--highcharts-neutral-color-100\)/;
const expectedDemoStylesRegex = /\.demo[^{]*\{[^}]*padding:\s*8px\s+12px\s*[;}]/;
const expectedDescriptionStylesRegex = /\.highcharts-description[^{]*\{[^}]*padding:\s*0\s+8px\s*[;}]/;

const validateStyles = (cssPath) => {
    it('should contain proper body styles', () => {
        cy.readFile(cssPath).then((cssContent) => {
            expect(cssContent).to.match(expectedBodyStylesRegex);
        });
    });

    it('should contain proper .demo styles', () => {
        cy.readFile(cssPath).then((cssContent) => {
            expect(cssContent).to.match(expectedDemoStylesRegex);
        });
    });

    it('should contain proper .highcharts-description styles', () => {
        cy.readFile(cssPath).then((cssContent) => {
            expect(cssContent).to.match(expectedDescriptionStylesRegex);
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
                        errorMessages.filter(s => !s.includes('ResizeObserver')),
                        `Console errors in ${demoPath}`
                    ).to.be.empty;
                });
            });

            // Only validate styles for the samples under the demo directory.
            if (demoPath.startsWith('demo/')) {
                describe(demoPath, () => {
                    validateStyles(
                        'samples' + gridLiteDir + demoPath + '/demo.css'
                    );
                });
            }
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
                        errorMessages.filter(s => !s.includes('ResizeObserver')),
                        `Console errors in ${demoPath}`
                    ).to.be.empty;
                });
            });

            // Only validate styles for the samples under the demo directory.
            if (demoPath.startsWith('demo/')) {
                describe(demoPath, () => {
                    validateStyles(
                        'samples' + gridProDir + demoPath + '/demo.css'
                    );
                });
            }
        });
    });
} else {
    describe('Grid Pro demos', () => {
        it('Should skip - no demoPaths configured', () => {
            cy.log('Skipping - demoPaths not configured');
        });
    });
}
