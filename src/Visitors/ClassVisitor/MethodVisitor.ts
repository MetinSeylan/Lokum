import {ClassDeclarationRef, ClassParam} from "./ClassVisitor";
import {ClassDecoratorRef, DecoratorVisitor} from "./DecoratorVisitor";
import {DecoratorImportReference} from "../ImportVisitor";
import {MethodDeclaration, ParameterDeclaration} from "ts-morph";

export class MethodVisitor {
    private readonly decoratorVisitor: DecoratorVisitor = new DecoratorVisitor();

    public visit(classDeclaration: ClassDeclarationRef, decorators: Record<string, DecoratorImportReference[]>) {
        const methods = classDeclaration.getMethods() as MethodDeclarationRef[];

        return methods.map(item => {
            item.decoratorRefs = this.decoratorVisitor.visit(item, decorators);
            item.name = item.getName();
            item.async = item.isAsync();
            item.type = this.getReturnType(item);
            item.params = this.getMethodParams(item);
            return item;
        }).filter(item => item)
    }

    private getReturnType(method: MethodDeclaration){
        if(method.getReturnType().isArray()) {
            return method.getReturnType().getTypeArguments()[0].getText();
        } else if(method.getReturnType().isClassOrInterface()){
            return method.getReturnType().getText();
        } else if(method.getReturnType().getSymbol() && method.getReturnType().getSymbol().getName() === 'Promise') {
            return method.getReturnType().getText();
        }
    }

    private getMethodParams(method: MethodDeclaration) {
        const parameters = method.getParameters()

        return parameters.map(param => ({
            name: param.getName(),
            type: this.getParamType(param),
            isArray: param.getType().isArray() || param.getType().isTuple(),
            isRest: param.isRestParameter()
        }));
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

export interface MethodDeclarationRef extends MethodDeclaration {
    name?: string;
    type?: string;
    isArray?: boolean;
    async?: boolean;
    params?: ClassParam[];
    decoratorRefs?: ClassDecoratorRef[];
}