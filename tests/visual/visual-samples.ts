import { readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { globSync } from 'glob';
import { getVisualSampleSkipReason } from '../../test/visual-test-samples.js';

type VisualSample = { id: string; path: string };

export function selectVisualSamples(
    root: string,
    { manifest, filter }: { manifest?: string; filter?: string } = {}
): VisualSample[] {
    if (manifest && filter) {
        throw new Error('Use VISUAL_TEST_MANIFEST or VISUAL_TEST_PATH, not both.');
    }

    const samples = new Map<string, VisualSample>();
    const scripts = globSync(
        'samples/{highcharts,stock,maps,gantt}/*/*/demo.{js,ts}',
        { cwd: root, absolute: true, nodir: true }
    ).sort();

    for (const path of scripts) {
        const id = relative(join(root, 'samples'), dirname(path))
            .replace(/\\/g, '/');
        // A generated demo.js and its demo.ts source are one sample.
        if (!samples.has(id)) {
            samples.set(id, { id, path });
        }
    }

    let selected: VisualSample[];
    if (manifest) {
        const ids: unknown = JSON.parse(
            readFileSync(resolve(root, manifest), 'utf8')
        );
        if (
            !Array.isArray(ids) || !ids.length ||
            ids.some((id: unknown) => typeof id !== 'string') ||
            new Set(ids).size !== ids.length
        ) {
            throw new Error('Visual manifest must contain unique sample IDs.');
        }
        selected = (ids as string[]).map(id => {
            const sample = samples.get(id);
            if (!sample) {
                throw new Error(`Visual sample not found: ${id}`);
            }
            const reason = getVisualSampleSkipReason(root, id);
            if (reason) {
                throw new Error(`Karma excludes visual sample ${id}: ${reason}`);
            }
            return sample;
        });
    } else {
        const filters = (filter ?? '').split(/[,;\n]/)
            .map(value => value.trim().replace(/\\/g, '/'))
            .filter(Boolean);
        selected = [...samples.values()].filter(sample =>
            (!filters.length || filters.some(value =>
                sample.path.replace(/\\/g, '/').includes(value)
            )) && !getVisualSampleSkipReason(root, sample.id)
        );
    }

    if (!selected.length) {
        throw new Error('No eligible Karma visual samples selected.');
    }
    return selected;
}
