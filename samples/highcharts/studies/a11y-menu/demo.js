// Creating patterns for normal and contrast colors
const defaultColors = ['#90D2FE', '#ffb8b8'],
    contrastColors = ['#247eb3', '#dd3636'],
    borderColors = contrastColors,
    borderColorsWithContrast = ['#103042', '#561515'];

// Defining description formats for verbosity
const shortPointDescriptionFormat =
    '{point.category}, {(point.y):,.0f} (1000 MT).';
const fullPointDescriptionFormat =  'Bar {add index 1} of ' +
    '{point.series.points.length} in series {point.category}, ' +
    '{point.series.name}: {(point.y):,.0f} (1000 MT).';

let longDesc = '';
let shortDesc = '';


// Storing preference states globally
let selectedVerbosity = 'full',
    selectedTextSize = 'default',
    isContrastChecked = false,
    isBorderChecked = false,
    isAltPointDescChecked = false,
    isAltPointLabelChecked = false,
    isInfoChecked = false,
    isPatternChecked = false,
    fontSize = '';

function initializeChart() {
    const chart = Highcharts.chart('container', getChartConfig());
    chart.prefMenu = {};
    chart.altTextDivs = [];
    addPrefButton(chart);
    addCustomA11yComponent(chart);
    addPrefButtonScreenReader(chart);

    // Storing descriptions
    const screenReaderDiv = document
        .getElementById('highcharts-screen-reader-region-before-0');
    const innerScreenReaderDiv = screenReaderDiv.children[0];
    longDesc = innerScreenReaderDiv.children[3].textContent;
    shortDesc = longDesc.split('. ')[0] + '.';
    return chart;
}

