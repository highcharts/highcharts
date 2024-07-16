/* *
 *
 *  API Database API Mockup
 *
 *  (c) Highsoft AS
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */


/* *
 *
 *  Imports
 *
 * */


import FS from 'node:fs/promises';
import FSLib from '../libs/fs';


/* *
 *
 *  Declarations
 *
 * */


interface Data {
    description: Array<string>;
    doclet: Array<string>;
    meta: Array<string>;
    name: Array<string>;
}


/* *
 *
 *  Constant
 *
 * */


const DATABASE_NAME = 'tree-database';


const KEY_ANTI_PATTERN = /[^\w\- ]+/gsu;


const SPACE_PATTERN = /\s+/gsu;


const VALUE_ANTI_PATTERN = /[^\w\-\n\r\\\/\[\] .:,;?!=+*(){}<>'"`^#$%&@]+/gsu;


/* *
 *
 *  Functions
 *
 * */


function sanitizeKey(
    key: string
): string {

    while (KEY_ANTI_PATTERN.test(key)) {
        key = key.replace(KEY_ANTI_PATTERN, ' ');
    }

    return key.replace(SPACE_PATTERN, ' ');
}


function sanitizeValue(
    value: string
): string {

    while (VALUE_ANTI_PATTERN.test(value)) {
        value = value.replace(VALUE_ANTI_PATTERN, '');
    }

    return value;
}


/* *
 *
 *  Class
 *
 * */


export class Database {


    /* *
     *
     *  Constructor
     *
     * */


    public constructor(
        product: string,
        storageFolder: string = process.cwd()
    ) {
        this.cache = {};
        this.namePrefix = `${product}.`;
        this.product = product;
        this.storageFolder = storageFolder;
    }


    /* *
     *
     *  Properties
     *
     * */


    private readonly cache: Record<string, Data>;


    private readonly namePrefix: string;


    public readonly product: string;


    private readonly storageFolder: string;


    /* *
     *
     *  Functions
     *
     * */


    private getFilePath(
        name: string
    ) {
        return FSLib.path([this.storageFolder, sanitizeKey(name) + '.json']);
    }


    public async getNode(
        nodeName: string
    ): Promise<(Database.Node|undefined)> {
        const data = await this.getTreeData();
        const nodePath = this.namePrefix + nodeName;

        let index = data.name.indexOf(nodePath);

        if (index === -1) {
            return void 0;
        }

        return {
            name: nodeName,
            description: data.description[index],
            doclet: JSON.parse(data.doclet[index]),
            meta: JSON.parse(data.meta[index])
        };
    }


    public async getNodeChildren(
        nodeName: string
    ): Promise<Array<Database.Node>> {
        const children: Array<Database.Node> = [];
        const data = await this.getTreeData();
        const nodePath = this.namePrefix + nodeName;

        let indexOffset = nodePath.length;

        let index = -1;

        for (const name of data.name) {

            ++index;

            if (
                !name.startsWith(nodePath) ||
                // Skip children's children
                name.indexOf('.', indexOffset) !== -1
            ) {
                continue;
            }

            children.push({
                name: nodeName,
                description: data.description[index],
                doclet: JSON.parse(data.doclet[index]),
                meta: JSON.parse(data.meta[index])
            });

        }

        return children;
    }


    private async getTreeData(): Promise<Data> {
        const name = DATABASE_NAME;

        let data = this.cache[name];

        if (data) {
            return data;
        }

        const filePath = this.getFilePath(name);

        if (!FSLib.isFile(filePath)) {
            await this.saveTreeData({
                description: [],
                doclet: [],
                meta: [],
                name: []
            });
        }

        data = JSON.parse(await FS.readFile(filePath, 'utf8'));

        this.cache[name] = data;

        return data;
    }


    private async saveTreeData(
        data: Data
    ): Promise<Data> {
        const name = DATABASE_NAME;

        await FS.writeFile(
            this.getFilePath(name),
            JSON.stringify(data),
            'utf8'
        );

        return data;
    }


    public async setNode(
        node: Database.Node
    ): Promise<Database.Node> {
        const data = await this.getTreeData();
        const nodePath = this.namePrefix + node.name;

        let index = data.name.indexOf(nodePath);

        if (index === -1) {
            index = data.name.length;
        }

        data.doclet[index] = JSON.stringify(node.doclet);
        data.description[index] = node.description;
        data.meta[index] = JSON.stringify(node.meta);
        data.name[index] = node.name;

        await this.saveTreeData(data);

        return node;
    }


}


/* *
 *
 *  Class Namespace
 *
 * */


export namespace Database {


    /* *
     *
     *  Declarations
     *
     * */


    export interface Doclet {
        default?: Array<(boolean|number|string)>;
        example?: Array<string>;
        exclude?: Array<string>;
        extends?: Array<string>;
        product?: Array<string>;
        sample?: Array<string>;
        see?: Array<string>;
        type?: Array<string>;
    }


    export interface Meta {
        file: string;
    }


    export interface Node {
        name: string;
        description: string;
        doclet: Doclet;
        meta: Meta;
    }


}


/* *
 *
 *  Default Export
 *
 * */


export default Database;
