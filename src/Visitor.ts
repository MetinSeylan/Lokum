import {ImportVisitor} from "./Visitors/ImportVisitor";
import {SourceCodeFile} from "./Interfaces/SourceCodeFile";
import {Decoratable} from "./Interfaces/Decoratable";
import {ClassVisitor} from "./Visitors/ClassVisitor/ClassVisitor";

export class Visitor {
    private readonly importVisitor: ImportVisitor;
    private readonly classVisitor: ClassVisitor = new ClassVisitor();

    constructor(packageName: string, decorators: Record<string, Decoratable>) {
        this.importVisitor = new ImportVisitor(
            decorators,
            packageName,
        );
    }

    visit(sourceCodeFiles: SourceCodeFile[]) {
        sourceCodeFiles.forEach(sourceCodeFile => {
            sourceCodeFile.decorators = this.importVisitor.visit(sourceCodeFile);
            sourceCodeFile.classDeclarations = this.classVisitor.visit(sourceCodeFile);
            console.log(sourceCodeFile.classDeclarations);
        });
    }
}