function getChartConfig() {
    return {
        chart: {
            type: 'column'
        },
        exporting: {
            buttons: {
                contextButton: {
                    menuItems: [
                        'printChart',
                        'downloadPNG',
                        'downloadJPEG',
                        'downloadPDF',
                        'downloadSVG'
                    ]
                }
            }
        },
        accessibility: {
            screenReaderSection: {
                beforeChartFormat: '<h1>{chartTitle}</h1>' +
                '<div>{typeDescription}</div>' +
                '<div>{chartSubtitle}</div>' +
                '<div>{chartLongdesc}</div>' +
                '<div>{playAsSoundButton}</div>' +
                '<div>{viewTableButton}</div>' +
                '<div>{xAxisDescription}</div>' +
                '<div>{yAxisDescription}</div>'
            },
            point: {
                descriptionFormat: fullPointDescriptionFormat
            }
        },
        title: {
            text: 'Corn vs wheat estimated production for 2023'
        },
        subtitle: {
            text:
                'Source: <a target="_blank" ' +
                'href="https://www.indexmundi.com/agriculture/?commodity=corn">indexmundi</a>'
        },
        xAxis: {
            categories: ['USA', 'China', 'Brazil', 'EU', 'Argentina', 'India'],
            crosshair: true,
            accessibility: {
                description: 'Countries'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: '1000 metric tons (MT)'
            }
        },
        tooltip: {
            valueSuffix: ' (1000 MT)',
            stickOnContact: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        colors: defaultColors,
        series: [
            {
                name: 'Corn',
                data: [387749, 280000, 129000, 64300, 54000, 34300]
            },
            {
                name: 'Wheat',
                data: [45321, 140000, 10000, 140500, 19500, 113500]
            }
        ]
    };
}

function addPrefButton(chart) {
    const settingImgSrc = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Cog_wheel_icon.svg/1024px-Cog_wheel_icon.svg.png';
    const fallbackText = '⚙️';

    const buttonGroup = chart.renderer.g()
        .attr({
            id: 'hc-pref-button-group',
            class: 'hc-pref-button',
            cursor: 'pointer',
            role: 'button',
            tabindex: 0,
            'aria-label': 'Preferences'
        })
        .on('click', () => handlePrefButtonClick(chart))
        .add();

    // Add a background rectangle
    chart.renderer
        .rect(710, 3, 32, 32)
        .attr({
            class: 'hc-pref-button-bg',
            rx: 4,
            fill: 'transparent'
        })
        .add(buttonGroup);

    // Add the image on top
    const prefButton = chart.renderer.image(
        settingImgSrc, 715, 7, 24, 24
    )
        .attr({
            id: 'hc-pref-button',
            'aria-hidden': 'false'
        })
        .add(buttonGroup);

    // Add fallback logic
    prefButton.element.onerror = () => {
        prefButton.destroy(); // Remove broken image

        chart.renderer
            .text(fallbackText, 720, 25) // x, y for the text
            .attr({
                class: 'hc-pref-button-text',
                'aria-hidden': 'false'
            })
            .css({
                fontSize: '20px',
                textAnchor: 'middle',
                cursor: 'pointer'
            })
            .add(buttonGroup);
    };

    // Assign button group to chart namespace
    chart.prefMenu.prefButton = buttonGroup;
}

function addPrefButtonScreenReader(chart) {
    const screenReaderDiv =
        document.getElementById('highcharts-screen-reader-region-before-0');
    const screenReaderDivInnerDiv = screenReaderDiv.children[0];
    const tableButton =
        document.getElementById('hc-linkto-highcharts-data-table-0');
    const existingPrefButton =
        screenReaderDivInnerDiv?.querySelector('#hc-pref-button');

    if (!existingPrefButton) {
        const prefButton = document.createElement('button');
        prefButton.textContent = 'Preferences';
        prefButton.id = 'hc-pref-button';
        prefButton.addEventListener('click', () =>
            handlePrefButtonClick(chart)
        );

        // Ensure screenReaderDiv and tableButton exist
        if (screenReaderDiv && tableButton) {
            screenReaderDivInnerDiv.insertBefore(
                prefButton, screenReaderDivInnerDiv.children[4]
            );
        }
    }
}

function handlePrefButtonClick(chart) {
    chart.accessibility.keyboardNavigation.blocked = true;
    const dialog = createPreferencesDialog(chart);
    document.body.appendChild(dialog);
    dialog.showModal();

    trapFocusInDialog(dialog);

    const firstFocusable = dialog.querySelector('button, select');
    if (firstFocusable) {
        firstFocusable.focus();
    }
}

function createPreferencesDialog(chart) {
    const prefContent = document.createElement('dialog');
    prefContent.setAttribute('id', 'pref-menu-dialog');
    const closeID = 'hc-dlg-close-btn' + chart.index;

    prefContent.innerHTML = `
    <button id="${closeID}" class="dlg-close" aria-label="Close dialog">
        Close
    </button>
    <h2>Preferences</h2>
    <p>Customize your chart settings to enhance your experience.</p>
    <h3>Text description:</h3>
    <div class="pref verbosity">
        <input type="radio" id="short" name="verbosity" value="short"
        ${selectedVerbosity === 'short' ? 'checked' : ''}>
        <label for="short">Short</label>
        <input type="radio" id="ver-full" name="verbosity" value="full"
        ${selectedVerbosity === 'full' ? 'checked' : ''}>
        <label for="ver-full">Full</label>
    </div>
    <h3>Visible alt text</h3>
    <div class="pref alt-text">
    <input type="checkbox" id="alt-info" name="alt-info"
        ${isInfoChecked ? 'checked' : ''}>
        <label for="alt-info">Show chart overview</label>
    <input type="checkbox" id="alt-point-label" name="alt-point-label"
        ${isAltPointLabelChecked ? 'checked' : ''}>
        <label for="alt-point-label">Show point labels</label>
    <input type="checkbox" id="alt-points-desc" name="alt-points-desc"
        ${isAltPointDescChecked ? 'checked' : ''}>
        <label for="alt-points-desc">Show point description</label>
    </div>
    <h3>Text size:</h3>
    <div class="pref textsize">
        <input type="radio" id="smaller" name="textsize" value="smaller"
        ${selectedTextSize === 'smaller' ? 'checked' : ''}>
        <label for="smaller">Smaller</label>
        <span aria-hidden="true">(<span id="small-font">Aa</span>)</span>
        <input type="radio" id="t-size-def" name="textsize" value="default"
        ${selectedTextSize === 'default' ? 'checked' : ''}>
        <label for="t-size-def">Default </label>
        <span aria-hidden="true">(<span id="def-font">Aa</span>)</span>
        <input type="radio" id="larger" name="textsize" value="larger"
        ${selectedTextSize === 'larger' ? 'checked' : ''}>
        <label for="larger">Larger </label>
        <span aria-hidden="true">(<span id="large-font">Aa</span>)</span>
    </div>
    <h3>Enhance contrast:</h3>
    <div class="pref contrast">
        <input type="checkbox" id="contrast" name="contrast"
        ${isContrastChecked ? 'checked' : ''}>
        <label for="contrast">Increase contrast</label>
        <input type="checkbox" id="border" name="border"
        ${isBorderChecked ? 'checked' : ''}>
        <label for="border">Add border</label>
        <input type="checkbox" id="pattern" name="pattern"
        ${isPatternChecked ? 'checked' : ''}>
        <label for="pattern">Pattern instead of colors</label>
    </div>
    `;


    setupEventListeners(prefContent, chart);

    const closeButton = prefContent.querySelector(`#${closeID}`);
    closeButton.addEventListener('click', () =>
        closePreferencesDialog(prefContent, chart)
    );
    return prefContent;
}

function setupEventListeners(prefContent, chart) {
    const textSizeRadioButtons =
        prefContent.querySelectorAll('input[name="textsize"]');
    const verbosityRadioButtons =
        prefContent.querySelectorAll('input[name="verbosity"]');
    const contrastCheckbox =
        prefContent.querySelector('input[name="contrast"]');
    const borderCheckbox = prefContent.querySelector('input[name="border"]');
    const patternCheckbox = prefContent.querySelector('input[name="pattern"]');
    const altPointDescCheckbox = prefContent
        .querySelector('input[name="alt-points-desc"]');
    const altPointLabelCheckbox = prefContent
        .querySelector('input[name="alt-point-label"]');
    const altInfoCheckbox = prefContent.querySelector('input[name="alt-info"]');
    const infoRegion = document.querySelector(
        '#highcharts-screen-reader-region-before-0 > div:first-child'
    );
    const description = document
        .getElementsByClassName('highcharts-description')[0];


    textSizeRadioButtons.forEach(radio => {
        radio.addEventListener('change', event => {
            const selectedSize = event.target.value;
            selectedTextSize = selectedSize;

            switch (selectedSize) {
            case 'smaller':
                fontSize = '10px';
                break;
            case 'normal':
                fontSize = '16px';
                break;
            case 'larger':
                fontSize = '22px';
                break;
            default:
                fontSize = '16px';
            }

            // Update chart with font sizes
            chart.update({
                chart: {
                    style: {
                        fontSize: fontSize
                    }
                }
            });

            // Only visible if info region is checked
            infoRegion.style.fontSize = fontSize;
            description.style.fontSize = fontSize;

            // Only visible if alt-text for point is checked
            chart.altTextDivs.forEach(div => {
                div.style.fontSize = fontSize;
            });

            // Append the button to the screen reader region
            setupScreenReaderSection(selectedVerbosity, chart);
        });
    });
    verbosityRadioButtons.forEach(radio => {
        radio.addEventListener('change', event => {
            const verbosity = event.target.value;
            selectedVerbosity = verbosity;

            chart.update({
                accessibility: {
                    point: {
                        descriptionFormat: selectedVerbosity === 'short' ?
                            shortPointDescriptionFormat :
                            fullPointDescriptionFormat
                    }
                }
            });

            setupScreenReaderSection(selectedVerbosity, chart);
        });
    });

    contrastCheckbox.addEventListener('change', event => {
        const isChecked = event.target.checked;
        isContrastChecked = isChecked; // Store state

        updateChartColorLogic(chart);
        // Append button to screen reader region
        setupScreenReaderSection(selectedVerbosity, chart);
    });

    patternCheckbox.addEventListener('change', event => {
        const isChecked = event.target.checked;
        isPatternChecked = isChecked; // Store state
        updateChartColorLogic(chart);
        setupScreenReaderSection(selectedVerbosity, chart);
    });

    borderCheckbox.addEventListener('change', event => {
        const isChecked = event.target.checked;
        isBorderChecked = isChecked; // Store state
        updateChartColorLogic(chart);
        // Append button to screen reader region
        setupScreenReaderSection(selectedVerbosity, chart);
    });

    altPointLabelCheckbox.addEventListener('change', event => {
        const isChecked = event.target.checked;
        isAltPointLabelChecked = isChecked;

        if (isChecked) {
            chart.update({
                series: [{
                    dataLabels: {
                        enabled: true
                    }
                }, {
                    dataLabels: {
                        enabled: true
                    }
                }]
            });
        } else {
            chart.update({
                series: [{
                    dataLabels: {
                        enabled: false
                    }
                }, {
                    dataLabels: {
                        enabled: false
                    }
                }]
            });
        }
        setupScreenReaderSection(selectedVerbosity, chart);

    });

    altPointDescCheckbox.addEventListener('change', event => {
        const isChecked = event.target.checked;
        isAltPointDescChecked = isChecked;

        // Clear existing altTextDivs
        chart.altTextDivs.forEach(div => div.remove());
        chart.altTextDivs = [];

        if (isChecked) {
            const paths = document
                .querySelectorAll('path.highcharts-point[aria-label');
            const chartRect = chart.container.getBoundingClientRect();

            paths.forEach(path => {
                const ariaLabel = path.getAttribute('aria-label');
                const rect = path.getBoundingClientRect();

                // Create and position alt text div
                const altTextDiv = document.createElement('div');
                altTextDiv.textContent = ariaLabel;
                altTextDiv.classList.add('alt-text-div');
                altTextDiv.setAttribute('aria-hidden', 'true');

                // Position label on top of column
                altTextDiv.style.left =
                    `${rect.left + rect.width / 2 - chartRect.left}px`;
                altTextDiv.style.top = `${rect.top - chartRect.top}px`;
                altTextDiv.style.fontSize = fontSize;

                // Add to chart container
                chart.container.appendChild(altTextDiv);

                // Add divs to array for setting text size if applicable
                chart.altTextDivs.push(altTextDiv);

            });

            // Turning of tooltip to avoid duplicate information
            chart.update({
                tooltip: {
                    enabled: false
                }
            });

        } else {
            chart.update({
                tooltip: {
                    enabled: true
                }
            });
        }
        // Append button to screen reader region
        setupScreenReaderSection(selectedVerbosity, chart);
    });

    altInfoCheckbox.addEventListener('change', event => {
        const isChecked = event.target.checked;
        isInfoChecked = isChecked;

        // Refresh screen reader section
        setupScreenReaderSection(selectedVerbosity, chart);
    });
}

function updateChartColorLogic(chart) {
    const seriesOptions = [{
        color: isPatternChecked ? {
            pattern: {
                path: 'M 0 0 L 5 5 M 5 0 L 0 5', // Diagonal stripes
                color: isContrastChecked ? contrastColors[0] : defaultColors[0],
                backgroundColor: isContrastChecked ? contrastColors[0] + '40' :
                    defaultColors[0] + '40',
                width: 6,
                height: 6
            }
        } :
            isContrastChecked ? contrastColors[0] : defaultColors[0],
        borderColor: isBorderChecked ? isContrastChecked ?
            borderColorsWithContrast[0] : borderColors[0] : null,
        borderWidth: isBorderChecked ? 2 : 0
    }, {
        color: isPatternChecked ? {
            pattern: {
                path: 'M 0 3 L 3 0 M 3 6 L 6 3', // Crosshatch
                color: isContrastChecked ? contrastColors[1] : defaultColors[1],
                backgroundColor: isContrastChecked ? contrastColors[1] + '40' :
                    defaultColors[1] + '40',
                width: 6,
                height: 6
            }
        } : isContrastChecked ? contrastColors[1] : defaultColors[1],
        borderColor: isBorderChecked ? isContrastChecked ?
            borderColorsWithContrast[1] : borderColors[1] : null,
        borderWidth: isBorderChecked ? 2 : 0
    }];

    chart.update({
        series: seriesOptions
    });
}

function trapFocusInDialog(dialog) {

    // Trap focus within the dialog
    const focusableElements = dialog.querySelectorAll(
        'button, select, input, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    dialog.addEventListener('keydown', e => {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            } else if (
                !e.shiftKey && document.activeElement === lastFocusable
            ) {
                e.preventDefault();
                firstFocusable.focus();
            }
        } else if (e.key === 'Escape') {
            dialog.close();
        }
    });
}

