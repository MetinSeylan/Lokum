import {Decoratable} from "../Interfaces/Decoratable";
import {ClassDeclaration, Node, SyntaxKind} from "ts-morph";
import {ClassDecoratorRef} from "../Visitors/ClassVisitor/DecoratorVisitor";
import {AbstractDecorator} from "./AbstractDecorator";

export class Service extends AbstractDecorator implements Decoratable {
    public readonly name = Service.name;

    validateNode(node: Node, classDecoratorRefs: ClassDecoratorRef[]) {
        this.validateClassType(node);
        this.validateExportedClass(node as ClassDeclaration);
        this.validateMultipleTimeUsage(classDecoratorRefs, node as ClassDeclaration);
        this.validateUniqueDecorator(classDecoratorRefs, node as ClassDeclaration);
        this.validateNotAbstract(node as ClassDeclaration);
        this.validateOnlyOneConstructor(node as ClassDeclaration);
    }
}
