import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

type ComponentName = 'Title' | 'Legend' | 'Tooltip' | 'XAxis' | 'YAxis' | 'Series';

type ComponentContract = {
    typeSource: string;
    directProps: string[];
    allowOptionsFallback: boolean;
    allOrNothing: boolean;
};

type ContractFile = {
    schemaVersion: number;
    sourcePackage: string;
    sourceVersion: string;
    generatedAt: string;
    notes: string[];
    components: Record<ComponentName, ComponentContract>;
};

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(CURRENT_DIR, '..', '..', '..');
const CONTRACT_PATH = path.resolve(ROOT, 'tools/sample-generator/contracts/react-props.contract.json');
const CANDIDATE_PKG_DIRS = [
    path.resolve(ROOT, 'node_modules/@highcharts/react'),
    path.resolve(ROOT, 'tools/sample-generator/node_modules/@highcharts/react')
];

function fileExists(filePath: string): boolean {
    try {
        fs.accessSync(filePath, fs.constants.R_OK);
        return true;
    } catch {
        return false;
    }
}

function extractTopLevelProps(typeFile: string, typeName: string): string[] {
    const content = fs.readFileSync(typeFile, 'utf8');
    const pattern = new RegExp(
        `export\\s+(?:type|interface)\\s+${typeName}(?:<[^>]+>)?\\s*(?:=)?\\s*\\{`
    );
    const match = content.match(pattern);

    if (!match || typeof match.index !== 'number') {
        throw new Error(`Type ${typeName} not found in ${typeFile}`);
    }

    const start = match.index;
    const markerUsed = match[0];

    let i = start + markerUsed.length;
    let depth = 1;
    const bodyStart = i;

    while (i < content.length && depth > 0) {
        const ch = content[i++];
        if (ch === '{') {
            depth += 1;
        } else if (ch === '}') {
            depth -= 1;
        }
    }

    if (depth !== 0) {
        throw new Error(`Unbalanced braces while parsing ${typeName} from ${typeFile}`);
    }

    const body = content.slice(bodyStart, i - 1);
    const props: string[] = [];

    let lineDepth = 0;
    for (const rawLine of body.split('\n')) {
        const line = rawLine.trim();

        for (const ch of rawLine) {
            if (ch === '{') lineDepth += 1;
            if (ch === '}') lineDepth = Math.max(0, lineDepth - 1);
        }

        if (lineDepth !== 0) {
            continue;
        }

        const match = line.match(/^([A-Za-z_$][\w$]*)\??:/);
        if (match) {
            props.push(match[1]);
        }
    }

    return [...new Set(props)].sort();
}

function main(): void {
    const packageDir = CANDIDATE_PKG_DIRS.find(fileExists);

    if (!packageDir) {
        console.error('Local @highcharts/react package not found.');
        console.error(`Checked directories:\n- ${CANDIDATE_PKG_DIRS.join('\n- ')}`);
        console.error('Install deps first (npm i --include=dev), then rerun this script.');
        process.exit(1);
    }

    const packageJsonPath = path.resolve(packageDir, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')) as { version?: string };

    const titleProps = extractTopLevelProps(path.resolve(packageDir, 'options/Title.d.ts'), 'TitleProps');
    const legendProps = extractTopLevelProps(path.resolve(packageDir, 'options/Legend.d.ts'), 'LegendProps');
    const tooltipProps = extractTopLevelProps(path.resolve(packageDir, 'options/Tooltip.d.ts'), 'TooltipProps');
    const xAxisProps = extractTopLevelProps(path.resolve(packageDir, 'options/XAxis.d.ts'), 'XAxisProps');
    const yAxisProps = extractTopLevelProps(path.resolve(packageDir, 'options/YAxis.d.ts'), 'YAxisProps');
    const seriesProps = [
        'id',
        'index',
        'name',
        'type',
        'className',
        'color',
        'events',
        'data',
        'options'
    ];

    const contract: ContractFile = {
        schemaVersion: 1,
        sourcePackage: '@highcharts/react',
        sourceVersion: pkg.version || 'unknown',
        generatedAt: new Date().toISOString(),
        notes: [
            'Generated from local node_modules @highcharts/react d.ts files.',
            'This file is deterministic test input; do not fetch network data in tests.'
        ],
        components: {
            Title: {
                typeSource: 'options/Title.d.ts#TitleProps',
                directProps: titleProps,
                allowOptionsFallback: false,
                allOrNothing: true
            },
            Legend: {
                typeSource: 'options/Legend.d.ts#LegendProps',
                directProps: legendProps,
                allowOptionsFallback: false,
                allOrNothing: false
            },
            Tooltip: {
                typeSource: 'options/Tooltip.d.ts#TooltipProps',
                directProps: tooltipProps,
                allowOptionsFallback: true,
                allOrNothing: false
            },
            XAxis: {
                typeSource: 'options/XAxis.d.ts#XAxisProps',
                directProps: xAxisProps,
                allowOptionsFallback: true,
                allOrNothing: false
            },
            YAxis: {
                typeSource: 'options/YAxis.d.ts#YAxisProps',
                directProps: yAxisProps,
                allowOptionsFallback: true,
                allOrNothing: false
            },
            Series: {
                typeSource: 'Highcharts.d.ts#SeriesProps',
                directProps: seriesProps,
                allowOptionsFallback: true,
                allOrNothing: false
            }
        }
    };

    fs.writeFileSync(CONTRACT_PATH, `${JSON.stringify(contract, null, 2)}\n`, 'utf8');
    console.log(`Wrote ${CONTRACT_PATH}`);
}

main();
