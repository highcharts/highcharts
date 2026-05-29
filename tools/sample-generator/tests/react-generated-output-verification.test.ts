import { describe, it } from 'node:test';
import { ok } from 'node:assert';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const THIS_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(THIS_DIR, '..', '..', '..');

const TARGET_SAMPLES = [
    'highcharts/legend/backgroundcolor',
    'highcharts/legend/bordercolor',
    'highcharts/legend/borderwidth',
    'highcharts/legend/enabled-false'
];

function generateTargetSamples() {
    execSync(
        `npx gulp generate-samples --samples "${TARGET_SAMPLES.join(',')}"`,
        {
            cwd: REPO_ROOT,
            stdio: 'pipe'
        }
    );
}

function readReactDemo(sampleSlug: string): string {
    const demoPath = resolve(
        REPO_ROOT,
        'samples',
        'react',
        'highcharts',
        sampleSlug,
        'demo.jsx'
    );

    return readFileSync(demoPath, 'utf8');
}

describe('react generated output verification (legend samples)', () => {
    it('renders expected extracted components for focused legend samples', () => {
        generateTargetSamples();

        const backgroundColor = readReactDemo('legend-backgroundcolor');
        ok(backgroundColor.includes('<Chart options={chartOptions}>'));
        ok(backgroundColor.includes('<Title>Demo of &lt;em&gt;legend.backgroundColor&lt;/em&gt;</Title>'));
        ok(backgroundColor.includes('<Series data={[1, 3, 2, 4]} />'));
        ok(backgroundColor.includes('<XAxis options={{"categories":["Apples","Bananas","Oranges","Pears"]}} />'));
        ok(backgroundColor.includes('<Legend backgroundColor={"#aaaaaa40"} />'));
        ok(!backgroundColor.includes('\n            title:'));
        ok(!backgroundColor.includes('\n            series:'));
        ok(!backgroundColor.includes('\n            xAxis:'));
        ok(!backgroundColor.includes('\n            legend:'));

        const borderColor = readReactDemo('legend-bordercolor');
        ok(borderColor.includes('<Legend'));
        ok(!borderColor.includes('\n            legend:'));

        const borderWidth = readReactDemo('legend-borderwidth');
        ok(borderWidth.includes('<Legend'));
        ok(!borderWidth.includes('\n            legend:'));

        const enabledFalse = readReactDemo('legend-enabled-false');
        ok(enabledFalse.includes('<Legend'));
        ok(!enabledFalse.includes('\n            legend:'));
    });
});