function closePreferencesDialog(dialog, chart) {
    dialog.close();
    chart.accessibility.keyboardNavigation.blocked = false;
    dialog.remove();
    chart.container.focus();
}

function addCustomA11yComponent(chart) {
    // Create custom component for the chart.
    const CustomComponent = function (chart) {
        this.initBase(chart);
    };
    CustomComponent.prototype = new Highcharts.AccessibilityComponent();

    Highcharts.extend(CustomComponent.prototype, {
        onChartUpdate: updateCustomComponent,
        getKeyboardNavigation: createKeyboardNavigationHandler
    });

    // Update the chart with the new component, also adding it in the keyboard
    // navigation order
    chart.update({
        accessibility: {
            customComponents: {
                customComponent: new CustomComponent(chart)
            },
            keyboardNavigation: {
                order: ['series', 'customComponent', 'chartMenu', 'legend']
            }
        }
    });
}

// Perform tasks to be done when the chart is updated
function updateCustomComponent() {
    // Get our button if it exists, and sest attributes on it
    const namespace = this.chart.prefMenu || {};
    if (namespace.prefButton) {
        namespace.prefButton.attr({
            role: 'button',
            tabindex: -1,
            ariahidden: true
        });
        Highcharts.A11yChartUtilities.unhideChartElementFromAT(
            this.chart, namespace.prefButton.element
        );
    }
}

