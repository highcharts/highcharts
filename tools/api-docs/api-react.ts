/* *
 *
 *  Generating API documentation for the @highcharts/react package.
 *
 *  Reads the integration's `.d.ts` files and writes a `tree-react.json`. The
 *  integration is generated from the Highcharts source by the
 *  hc-integration-gen repo, and the tree is consumed by the API docs backend
 *  (hc-apidoc-backend), whose React sync task runs this tool with its own
 *  `--source` and `--out` paths.
 *
 *  Usage:
 *  npx ts-node tools/api-docs/api-react.ts [--source <path>] [--out <path>]
 *
 *  --source  Path to the @highcharts/react package, i.e. hc-integration-gen's
 *            generated output (default: node_modules/@highcharts/react).
 *  --out     Path to write the generated tree to
 *            (default: tree-react.json in the current directory).
 *
 *  (c) Highsoft AS
 *
 *  Authors:
 *  - Kamil Kubik
 *
 * */


/* *
 *
 *  Imports
 *
 * */


import { execSync } from 'node:child_process';
import FS from 'node:fs/promises';
import FSSync from 'node:fs';
import Path from 'node:path';
import Process from 'node:process';
import markdownit from 'markdown-it';
import * as TSCompiler from 'typescript';
import Yargs from 'yargs';


const md = markdownit();


/* *
 *
 *  Types
 *
 * */


interface PropEntry {
    name: string;
    type: string;
    description: string;
    // Options path the prop points to (`options/legend`); the backend reads
    // the prop's content from there.
    crossref?: string;
}


interface ComponentDoc {
    name: string;
    category: string;
    // JSDoc of the component, tags included.
    description: string;
    props: PropEntry[];
    // Source `.d.ts` path emitted as the node's `meta.file`.
    sourceFile: string;
    // Options path the whole component points to. Only chart elements,
    // modules, and PlotOptions use this.
    crossref?: string;
    // Highcharts modules the component loads, e.g. `modules/exporting`.
    modules?: string[];
}


interface CategoryDef {
    name: string;
    // HTML, rendered as is by the API docs.
    description: string;
}


/* *
 *
 *  Constants
 *
 * */


// One entry file per product. Highcharts' is read in full; the others only add
// their chart and generic series components.
const ENTRY_FILES = ['Highcharts.d.ts', 'Stock.d.ts', 'Maps.d.ts', 'Gantt.d.ts'];

// Charts are ordered by product, the order users expect.
const CHART_ORDER = ['Chart', 'StockChart', 'MapsChart', 'GanttChart'];

const SHARED_DIRS: Array<{ dir: string; category: string }> = [
    { dir: 'series',     category: 'Series types'         },
    { dir: 'indicators', category: 'Technical indicators' },
    { dir: 'modules',    category: 'Modules'              },
    { dir: 'options',    category: 'Chart elements'       }
];

// The five top-level sidebar categories, in order. `name` must match the
// category names used during extraction.
const CATEGORIES: CategoryDef[] = [
    {
        name: 'Charts',
        description: 'Top-level chart constructors. Every Highcharts ' +
            'React component tree starts with one of these — ' +
            '<code>&lt;Chart&gt;</code>, <code>&lt;StockChart&gt;</code>, ' +
            '<code>&lt;MapsChart&gt;</code>, or ' +
            '<code>&lt;GanttChart&gt;</code>.'
    },
    {
        name: 'Series types',
        description: 'Type-specific series components — Line, Column, ' +
            'Pie, AreaSpline, and more. Used as children of ' +
            '<code>&lt;Chart&gt;</code>.'
    },
    {
        name: 'Chart elements',
        description: 'Declarative components for chart configuration: ' +
            'Title, Tooltip, XAxis, YAxis, and more.'
    },
    {
        name: 'Modules',
        description: 'Optional feature modules that enable additional ' +
            'behaviour (Accessibility, Exporting, Data, …).'
    },
    {
        name: 'Technical indicators',
        description: 'Series components for financial technical-analysis ' +
            'indicators (MACD, RSI, Bollinger Bands, …).'
    }
];

