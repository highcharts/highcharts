import type { Browser, BrowserContext, Page } from '@playwright/test';
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, posix, sep } from 'node:path';
import { PNG } from 'pngjs';

export interface ComparisonResult {
    passed: boolean;
    diffPixels: number;
    candidatePath: string;
    referencePath: string;
    referenceUpdated: boolean;
}

type SnapshotUpdateMode = 'all' | 'changed' | 'missing' | 'none';

type PngInstance = {
    width: number;
    height: number;
    data: Uint8Array;
};

type PngConstructor = {
    new (options: { width: number; height: number }): PngInstance;
    sync: {
        read: (data: Buffer) => PngInstance;
        write: (png: PngInstance) => Buffer;
    };
};

const Png = PNG as unknown as PngConstructor;

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

let renderBrowser: Browser | null = null;
let renderContext: BrowserContext | null = null;
let renderPagePromise: Promise<Page> | null = null;

async function getRenderPage(): Promise<Page> {
    if (renderPagePromise === null) {
        renderPagePromise = (async () => {
            renderBrowser = await chromium.launch({
                headless: true,
                args: [
                    '--enable-gpu',
                    '--ignore-gpu-blocklist',
                    '--enable-zero-copy',
                    '--use-angle=gl',
                    '--use-gl=angle',
                    '--disable-software-rasterizer'
                ]
            });
            renderContext = await renderBrowser.newContext({
                viewport: {
                    width: CANVAS_WIDTH,
                    height: CANVAS_HEIGHT
                },
                deviceScaleFactor: 1
            });
            return renderContext.newPage();
        })();
    }

    return renderPagePromise;
}

function normalizeSamplePath(samplePath: string): string {
    const normalized = samplePath.replace(/\\/g, '/');
    if (normalized.includes('/samples/') || normalized.startsWith('samples/')) {
        return normalized;
    }
    return posix.join(
        process.cwd().split(sep).join('/'),
        'samples',
        normalized
    );
}

function resolveSampleDir(samplePath: string): string {
    const normalized = normalizeSamplePath(samplePath);
    if (/\/demo\.(?:js|mjs|ts)$/u.test(normalized)) {
        return dirname(normalized);
    }
    if (
        normalized.endsWith('/demo.js') ||
        normalized.endsWith('/demo.mjs') ||
        normalized.endsWith('/demo.ts')
    ) {
        return dirname(normalized);
    }
    if (
        normalized.endsWith('demo.js') ||
        normalized.endsWith('demo.mjs') ||
        normalized.endsWith('demo.ts')
    ) {
        return dirname(normalized);
    }
    return normalized;
}

async function renderSvgToPng(
    svgContent: string,
    renderPage?: Page
): Promise<PngInstance> {
    const page = renderPage ?? await getRenderPage();
    const html = `<!DOCTYPE html><html><head><style>
body { margin: 0; background: #fff; }
svg { display: block; }
</style></head><body>${svgContent}</body></html>`;

    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
        if ('ready' in document.fonts) {
            return document.fonts.ready;
        }
        return null;
    });
    await page.evaluate(async () => {
        const images = Array.from(document.querySelectorAll('image'));
        if (!images.length) {
            return;
        }
        await Promise.all(images.map((image) => {
            const href = image.getAttribute('href') ??
                image.getAttribute('xlink:href');
            if (!href) {
                return Promise.resolve();
            }
            return new Promise<void>((resolve) => {
                const loader = new Image();
                loader.onload = () => resolve();
                loader.onerror = () => resolve();
                loader.src = href;
            });
        }));
    });
    await page.evaluate(
        () => new Promise(requestAnimationFrame)
    );
    const buffer = await page.screenshot({
        clip: { x: 0, y: 0, width: CANVAS_WIDTH, height: CANVAS_HEIGHT }
    });

    return Png.sync.read(buffer);
}

function getSampleKey(samplePath: string): string {
    const normalized = normalizeSamplePath(samplePath);
    const samplesIndex = normalized.indexOf('/samples/');
    const trimmed = samplesIndex >= 0 ?
        normalized.slice(samplesIndex + 9) :
        normalized;
    return trimmed.replace(/\/demo\.(js|mjs|ts)$/u, '');
}

function shouldWriteDebug(samplePath: string): boolean {
    if (!process.env.VISUAL_COMPARE_DEBUG) {
        return false;
    }

    const filters = (process.env.VISUAL_COMPARE_DEBUG_SAMPLES ?? '')
        .split(/[,;\n]/)
        .map((value) => value.trim())
        .filter(Boolean);

    if (!filters.length) {
        return true;
    }

    const sampleKey = getSampleKey(samplePath);
    return filters.some((filter) => sampleKey.includes(filter));
}