function setupScreenReaderSection(selectedVerbosity, chart) {
    applyInfoRegion(selectedVerbosity, chart);
}


// TODO: Refactor function to be only about applying info region and rename
function applyInfoRegion(selectedVerbosity, chart) {

    // Add preference button to screen reader section
    addPrefButtonScreenReader(chart);

    const screenReaderDiv = document
        .getElementById('highcharts-screen-reader-region-before-0');
    const innerScreenReaderDiv = screenReaderDiv.children[0];
    const description = innerScreenReaderDiv.children[3];
    const infoRegion = document.querySelector(
        '#highcharts-screen-reader-region-before-0 > div:first-child'
    );
    // Check if info region is already displayed
    if (!infoRegion) {
        return;
    }

    // Toggle visibility based on isInfoChecked
    if (isInfoChecked) {
        infoRegion.classList.add('hide-section');
        infoRegion.style.fontSize = fontSize;
    } else {
        infoRegion.classList.remove('hide-section');
    }

    let globalIndex = 0;

    chart.series.forEach(series => {
        series.points.forEach(point => {
            const pointElement = point.graphic?.element;

            if (!pointElement) {
                return;
            }

            const formattedVal = point.y.toLocaleString('en-US');

            // Generate alt text based on verbosity
            const altText = selectedVerbosity === 'short' ?
                `${point.category}, ${formattedVal} (1000 MT).` :
                `Bar ${point.index + 1} of ${point.series.points.length}
                   in series ${point.category}, ${point.series.name}: 
                   ${point.category}, ${formattedVal} (1000 MT).`;

            // Update corresponding alt text div
            const altTextDiv = chart.altTextDivs[globalIndex];
            if (altTextDiv) {
                altTextDiv.textContent = altText;
            }

            globalIndex++;

        });
    });

    const chartInfoElements = Array.from(innerScreenReaderDiv.children);
    console.log(chartInfoElements);


    if (selectedVerbosity === 'short') {
        description.textContent = shortDesc;

        // Hide specific elements
        chartInfoElements.forEach((el, index) => {
            if (index >= 6) {
                el.style.display = 'none';
            }
        });
    } else if (selectedVerbosity === 'full') {
        // Restore full description
        description.textContent = longDesc;

        // Show all divs
        chartInfoElements.forEach((el, index) => {
            if (index >= 4) {
                el.style.display = 'block';
            }
        });
    }
}

