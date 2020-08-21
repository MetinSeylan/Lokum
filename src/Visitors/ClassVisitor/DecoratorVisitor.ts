import {ClassDeclaration, Decorator, MethodDeclaration} from "ts-morph";
import {DecoratorImportReference} from "../ImportVisitor";


export class DecoratorVisitor {

    public visit(classDeclaration: ClassDeclaration | MethodDeclaration, decorators: Record<string, DecoratorImportReference[]>): ClassDecoratorRef[] {
        let result = [];
        classDeclaration.getDecorators().forEach(item => {
            const structure = item.getStructure();
            let reference;
            let exist;

            for (const key in decorators) {
                decorators[key].forEach(ref => {
                    if(!(ref.alias === structure.name || ref.name === structure.name)) return;
                    reference = ref
                    exist = true;
                });
            }

            if(!exist) return;
            reference.decorator.validateNode(classDeclaration, result);
            result.push({
                node: item,
                reference,
                arguments: reference.decorator.readArguments(item.getArguments())
            })
        });
        return result;
    }

}

export interface ClassDecoratorRef {
    node: Decorator;
    reference: DecoratorImportReference;
    arguments: Record<any, any>;
}
