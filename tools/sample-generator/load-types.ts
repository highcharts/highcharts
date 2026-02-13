import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

/**
 * Loads a .d.ts file, analyzes it, and returns its exported types as a JavaScript record.
 * The record maps exported type names to their string representations.
 */
export async function loadExportedTypes(dtsFilePath: string): Promise<Record<string, string[]>> {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const absPath = path.join(__dirname, '../../', dtsFilePath);
    const sourceText = await fs.promises.readFile(absPath, "utf-8");
    const sourceFile = ts.createSourceFile(absPath, sourceText, ts.ScriptTarget.Latest, true);

    const exportedTypes: Record<string, string[]> = {};

    function extractPrimitivesFromType(typeNode: ts.TypeNode): string[] | null {
    // Unwrap parentheses e.g. ("a"|"b")
        while (ts.isParenthesizedTypeNode(typeNode)) {
            typeNode = typeNode.type;
        }

        // Unions of primitives: "a" | "b" | 1 | true | null | undefined
        if (ts.isUnionTypeNode(typeNode)) {
            const parts: string[] = [];
            for (const t of typeNode.types) {
                const p = extractPrimitivesFromType(t);
                if (!p) {
                    // If any member isn’t a primitive literal, give up for this alias
                    return null;
                }
                parts.push(...p);
            }
            return parts;
        }

        // Literal type nodes: "center", 1, true/false, null
        if (ts.isLiteralTypeNode(typeNode)) {
            const lit = typeNode.literal;
            if (ts.isStringLiteral(lit) || ts.isNumericLiteral(lit)) {
                return [lit.text];
            }
            switch (lit.kind) {
                case ts.SyntaxKind.TrueKeyword: return ["true"];
                case ts.SyntaxKind.FalseKeyword: return ["false"];
                case ts.SyntaxKind.NullKeyword: return ["null"];
            }
            return null;
        }

        // Handle keyword types by kind (avoid ts.isKeywordTypeNode for older TS)
        if ((typeNode as any).kind === ts.SyntaxKind.UndefinedKeyword) {
            return ["undefined"];
        }

        // Not a primitive literal type (e.g., references, intersections, etc.)
        return null;
    }

    function visit(node: ts.Node) {
        if (
            ts.isTypeAliasDeclaration(node) &&
            node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)
        ) {
            const name = node.name.text;
            const primitives = node.type ? extractPrimitivesFromType(node.type) : null;
            if (primitives) {
                exportedTypes[name] = primitives;
            }
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    return exportedTypes;
}