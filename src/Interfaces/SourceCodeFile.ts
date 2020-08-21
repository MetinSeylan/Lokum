import {SourceFile} from "ts-morph";
import {DecoratorImportReference} from "../Visitors/ImportVisitor";
import {ClassDeclarationRef} from "../Visitors/ClassVisitor/ClassVisitor";

export interface SourceCodeFile extends SourceFile {
    filePath?: string;
    decorators?: Record<string, DecoratorImportReference[]>;
    classDeclarations?: ClassDeclarationRef[];
}