// Define keyboard navigation for this component
function createKeyboardNavigationHandler() {
    const keys = this.keyCodes,
        chart = this.chart,
        namespace = chart.prefMenu || {},
        component = this;

    return new Highcharts.KeyboardNavigationHandler(chart, {
        keyCodeMap: [
            // On arrow/tab we just move to the next chart element.
            // If we had multiple buttons we wanted to group together,
            // we could move between them here.
            [[
                keys.tab, keys.up, keys.down, keys.left, keys.right
            ], function (keyCode, e) {
                return this.response[
                    keyCode === this.tab && e.shiftKey ||
                    keyCode === keys.left || keyCode === keys.up ?
                        'prev' : 'next'
                ];
            }],

            // Space/enter means we click the button
            [[
                keys.space, keys.enter
            ], function () {
                // Fake a click event on the button element
                const buttonElement = namespace.prefButton &&
                        namespace.prefButton.element;
                if (buttonElement) {
                    component.fakeClickEvent(buttonElement);
                }
                return this.response.success;
            }]
        ],

        // Focus button initially
        init() {
            const buttonElement = namespace.prefButton &&
                    namespace.prefButton.element;
            if (buttonElement && buttonElement.focus) {
                buttonElement.focus();
            }
        }
    });
}

// Initialize chart
initializeChart();