// Chart elements and modules whose option isn't named after them.
const CROSSREF_OVERRIDES: Record<string, string> = {
    BrokenAxis: 'options/xAxis/breaks',
    DraggablePoints: 'options/plotOptions/series/dragDrop',
    SeriesLabel: 'options/plotOptions/series/label'
};

// Which product the generated pointers aim at. The backend fills any missing
// descriptions from the other products (see `Nav.ts`).
const CROSSREF_PRODUCT = 'highcharts';

// Type names that look like Highcharts types but must NOT get the
// `Highcharts.` prefix: the namespace itself, TS/stdlib, React, and DOM types.
const TS_BUILTINS = new Set([
    // Highcharts namespace name (alias for the namespace, not a type)
    'Highcharts',
    // TypeScript / standard library
    'Array', 'Record', 'Partial', 'Required', 'Readonly', 'Pick', 'Omit',
    'Extract', 'Exclude', 'NonNullable', 'ReturnType', 'Parameters',
    'Date', 'Promise', 'Map', 'Set', 'Object', 'Function', 'RegExp', 'JSON',
    'Iterable', 'Iterator', 'ReadonlyArray',
    // React (bare forms produced by cleanType)
    'Ref', 'HTMLAttributes', 'ReactNode', 'ReactElement', 'JSX', 'Element',
    // DOM
    'HTMLDivElement', 'HTMLElement', 'HTMLInputElement', 'Document', 'Window',
    'Event', 'MouseEvent', 'KeyboardEvent', 'TouchEvent', 'PointerEvent',
    'WheelEvent', 'DragEvent', 'FocusEvent', 'UIEvent', 'Node'
]);

// Matches `Highcharts.Foo` and bare `Foo` type names, skipping other
// namespaces' members (`React.X`) and single-letter generics.
const TYPE_RE = /(?<!\.)\b(Highcharts\.)?([A-Z]\w+)\b(?!\.)/g;

// A `Links to Highcharts.Options.<path>` hint in a prop's JSDoc. The captured
// path becomes that prop's pointer target.
const LINKS_HINT_RE = /^Links to Highcharts\.Options\.(.+?)\s*$/;

// Where the Highcharts module files live, relative to the `highcharts` package.
const MASTERS_PATH = 'highcharts/es-modules/masters/';

// Static imports of a module file (`import 'x.src.js'`, `import X from ...`).
// Dynamic `import()` calls only load on demand, so they don't count.
const STATIC_IMPORT_RE = /^import\s(?:[^'"]*\sfrom\s)?['"]([^'"]+)\.src\.js['"]/gm;

// Description for the `options` prop that every series/indicator has; its
// pointer opens the full series config.
const SERIES_OPTIONS_PROP_DESCRIPTION =
    'Full series configuration object, equivalent to one entry of the ' +
    'Highcharts <code>series</code> array.';


/* *
 *
 *  Helpers
 *
 * */


function getJSDoc(
    node: TSCompiler.Node,
    src: TSCompiler.SourceFile
): string {
    const fullText = src.getFullText();
    const ranges = TSCompiler.getLeadingCommentRanges(
        fullText,
        node.getFullStart()
    );
    if (!ranges?.length) {
        return '';
    }
    return fullText
        .slice(ranges[0].pos, ranges[0].end)
        .replace(/^\/\*\*?/, '')
        .replace(/\*\/$/, '')
        .split('\n')
        .map(l => l.replace(/^\s*\*\s?/, ''))
        .join('\n')
        .trim();
}


// Render a JSDoc comment as HTML. Its tags are Markdown too: an `@example`
// becomes a code block and a `@see` a link, the only tags the package uses.
function toHTML(jsdoc: string): string {
    const [text, ...tags] = jsdoc.split(/^(?=@(?:example|see)\b)/m);
    const parts = [text];

    for (const tag of tags) {
        const content = tag.replace(/^@\w+/, '').trim();

        if (!content) {
            continue;
        }
        parts.push(tag.startsWith('@example') ?
            '```jsx\n' + content + '\n```' :
            `See also: <${content}>`);
    }

    return md.render(
        parts.join('\n\n').replace(
            /\{@link ([^|}]+)(?:\|([^}]+))?\}/gm,
            (_, link, name) => `[${name || link}](${link})`
        )
    );
}


