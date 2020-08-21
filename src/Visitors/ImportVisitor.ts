import {SourceCodeFile} from "../Interfaces/SourceCodeFile";
import {Decoratable} from "../Interfaces/Decoratable";
import {Visitable} from "../Interfaces/Visitable";

export class ImportVisitor implements Visitable {
    private readonly packageName: string;
    private readonly decorators: Record<string, Decoratable>;

    constructor(decorators: Record<string, Decoratable>, packageName: string) {
        this.packageName = packageName;
        this.decorators = decorators;
    }

    public visit(sourceCodeFile: SourceCodeFile): Record<string, DecoratorImportReference[]> {
        const importDeclarations = sourceCodeFile.getImportDeclarations();
        let references: Record<string, DecoratorImportReference[]> = {};
        for (const decoratorKey in this.decorators) {
            references[decoratorKey] = []
        }

        importDeclarations.forEach(item => {
            const structure = item.getStructure();
            if (structure.moduleSpecifier !== this.packageName) return;

            if (structure.namespaceImport) {
                this.generateNamespacedReference(references, structure.namespaceImport);
            } else if (structure.namedImports.length > 0) {
                this.generateNamedReference(references, structure.namedImports as []);
            }
        });

        return references;
    }

    private generateNamedReference(references: Record<string, DecoratorImportReference[]>, namedImports: []): void {
        namedImports.forEach(namedImport => {
            if (!references[namedImport['name']]) return;
            references[namedImport['name']].push({
                name: namedImport['name'],
                alias: namedImport['alias'],
                namespace: undefined,
                decorator: this.decorators[namedImport['name']]
            });
        })
    }

    private generateNamespacedReference(references: Record<string, DecoratorImportReference[]>, namespace: string): void {
        for (const name in this.decorators) {
            references[name].push({
                namespace,
                name,
                alias: undefined,
                decorator: this.decorators[name]
            });
        }
    }
}

export interface DecoratorImportReference {
    name: string;
    alias?: string;
    namespace?: string;
    decorator?: Decoratable
}
