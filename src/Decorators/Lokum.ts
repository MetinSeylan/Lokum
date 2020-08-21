import {Decoratable} from "../Interfaces/Decoratable";
import {AbstractDecorator} from "./AbstractDecorator";
import {MethodDeclaration} from "ts-morph";
import {Service} from "./Service";
import {Configuration} from "./Configuration";
import {ClassDeclarationRef} from "../Visitors/ClassVisitor/ClassVisitor";

export class Lokum extends AbstractDecorator implements Decoratable {
    public readonly name = Lokum.name;

    validateNode(node) {
        this.validateMethodType(node);
        this.validateNotAbstractMethod(node);
        this.validateNotStaticMethod(node);
        this.validateNotGeneratorMethod(node);
        this.validateClassDecorator(node);
    }

    private validateClassDecorator(node: MethodDeclaration){
        const decoratorRefs = (node.getParent() as ClassDeclarationRef).decoratorRefs;
        const exist = decoratorRefs.find(item => item.reference.name === Service.name || item.reference.name === Configuration.name);
        if(!exist) {
            this.logger.error(this.name + ' should be in @Configuration or @Service decorated class', {
                file: node.getSourceFile().getFilePath(),
            });
            process.exit(0);
        }
    }
}