function cleanType(typeText: string): string {
    return typeText
        .replace(/\s+/g, ' ')
        .replace(/React\.ReactNode/g, 'ReactNode')
        .replace(/React\.Ref<[^>]+>/g, 'Ref')
        .replace(/React\.HTMLAttributes<HTMLDivElement>/g, 'HTMLAttributes')
        .replace(/typeof HC/g, 'Highcharts')
        .replace(/HC\./g, 'Highcharts.')
        .trim();
}


// Add the `Highcharts.` prefix to recognised Highcharts types in a type label.
function prefixHighchartsTypeText(typeText: string): string {
    return typeText.replace(TYPE_RE, (match, _prefix, name) => (
        TS_BUILTINS.has(name) ? match : `Highcharts.${name}`
    ));
}


// The options path a `Highcharts.<X>Options` type documents: `Options` is the
// root, `PlotOptions` is `options/plotOptions`, and `LegendOptions` is
// `options/legend`.
function toOptionsPath(typeText: string): string | undefined {
    const name = typeText.match(/^(?:Highcharts|HC)\.([A-Z]\w+)$/)?.[1];

    if (name === 'Options') {
        return 'options';
    }
    if (name === 'PlotOptions') {
        return 'options/plotOptions';
    }

    const m = name?.match(/^([A-Z]\w*?)Options$/);

    return m ? `options/${m[1][0].toLowerCase()}${m[1].slice(1)}` : undefined;
}


