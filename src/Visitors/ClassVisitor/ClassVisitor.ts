import {SourceCodeFile} from "../../Interfaces/SourceCodeFile";
import {Visitable} from "../../Interfaces/Visitable";
import {ClassDecoratorRef, DecoratorVisitor} from "./DecoratorVisitor";
import {ClassDeclaration, ParameterDeclaration} from "ts-morph";
import {MethodDeclarationRef, MethodVisitor} from "./MethodVisitor";

export class ClassVisitor implements Visitable {
    private readonly decoratorVisitor: DecoratorVisitor = new DecoratorVisitor();
    private readonly methodVisitor: MethodVisitor = new MethodVisitor();

    public visit(sourceCodeFile: SourceCodeFile): ClassDeclarationRef[] {
        const classDeclarations = sourceCodeFile.getClasses() as ClassDeclarationRef[];

        return classDeclarations.map(classDeclaration => {
            const decorators = this.decoratorVisitor.visit(classDeclaration, sourceCodeFile.decorators);
            if(decorators.length === 0) return;
            classDeclaration.decoratorRefs = decorators;
            classDeclaration.filePath = sourceCodeFile.getFilePath();
            classDeclaration.className = classDeclaration.getName();
            classDeclaration.interfaces = classDeclaration.getStructure().implements as string[];
            classDeclaration.classParams = this.getConstructorParams(classDeclaration);
            classDeclaration.methods = this.methodVisitor.visit(classDeclaration, sourceCodeFile.decorators);
            return classDeclaration;
        }).filter(item => item);
    }

    private getConstructorParams(classDeclaration: ClassDeclarationRef) {
        const constructor = classDeclaration.getConstructors();
        if(constructor.length > 0) {
            const parameters = constructor[0].getParameters()

            return parameters.map(param => ({
                name: param.getName(),
                type: this.getParamType(param),
                isArray: param.getType().isArray() || param.getType().isTuple(),
                isRest: param.isRestParameter()
            }));
        }
    }

    private getParamType(param: ParameterDeclaration){
        const arrayReferences = param.getChildrenOfKind(174);
        const typeReferences = param.getChildrenOfKind(169);

        if(param.getType().isArray() && arrayReferences.length > 0) { // Array TypeReference
            const typeReferences = arrayReferences[0].getChildrenOfKind(169);
            if(typeReferences.length > 0) {
                return typeReferences[0].getText()
            }
        } else if(param.getType().isArray() && typeReferences.length > 0){
            return  typeReferences[0].getTypeArguments()[0].getText();
        } else if(param.getType().isClassOrInterface() && typeReferences.length > 0) {
            return typeReferences[0].getTypeName().getText();
        }
    }
}

export interface ClassDeclarationRef extends ClassDeclaration {
    filePath?: string;
    decoratorRefs?: ClassDecoratorRef[];
    className?: string;
    interfaces?: string[];
    classParams?: ClassParam[];
    methods?: MethodDeclarationRef[];
}

export interface ClassParam {
    type: string;
    name: string;
    isArray: boolean;
    isRest: boolean;
}