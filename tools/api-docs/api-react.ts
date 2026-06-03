/* *
 *
 *  Generating API documentation for the @highcharts/react package.
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


interface PassThrough {
    // The options path this prop points to ('' = the whole options root).
    // Becomes the prop's `doclet.crossref`, which the backend reads.
    hrefPath: string;
}


interface PropEntry {
    name: string;
    type: string;
    description: string;
    optional: boolean;
    // Set when the prop points to an options subtree; becomes its crossref.
    passThrough?: PassThrough;
}


interface ComponentDoc {
    name: string;
    category: string;
    importPath: string;
    description: string;
    props: PropEntry[];
    // The options subtree this whole component points to (its `doclet.crossref`).
    // Only chart elements, modules, and PlotOptions use this.
    crossref?: string;
}


interface ProductConfig {
    id: 'highcharts' | 'stock' | 'maps' | 'gantt';
    entryFile: string;
    includeSharedLibrary: boolean;
}


/* *
 *
 *  Constants
 *
 * */


const PRODUCTS: ProductConfig[] = [
    {
        id: 'highcharts',
        entryFile: 'Highcharts.d.ts',
        includeSharedLibrary: true
    },
    {
        id: 'stock',
        entryFile: 'Stock.d.ts',
        includeSharedLibrary: false
    },
    {
        id: 'maps',
        entryFile: 'Maps.d.ts',
        includeSharedLibrary: false
    },
    {
        id: 'gantt',
        entryFile: 'Gantt.d.ts',
        includeSharedLibrary: false
    }
];

const SHARED_DIRS: Array<{ dir: string; category: string }> = [
    { dir: 'series',     category: 'Series types'         },
    { dir: 'indicators', category: 'Technical indicators' },
    { dir: 'modules',    category: 'Modules'              },
    { dir: 'options',    category: 'Chart elements'       }
];


interface CategoryDef {
    name: string;
    description: string;
}


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