// The basic prop names for the generic series components, read from the
// `SeriesProps` type's string union, plus the catch-all `options`.
function genericSeriesPropNames(
    externalTypeAliases: Map<string, TSCompiler.TypeAliasDeclaration>,
    src: TSCompiler.SourceFile
): string[] {
    const alias = externalTypeAliases.get('SeriesProps');
    if (!alias) {
        return [];
    }
    const union = alias.type.getText(src).match(
        /Extract<\s*((?:"[^"]+"\s*\|\s*)*"[^"]+")/
    );
    const names = union ?
        (union[1].match(/"([^"]+)"/g) || []).map(s => s.slice(1, -1)) :
        [];
    if (names.length && !names.includes('options')) {
        names.push('options');
    }
    return names;
}


// The `options` prop of a series: its pointer opens the full series config.
function seriesOptionsProp(
    crossref: string | undefined,
    type: string
): PropEntry {
    return {
        name: 'options',
        type,
        description: SERIES_OPTIONS_PROP_DESCRIPTION,
        crossref
    };
}


// The `highcharts` package's module files, found the way Node resolves it:
// in the nearest `node_modules` of the package or of any folder above it.
function findMastersDir(packageRoot: string): string {
    let dir = Path.resolve(packageRoot);
    for (;;) {
        const mastersDir = Path.join(dir, 'node_modules', MASTERS_PATH);
        if (FSSync.existsSync(mastersDir) || dir === Path.dirname(dir)) {
            return mastersDir;
        }
        dir = Path.dirname(dir);
    }
}


// The Highcharts modules a component file loads, e.g. `modules/stock`: its own
// module imports, followed through the modules those import in turn.
function getLoadedModules(jsPath: string, packageRoot: string): string[] {
    const mastersDir = findMastersDir(packageRoot);
    const modules = new Set<string>();
    const visit = (filePath: string, toModule: (spec: string) => string): void => {
        if (!FSSync.existsSync(filePath)) {
            return;
        }
        const text = FSSync.readFileSync(filePath, 'utf8');
        for (const [, spec] of text.matchAll(STATIC_IMPORT_RE)) {
            const module = toModule(spec);
            if (!module || modules.has(module)) {
                continue;
            }
            modules.add(module);
            visit(
                Path.join(mastersDir, `${module}.src.js`),
                // Modules import each other relatively.
                relative => Path.posix.join(Path.posix.dirname(module), relative)
            );
        }
    };

    visit(jsPath, spec => (
        spec.startsWith(MASTERS_PATH) ? spec.slice(MASTERS_PATH.length) : ''
    ));

    return [...modules];
}


/* *
 *
 *  Extraction
 *
 * */


function resolveTypeText(
    member: TSCompiler.PropertySignature,
    src: TSCompiler.SourceFile,
    checker: TSCompiler.TypeChecker
): string {
    const sourceText = member.type ? member.type.getText(src) : 'any';
    if (!member.type) {
        return sourceText;
    }
    const resolved = checker.typeToString(
        checker.getTypeAtLocation(member.type),
        member,
        TSCompiler.TypeFormatFlags.NoTruncation |
        TSCompiler.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
    );
    // Use the resolved type; fall back to the source text when it can't resolve
    // (e.g. `highcharts` isn't installed).
    if (!resolved || resolved === 'any' || resolved === sourceText) {
        return sourceText;
    }
    return resolved;
}


type PropContainer =
    TSCompiler.InterfaceDeclaration | TSCompiler.TypeLiteralNode;


function extractPropsFromInterface(
    iface: PropContainer,
    src: TSCompiler.SourceFile,
    checker: TSCompiler.TypeChecker,
    externalTypeAliases: Map<string, TSCompiler.TypeAliasDeclaration>
): PropEntry[] {
    const props: PropEntry[] = [];

    for (const member of iface.members) {
        if (!TSCompiler.isPropertySignature(member)) {
            continue;
        }
        const doc = getJSDoc(member, src);
        if (/@internal|@private/.test(doc)) {
            continue;
        }
        const sourceTypeText = member.type ?
            member.type.getText(src) :
            'any';
        // A `Links to …` hint points the prop at that option; otherwise the
        // prop's type decides, directly or one type alias deep.
        const linkHint = doc.match(LINKS_HINT_RE);
        const aliasNode = externalTypeAliases.get(sourceTypeText);
        const crossref = linkHint ?
            `options/${linkHint[1].trim().replaceAll('.', '/')}` :
            (toOptionsPath(sourceTypeText) ??
                (aliasNode ?
                    toOptionsPath(aliasNode.type.getText(src)) :
                    undefined));
        props.push({
            name: member.name.getText(src),
            // The resolved type when `highcharts` is installed; the source
            // text otherwise.
            type: cleanType(resolveTypeText(member, src, checker)),
            description: linkHint ? '' : doc,
            crossref
        });
    }

    return props;
}


function findPropsInterfaceName(typeText: string): string | undefined {
    const omit = typeText.match(/Omit<\s*([A-Z]\w*)/);
    if (omit) {
        return omit[1];
    }
    const direct = typeText.match(/^([A-Z]\w*)$/);
    if (direct) {
        return direct[1];
    }
    return undefined;
}


function callableSignaturePropsType(
    type: TSCompiler.TypeNode,
    src: TSCompiler.SourceFile
): string | undefined {
    if (!TSCompiler.isTypeLiteralNode(type)) {
        return undefined;
    }
    for (const m of type.members) {
        if (
            TSCompiler.isCallSignatureDeclaration(m) &&
            m.parameters.length > 0 &&
            m.parameters[0].type
        ) {
            return m.parameters[0].type.getText(src);
        }
    }
    return undefined;
}


function isComponentishParamType(typeText: string): boolean {
    return /Props|Attributes/.test(typeText) || /^[A-Z]\w*$/.test(typeText);
}


// The Highcharts series type from the `import type { SeriesXxxOptions }` line
// (e.g. `arearange`); used for the basic props and the `options` pointer.
function detectSeriesType(src: TSCompiler.SourceFile): string | undefined {
    const text = src.getFullText();
    const m = text.match(/import type \{ Series(\w+)Options \}/);
    return m ? m[1].toLowerCase() : undefined;
}


function extractComponentsFromFile(
    src: TSCompiler.SourceFile,
    category: string,
    sourceFile: string,
    checker: TSCompiler.TypeChecker
): ComponentDoc[] {
    // Prop containers: interfaces and object-literal type aliases.
    const interfaces = new Map<string, PropContainer>();
    // Other type aliases (e.g. `= Highcharts.PlotOptions`). Kept so we can
    // derive their pointer, since they have no members of their own.
    const externalTypeAliases =
        new Map<string, TSCompiler.TypeAliasDeclaration>();
    const components: ComponentDoc[] = [];
    let defaultExportName: string | undefined;

    TSCompiler.forEachChild(src, node => {
        if (TSCompiler.isInterfaceDeclaration(node)) {
            interfaces.set(node.name.text, node);
        }
        if (TSCompiler.isTypeAliasDeclaration(node)) {
            if (TSCompiler.isTypeLiteralNode(node.type)) {
                interfaces.set(node.name.text, node.type);
            } else {
                externalTypeAliases.set(node.name.text, node);
            }
        }
        if (TSCompiler.isExportAssignment(node) && !node.isExportEquals) {
            const expr = node.expression;
            if (TSCompiler.isIdentifier(expr)) {
                defaultExportName = expr.text;
            }
        }
    });

    const candidates: Array<{
        name: string;
        description: string;
        propsTypeText: string | undefined;
        isExported: boolean;
    }> = [];

    TSCompiler.forEachChild(src, node => {
        if (
            TSCompiler.isVariableStatement(node) &&
            (
                node.modifiers?.some(
                    m => m.kind === TSCompiler.SyntaxKind.ExportKeyword
                ) ||
                node.modifiers?.some(
                    m => m.kind === TSCompiler.SyntaxKind.DeclareKeyword
                )
            )
        ) {
            const isExported = !!node.modifiers?.some(
                m => m.kind === TSCompiler.SyntaxKind.ExportKeyword
            );
            for (const decl of node.declarationList.declarations) {
                const name = decl.name.getText(src);
                if (!/^[A-Z]/.test(name)) {
                    continue;
                }
                if (!decl.type) {
                    continue;
                }
                const typeText = decl.type.getText(src);
                let propsTypeText: string | undefined;

                if (/ForwardRefExoticComponent/.test(typeText)) {
                    propsTypeText = typeText;
                } else if (TSCompiler.isTypeLiteralNode(decl.type)) {
                    propsTypeText = callableSignaturePropsType(decl.type, src);
                    if (!propsTypeText) {
                        continue;
                    }
                } else {
                    continue;
                }

                candidates.push({
                    name,
                    description: getJSDoc(node, src),
                    propsTypeText,
                    isExported
                });
            }
        }

        if (
            TSCompiler.isFunctionDeclaration(node) &&
            node.name &&
            /^[A-Z]/.test(node.name.text) &&
            node.modifiers?.some(
                m => m.kind === TSCompiler.SyntaxKind.ExportKeyword
            ) &&
            node.parameters.length > 0 &&
            node.parameters[0].type
        ) {
            const paramTypeText = node.parameters[0].type.getText(src);
            if (isComponentishParamType(paramTypeText)) {
                candidates.push({
                    name: node.name.text,
                    description: getJSDoc(node, src),
                    propsTypeText: paramTypeText,
                    isExported: true
                });
            }
        }
    });

    // Chart elements and modules point at one options subtree as a whole, so
    // they list no props; series and indicators keep theirs as basic options.
    const pointsAtSubtree = (
        category === 'Chart elements' ||
        category === 'Modules'
    );

    for (const c of candidates) {
        if (!c.isExported && c.name !== defaultExportName) {
            continue;
        }

        const propsIfaceName = findPropsInterfaceName(c.propsTypeText || '');
        let props: PropEntry[] = [];
        let crossref: string | undefined;

        if (propsIfaceName && externalTypeAliases.has(propsIfaceName)) {
            // The component is just an alias to a Highcharts options object (e.g.
            // PlotOptions): point at that subtree instead of listing members.
            crossref = toOptionsPath(
                externalTypeAliases.get(propsIfaceName)!.type.getText(src)
            );
        } else if (!pointsAtSubtree) {
            const commonIface = interfaces.get('ICommonAttributes');
            if (commonIface) {
                props = extractPropsFromInterface(
                    commonIface,
                    src,
                    checker,
                    externalTypeAliases
                );
            }
            if (propsIfaceName && interfaces.has(propsIfaceName)) {
                const specific = extractPropsFromInterface(
                    interfaces.get(propsIfaceName)!,
                    src,
                    checker,
                    externalTypeAliases
                );
                for (const sp of specific) {
                    const idx = props.findIndex(p => p.name === sp.name);
                    if (idx >= 0) {
                        props[idx] = sp;
                    } else {
                        props.push(sp);
                    }
                }
            }
        }

        if (pointsAtSubtree && !crossref) {
            // Named after its option (Legend → options/legend).
            crossref = CROSSREF_OVERRIDES[c.name] ||
                `options/${c.name[0].toLowerCase()}${c.name.slice(1)}`;
        }

        components.push({
            name: c.name,
            category,
            description: c.description,
            props,
            sourceFile,
            crossref
        });
    }

    // Series & indicators: merge the wrapper and its `<Name>Series` into one;
    // the basic props become leaves, and `options` points to the full config.
    if (category === 'Series types' || category === 'Technical indicators') {
        const seriesType = detectSeriesType(src);
        const seriesPath = seriesType && `options/series/${seriesType}`;
        const byName = new Map(components.map(c => [c.name, c]));
        const out: ComponentDoc[] = [];
        for (const c of components) {
            if (!byName.has(c.name)) {
                continue;
            }
            const seriesEntity = byName.get(`${c.name}Series`);
            if (seriesEntity) {
                byName.delete(seriesEntity.name);
            }
            byName.delete(c.name);

            const basicProps = (seriesEntity?.props ?? c.props).map(p => {
                if (p.name === 'options') {
                    return seriesOptionsProp(seriesPath || undefined, p.type);
                }
                if (!seriesPath) {
                    return p;
                }
                // Point at the matching series option; the backend fills in the
                // description and type from Highcharts.
                return {
                    ...p,
                    description: '',
                    crossref: `${seriesPath}/${p.name}`
                };
            });

            out.push({
                name: c.name,
                category,
                description: seriesEntity ?
                    (c.description || seriesEntity.description) :
                    c.description,
                props: basicProps,
                sourceFile: c.sourceFile
            });
        }
        return out;
    }

    // Generic series base (`Series`/`StockSeries`/…): the basic props come from
    // the `SeriesProps` type, using `line` as the default.
    if (category === 'Core') {
        const genericNames = genericSeriesPropNames(externalTypeAliases, src);
        for (const comp of components) {
            if (!comp.name.endsWith('Series') || !genericNames.length) {
                continue;
            }
            comp.props = genericNames.map(name => (
                name === 'options' ?
                    seriesOptionsProp(
                        'options/plotOptions/series',
                        'Highcharts.SeriesOptionsType'
                    ) :
                    // Point at the shared series option (via the `line`
                    // default); the backend fills in the description and type.
                    {
                        name,
                        type: '',
                        description: '',
                        crossref: `options/series/line/${name}`
                    }
            ));
        }
    }

    return components;
}


// Source `.d.ts` path relative to the package root, e.g. `series/Line.d.ts`.
function toSourceFile(filePath: string, packageRoot: string): string {
    return Path.relative(packageRoot, filePath).replace(/\\/g, '/');
}


function getDtsFiles(dir: string): string[] {
    if (!FSSync.existsSync(dir)) {
        return [];
    }
    return FSSync.readdirSync(dir, { withFileTypes: true })
        .filter(entry => entry.isFile() && entry.name.endsWith('.d.ts'))
        .map(entry => Path.join(dir, entry.name));
}


// Build the full set of components: the chart and generic series of every
// product, plus the shared library of series, indicators, modules, and chart
// elements.
function extractComponents(
    packageRoot: string,
    program: TSCompiler.Program
): ComponentDoc[] {
    const checker = program.getTypeChecker();
    const components: ComponentDoc[] = [];
    const add = (
        filePath: string,
        category: string,
        filter?: (c: ComponentDoc) => boolean
    ): void => {
        const src = program.getSourceFile(filePath);
        if (!src) {
            return;
        }
        const extracted = extractComponentsFromFile(
            src,
            category,
            toSourceFile(filePath, packageRoot),
            checker
        );
        const modules = getLoadedModules(
            filePath.replace(/\.d\.ts$/, '.js'),
            packageRoot
        );
        for (const c of extracted) {
            c.modules = modules;
            // The entry files hold charts (→ Charts) and generic series
            // bases (→ Series types).
            if (c.category === 'Core') {
                if (c.name.endsWith('Chart')) {
                    c.category = 'Charts';
                } else if (c.name.endsWith('Series')) {
                    c.category = 'Series types';
                }
            }
            if (
                (!filter || filter(c)) &&
                !components.some(x => x.name === c.name)
            ) {
                components.push(c);
            }
        }
    };

    for (const [index, entryFile] of ENTRY_FILES.entries()) {
        // Other products only contribute their chart and series base.
        add(
            Path.join(packageRoot, entryFile),
            'Core',
            index ? c => c.category !== 'Core' : void 0
        );
    }

    for (const { dir, category } of SHARED_DIRS) {
        for (const filePath of getDtsFiles(Path.join(packageRoot, dir))) {
            add(filePath, category);
        }
    }

    components.sort((a, b) => (
        a.category.localeCompare(b.category) || (
            a.category === 'Charts' ?
                CHART_ORDER.indexOf(a.name) - CHART_ORDER.indexOf(b.name) :
                a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        )
    ));

    console.log(
        `[react] ${components.length} components ` +
        `(${components.reduce((sum, c) => sum + c.props.length, 0)} props)`
    );

    return components;
}


/* *
 *
 *  Tree JSON emission (for hc-apidoc-backend ingestion)
 *
 * */


// Make a URL-safe key from a category name ("Series types" → "SeriesTypes"),
// since path segments can't have spaces. The frontend shows the human label.
function categoryKey(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}


// Turn the components into the tree shape ReactImporter reads: five category
// nodes, each component under its category, each prop under its component.
function buildTreeReact(
    components: ComponentDoc[],
    meta: { branch: string; commit: string; version: string }
): Record<string, unknown> {
    const tree: Record<string, unknown> = { _meta: meta };

    for (const cat of CATEGORIES) {
        const catComponents = components.filter(c => c.category === cat.name);
        if (!catComponents.length) {
            continue;
        }

        const catKey = categoryKey(cat.name);
        const componentChildren: Record<string, unknown> = {};

        for (const c of catComponents) {
            const propChildren: Record<string, unknown> = {};

            for (const p of c.props) {
                propChildren[p.name] = {
                    doclet: {
                        description: p.description,
                        type: {
                            names: [prefixHighchartsTypeText(p.type)]
                        },
                        // `[product, path]`; the backend reads the content
                        // from there.
                        ...(p.crossref ?
                            { crossref: [CROSSREF_PRODUCT, p.crossref] } :
                            {})
                    },
                    meta: {
                        fullname: `${catKey}.${c.name}.${p.name}`,
                        name: p.name,
                        // Declared in the same `.d.ts` as its component.
                        file: c.sourceFile
                    }
                };
            }

            componentChildren[c.name] = {
                doclet: {
                    // Its examples show how to import it.
                    description: toHTML(c.description),
                    ...(c.crossref ?
                        { crossref: [CROSSREF_PRODUCT, c.crossref] } :
                        {}),
                    ...(c.modules?.length ? { modules: c.modules } : {})
                },
                meta: {
                    fullname: `${catKey}.${c.name}`,
                    name: c.name,
                    file: c.sourceFile
                },
                children: propChildren
            };
        }

        tree[catKey] = {
            doclet: { description: cat.description },
            meta: { fullname: catKey, name: catKey },
            children: componentChildren
        };
    }

    return tree;
}


/* *
 *
 *  Main
 *
 * */


async function main(): Promise<void> {
    const args = await (Yargs.argv as any);
    const packageRoot: string =
        args.source || 'node_modules/@highcharts/react';

    if (!FSSync.existsSync(packageRoot)) {
        console.error(
            `Cannot find @highcharts/react at "${packageRoot}". ` +
            'Either install it via npm or pass --source <path>.'
        );
        Process.exit(1);
    }

    const allDts = [
        packageRoot,
        ...SHARED_DIRS.map(({ dir }) => Path.join(packageRoot, dir))
    ].flatMap(getDtsFiles);

    if (allDts.length === 0) {
        console.error(`No .d.ts files found under "${packageRoot}".`);
        Process.exit(1);
    }

    const program = TSCompiler.createProgram(allDts, {
        target: TSCompiler.ScriptTarget.ES2020,
        module: TSCompiler.ModuleKind.ESNext,
        moduleResolution: TSCompiler.ModuleResolutionKind.Bundler,
        declaration: true,
        strict: false,
        noEmit: true,
        skipLibCheck: true,
        jsx: TSCompiler.JsxEmit.ReactJSX,
        lib: ['lib.es2020.d.ts', 'lib.dom.d.ts']
    });

    const components = extractComponents(packageRoot, program);

    if (!components.length) {
        console.error('No components extracted; not writing tree-react.json.');
        Process.exit(1);
    }

    const reactPkgPath = Path.join(packageRoot, 'package.json');
    const reactPkg = JSON.parse(
        await FS.readFile(reactPkgPath, 'utf8')
    ) as { version?: string };

    if (!reactPkg.version) {
        console.error(`Missing version in ${reactPkgPath}.`);
        Process.exit(1);
    }

    let reactBranch = '';
    let reactCommit = '';
    try {
        reactBranch = execSync('git rev-parse --abbrev-ref HEAD', {
            cwd: packageRoot
        }).toString().trim();
        reactCommit = execSync('git rev-parse --short HEAD', {
            cwd: packageRoot
        }).toString().trim();
    } catch {
        // Not a git checkout (e.g. npm install) — keep empty strings.
    }

    const tree = buildTreeReact(components, {
        branch: reactBranch || 'main',
        commit: reactCommit,
        version: reactPkg.version! // non-empty: guaranteed by the guard above
    });

    // Output path: use `--out <path>` if given (the backend sync passes its own
    // temp path), otherwise `tree-react.json` in the current directory.
    const outArg = args.out;
    const outPath = typeof outArg === 'string' && outArg.length ?
        outArg :
        'tree-react.json';

    await FS.mkdir(Path.dirname(Path.resolve(outPath)), { recursive: true });
    await FS.writeFile(outPath, JSON.stringify(tree, null, 4), 'utf8');
    console.log(
        `Wrote ${outPath} (${Object.keys(tree).length - 1} categories).`
    );
}


main().catch(err => {
    console.error(err);
    Process.exit(1);
});