function writeDebugImages(
    sampleDir: string,
    reference: PngInstance,
    candidate: PngInstance
): void {
    const debugDir = join(sampleDir, 'debug');
    mkdirSync(debugDir, { recursive: true });

    writeFileSync(
        join(debugDir, 'reference.png'),
        Png.sync.write(reference)
    );
    writeFileSync(
        join(debugDir, 'candidate.png'),
        Png.sync.write(candidate)
    );

    const diff = new Png({
        width: reference.width,
        height: reference.height
    });
    const length = Math.min(reference.data.length, candidate.data.length);
    for (let index = 0; index < length; index += 4) {
        const isDifferent =
            reference.data[index] !== candidate.data[index] ||
            reference.data[index + 1] !== candidate.data[index + 1] ||
            reference.data[index + 2] !== candidate.data[index + 2] ||
            reference.data[index + 3] !== candidate.data[index + 3];

        if (isDifferent) {
            diff.data[index] = 255;
            diff.data[index + 1] = 0;
            diff.data[index + 2] = 0;
            diff.data[index + 3] = 255;
        } else {
            diff.data[index] = 0;
            diff.data[index + 1] = 0;
            diff.data[index + 2] = 0;
            diff.data[index + 3] = 0;
        }
    }

    writeFileSync(
        join(debugDir, 'diff.png'),
        Png.sync.write(diff)
    );
}

function countDiffPixels(
    reference: PngInstance,
    candidate: PngInstance
): number {
    if (
        reference.width !== candidate.width ||
        reference.height !== candidate.height
    ) {
        return Math.max(
            reference.width * reference.height,
            candidate.width * candidate.height
        );
    }
    const data1 = reference.data;
    const data2 = candidate.data;
    const length = Math.min(data1.length, data2.length);
    let diff = 0;

    for (let index = 0; index < length; index += 4) {
        if (
            Math.abs(data1[index] - data2[index]) !== 0 ||
            Math.abs(data1[index + 1] - data2[index + 1]) !== 0 ||
            Math.abs(data1[index + 2] - data2[index + 2]) !== 0 ||
            Math.abs(data1[index + 3] - data2[index + 3]) !== 0
        ) {
            diff++;
        }
    }

    return diff;
}

export async function compareSVG(
    samplePath: string,
    svgContent: string,
    options: {
        updateMode?: SnapshotUpdateMode;
        renderPage?: Page;
    } = {}
): Promise<ComparisonResult> {
    const sampleDir = resolveSampleDir(samplePath);
    const candidatePath = join(sampleDir, 'candidate.svg');
    const referencePath = join(sampleDir, 'reference.svg');
    const updateMode = options.updateMode ?? 'none';

    mkdirSync(sampleDir, { recursive: true });

    let referenceSvg: string | null = null;
    try {
        referenceSvg = readFileSync(referencePath, 'utf8');
    } catch {
        referenceSvg = null;
    }

    const hasReference = referenceSvg !== null;
    const shouldUpdateMissingReference =
        !hasReference &&
        updateMode !== 'none';

    if (shouldUpdateMissingReference) {
        writeFileSync(referencePath, svgContent);
        return {
            passed: true,
            diffPixels: 0,
            candidatePath,
            referencePath,
            referenceUpdated: true
        };
    }

    if (!hasReference) {
        writeFileSync(candidatePath, svgContent);
        throw new Error(`Missing reference.svg for ${sampleDir}`);
    }

    if (updateMode === 'all') {
        writeFileSync(referencePath, svgContent);
        return {
            passed: true,
            diffPixels: 0,
            candidatePath,
            referencePath,
            referenceUpdated: true
        };
    }

    writeFileSync(candidatePath, svgContent);
    const currentReferenceSvg = referenceSvg;

    if (currentReferenceSvg === svgContent) {
        return {
            passed: true,
            diffPixels: 0,
            candidatePath,
            referencePath,
            referenceUpdated: false
        };
    }

    if (updateMode === 'changed') {
        writeFileSync(referencePath, svgContent);
        return {
            passed: true,
            diffPixels: 0,
            candidatePath,
            referencePath,
            referenceUpdated: true
        };
    }

    const debugMode = shouldWriteDebug(samplePath);
    if (!debugMode) {
        return {
            passed: false,
            diffPixels: 1,
            candidatePath,
            referencePath,
            referenceUpdated: false
        };
    }

    const referencePng = await renderSvgToPng(
        currentReferenceSvg,
        options.renderPage
    );
    const candidatePng = await renderSvgToPng(svgContent, options.renderPage);

    writeDebugImages(sampleDir, referencePng, candidatePng);

    const diffPixels = countDiffPixels(referencePng, candidatePng);
    const passed = diffPixels === 0;

    return {
        passed,
        diffPixels,
        candidatePath,
        referencePath,
        referenceUpdated: false
    };
}

export async function closeCompareBrowser(): Promise<void> {
    if (renderContext) {
        await renderContext.close();
    }
    if (renderBrowser) {
        await renderBrowser.close();
    }
    renderBrowser = null;
    renderContext = null;
    renderPagePromise = null;
}