function toHTML(text: string): string {
    if (!text) {
        return '';
    }
    return md.render(
        text.replace(
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


// Description for the `options` prop that every series/indicator has; its
// pointer opens the full series config.
const SERIES_OPTIONS_PROP_DESCRIPTION =
    'Full series configuration object, equivalent to one entry of the ' +
    'Highcharts <code>series</code> array.';


// Build the `options` prop: a leaf whose pointer (`hrefPath`) opens the full
// series config.
function seriesOptionsProp(
    hrefPath: string,
    type: string,
    optional: boolean
): PropEntry {
    return {
        name: 'options',
        type,
        description: SERIES_OPTIONS_PROP_DESCRIPTION,
        optional,
        passThrough: hrefPath ? { hrefPath } : undefined
    };
}


// Add the `Highcharts.` prefix to recognised Highcharts types in a type label.
function prefixHighchartsTypeText(typeText: string): string {
    return typeText.replace(TYPE_RE, (match, _prefix, name) => {
        if (TS_BUILTINS.has(name)) {
            return match;
        }
        return `Highcharts.${name}`;
    });
}


/* *
 *
 *  Extraction
 *
 * */


// Turn a Highcharts options-type name into its path: `Options`→'',
// `PlotOptions`→'plotOptions', `<X>Options`→lowercase first letter of X.
function namespaceMemberToOptionsHrefPath(
    name: string
): string | undefined {
    if (name === 'Options') {
        return '';
    }
    if (name === 'PlotOptions') {
        return 'plotOptions';
    }
    const m = name.match(/^([A-Z]\w*?)Options$/);
    if (!m) {
        return undefined;
    }
    return m[1][0].toLowerCase() + m[1].slice(1);
}


// Turn a `Highcharts.<X>Options` type into its options path
// (e.g. `Highcharts.PlotOptions` → `options/plotOptions`).
function deriveCrossrefFromExternalAlias(
    aliasRhs: string
): string | undefined {
    const m = aliasRhs.match(/^(?:Highcharts|HC)\.([A-Z]\w+)$/);
    if (!m) {
        return undefined;
    }
    const hrefPath = namespaceMemberToOptionsHrefPath(m[1]);
    if (hrefPath === undefined) {
        return undefined;
    }
    return hrefPath ? `options/${hrefPath}` : 'options';
}


// If a prop is typed as a Highcharts options object (`Highcharts.<X>Options`),
// return the options subtree it points to (e.g. the chart `options` prop).
function detectPassThrough(
    sourceTypeText: string
): PassThrough | undefined {
    const ns = sourceTypeText.match(/^(?:Highcharts|HC)\.([A-Z]\w+)$/);
    if (ns) {
        const path = namespaceMemberToOptionsHrefPath(ns[1]);
        if (path !== undefined) {
            return { hrefPath: path };
        }
    }
    return undefined;
}


function resolveTypeText(
    member: TSCompiler.PropertySignature,
    src: TSCompiler.SourceFile,
    checker: TSCompiler.TypeChecker | undefined
): string {
    const sourceText = member.type ? member.type.getText(src) : 'any';
    if (!checker || !member.type) {
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
    checker?: TSCompiler.TypeChecker,
    externalTypeAliases?: Map<string, TSCompiler.TypeAliasDeclaration>
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
        // A `Links to …` hint points the prop at that option; otherwise detect
        // a pass-through (either directly or one type-alias deep).
        const linkHint = doc.match(LINKS_HINT_RE);
        const aliasNode = externalTypeAliases?.get(sourceTypeText);
        const passThrough = linkHint ?
            { hrefPath: linkHint[1].trim() } :
            (detectPassThrough(sourceTypeText) ??
                (aliasNode ?
                    detectPassThrough(aliasNode.type.getText(src)) :
                    undefined));
        // The resolved type when `highcharts` is installed; the source text
        // otherwise.
        const displayType = resolveTypeText(member, src, checker);
        props.push({
            name: member.name.getText(src),
            type: cleanType(displayType),
            description: linkHint ? '' : doc,
            optional: !!member.questionToken,
            passThrough
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


function extractComponentsFromFile(
    src: TSCompiler.SourceFile,
    category: string,
    importPath: string,
    checker?: TSCompiler.TypeChecker
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

    // Chart elements and modules drop their props (the whole component points
    // to one subtree); series and indicators keep theirs as basic options.
    const dropsProps = (
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
            const aliasRhs = externalTypeAliases
                .get(propsIfaceName)!
                .type.getText(src);
            crossref = deriveCrossrefFromExternalAlias(aliasRhs);
        } else if (!dropsProps) {
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

        components.push({
            name: c.name,
            category,
            importPath,
            description: c.description,
            props,
            ...(crossref !== undefined ? { crossref } : {})
        });
    }

    // Chart elements and modules point at their whole subtree, derived from the
    // name (Legend → options/legend).
    if (category === 'Chart elements' || category === 'Modules') {
        const crossrefOverrides: Record<string, string> = {
            BrokenAxis: 'options/xAxis/breaks',
            DraggablePoints: 'options/plotOptions/series/dragDrop'
        };
        for (const comp of components) {
            if (!comp.crossref) {
                const optionPath =
                    comp.name.charAt(0).toLowerCase() + comp.name.slice(1);
                comp.crossref =
                    crossrefOverrides[comp.name] || `options/${optionPath}`;
                comp.props = [];
            }
        }
    }

    // Series & indicators: merge the wrapper and its `<Name>Series` into one;
    // the basic props become leaves, and `options` points to the full config.
    if (category === 'Series types' || category === 'Technical indicators') {
        const seriesType = detectSeriesType(src);
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
                    return seriesOptionsProp(
                        seriesType ? `series.${seriesType}` : '',
                        p.type,
                        p.optional
                    );
                }
                if (!seriesType) {
                    return p;
                }
                // Point at the matching series option; the backend fills in the
                // description and type from Highcharts.
                return {
                    ...p,
                    description: '',
                    passThrough: { hrefPath: `series.${seriesType}.${p.name}` }
                };
            });

            out.push({
                name: c.name,
                category,
                importPath,
                description: seriesEntity ?
                    (c.description || seriesEntity.description) :
                    c.description,
                props: basicProps
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
            comp.props = genericNames.map(name => {
                if (name === 'options') {
                    return seriesOptionsProp(
                        'plotOptions.series',
                        'Highcharts.SeriesOptionsType',
                        true
                    );
                }
                // Point at the shared series option (via the `line` default);
                // the backend fills in the description and type.
                return {
                    name,
                    type: '',
                    description: '',
                    optional: true,
                    passThrough: { hrefPath: `series.line.${name}` }
                };
            });
        }
    }

    return components;
}


// The Highcharts series type from the `import type { SeriesXxxOptions }` line
// (e.g. `arearange`); used for the basic props and the `options` pointer.
function detectSeriesType(src: TSCompiler.SourceFile): string | undefined {
    const text = src.getFullText();
    const m = text.match(/import type \{ Series(\w+)Options \}/);
    return m ? m[1].toLowerCase() : undefined;
}


function importPathFor(
    filePath: string,
    packageRoot: string,
    overrideForEntry?: string
): string {
    if (overrideForEntry) {
        return overrideForEntry;
    }
    const rel = Path
        .relative(packageRoot, filePath)
        .replace(/\\/g, '/')
        .replace(/\.d\.ts$/, '');
    return rel === 'index' ?
        '@highcharts/react' :
        `@highcharts/react/${rel}`;
}


function getDtsFiles(dir: string): string[] {
    const out: string[] = [];
    if (!FSSync.existsSync(dir)) {
        return out;
    }
    for (const entry of FSSync.readdirSync(dir, { withFileTypes: true })) {
        const full = Path.join(dir, entry.name);
        if (entry.isFile() && entry.name.endsWith('.d.ts')) {
            out.push(full);
        }
    }
    return out;
}


// Build the full set of components. Only the `highcharts` product is built —
// with `includeSharedLibrary` it covers every chart type plus the shared library.
function extractComponents(
    product: ProductConfig,
    packageRoot: string,
    program: TSCompiler.Program
): ComponentDoc[] {
    const entryPath = Path.join(packageRoot, product.entryFile);
    const entrySrc = program.getSourceFile(entryPath);
    if (!entrySrc) {
        throw new Error(`Cannot find entry file: ${entryPath}`);
    }

    const checker = program.getTypeChecker();

    const entryImportPath = `@highcharts/react${
        product.id === 'highcharts' ?
            '' :
            '/' + product.entryFile.replace(/\.d\.ts$/, '')
    }`;

    const components: ComponentDoc[] = extractComponentsFromFile(
        entrySrc,
        'Core',
        entryImportPath,
        checker
    );

    // Sort the entry file's components: chart constructors → Charts, the
    // generic <Series> base → Series types.
    const assignCoreCategory = (c: ComponentDoc): void => {
        if (c.name.endsWith('Chart')) {
            c.category = 'Charts';
        } else if (c.name.endsWith('Series')) {
            // Generic <Series> base; props were built in the Core branch above.
            c.category = 'Series types';
        }
    };
    for (const c of components) {
        if (c.category === 'Core') {
            assignCoreCategory(c);
        }
    }

    if (product.includeSharedLibrary) {
        // Pull chart constructors and series bases from the other entry files so
        // all four Chart/Series variants appear together.
        for (const variant of PRODUCTS) {
            if (variant.id === product.id) {
                continue;
            }
            const variantPath = Path.join(packageRoot, variant.entryFile);
            const variantSrc = program.getSourceFile(variantPath);
            if (!variantSrc) {
                continue;
            }
            const variantImportPath = `@highcharts/react/` +
                variant.entryFile.replace(/\.d\.ts$/, '');
            const variantExtracted = extractComponentsFromFile(
                variantSrc,
                'Core',
                variantImportPath,
                checker
            );
            for (const c of variantExtracted) {
                assignCoreCategory(c);
                if (
                    (c.category === 'Charts' ||
                        c.category === 'Series types') &&
                    !components.find(x => x.name === c.name)
                ) {
                    components.push(c);
                }
            }
        }

        // Shared library: series, indicators, modules, chart elements.
        for (const { dir, category } of SHARED_DIRS) {
            const fullDir = Path.join(packageRoot, dir);
            for (const f of getDtsFiles(fullDir)) {
                const src = program.getSourceFile(f);
                if (!src) {
                    continue;
                }
                const importPath = importPathFor(f, packageRoot);
                const extracted = extractComponentsFromFile(
                    src,
                    category,
                    importPath,
                    checker
                );
                for (const c of extracted) {
                    if (!components.find(x => x.name === c.name)) {
                        components.push(c);
                    }
                }
            }
        }
    }

    // Charts are ordered by product (Highcharts → Stock → Maps → Gantt), not
    // alphabetically — the order users expect.
    const chartOrder = PRODUCTS.map(p => `${
        p.entryFile.replace(/\.d\.ts$/, '').replace(/^Highcharts$/, '')
    }Chart`);
    components.sort((a, b) => {
        if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
        }
        if (a.category === 'Charts') {
            return chartOrder.indexOf(a.name) - chartOrder.indexOf(b.name);
        }
        return a.name.localeCompare(b.name, undefined, {
            sensitivity: 'base'
        });
    });

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


function stripHtmlTags(text: string): string {
    return text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}


// Make a URL-safe key from a category name ("Series types" → "SeriesTypes"),
// since path segments can't have spaces. The frontend shows the human label.
function categoryKey(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}


// Component body: an import snippet followed by the JSDoc (as HTML).
function buildComponentDescription(c: ComponentDoc): string {
    const importSnippet =
        `<pre><code>import { ${c.name} } from '${c.importPath}';</code></pre>`;
    return c.description ?
        `${importSnippet}${toHTML(c.description)}` :
        importSnippet;
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
                const propDoclet: Record<string, unknown> = {
                    description: p.description,
                    type: {
                        names: [prefixHighchartsTypeText(p.type)]
                    }
                };

                if (p.passThrough) {
                    // `[product, path]`; the backend reads the content from there.
                    // Slash-separated to match what the resolver expects.
                    propDoclet.crossref = [
                        CROSSREF_PRODUCT,
                        p.passThrough.hrefPath ?
                            `options/${p.passThrough.hrefPath.replaceAll('.', '/')}` :
                            'options'
                    ];
                }

                propChildren[p.name] = {
                    doclet: propDoclet,
                    meta: {
                        fullname: `${catKey}.${c.name}.${p.name}`,
                        name: p.name
                    }
                };
            }

            const componentDoclet: Record<string, unknown> = {
                description: buildComponentDescription(c)
            };

            if (c.crossref) {
                componentDoclet.crossref = [CROSSREF_PRODUCT, c.crossref];
            }

            componentChildren[c.name] = {
                doclet: componentDoclet,
                meta: {
                    fullname: `${catKey}.${c.name}`,
                    name: c.name
                },
                children: propChildren
            };
        }

        tree[catKey] = {
            doclet: { description: stripHtmlTags(cat.description) },
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

    const allDts: string[] = [];
    for (const f of getDtsFiles(packageRoot)) {
        allDts.push(f);
    }
    for (const { dir } of SHARED_DIRS) {
        for (const f of getDtsFiles(Path.join(packageRoot, dir))) {
            allDts.push(f);
        }
    }

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

    // Only the `highcharts` product is needed — with `includeSharedLibrary`
    // it already covers the shared library and every chart type.
    const components = extractComponents(PRODUCTS[0], packageRoot, program);

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
