import {ClassDeclaration, MethodDeclaration, Node, SyntaxKind} from "ts-morph";
import {Logger} from "../Logger";
import {ClassDecoratorRef} from "../Visitors/ClassVisitor/DecoratorVisitor";

export abstract class AbstractDecorator {
    abstract name: string;
    protected readonly logger = new Logger();

    protected validateClassType(node: Node){
        if(node.getKind() !== SyntaxKind.ClassDeclaration) {
            this.logger.error(this.name + ' should use for a class:', {
                file: node.getSourceFile().getFilePath(),
            });
            process.exit(0);
        }
    }

    protected validateMethodType(node: Node){
        if(node.getKind() !== SyntaxKind.MethodDeclaration) {
            this.logger.error(this.name + ' should use for a class method:', {
                file: node.getSourceFile().getFilePath(),
            });
            process.exit(0);
        }
    }

    protected validateNotAbstractMethod(node: MethodDeclaration){
        if(node.isAbstract()){
            this.logger.error(this.name + ' should not be abstract method:', {
                file: node.getSourceFile().getFilePath(),
            });
            process.exit(0);
        }
    }

    protected validateNotStaticMethod(node: MethodDeclaration){
        if(node.isStatic()){
            this.logger.error(this.name + ' should not be static method:', {
                file: node.getSourceFile().getFilePath(),
            });
            process.exit(0);
        }
    }

    protected validateNotGeneratorMethod(node: MethodDeclaration){
        if(node.isGenerator()){
            this.logger.error(this.name + ' should not be generator method:', {
                file: node.getSourceFile().getFilePath(),
            });
            process.exit(0);
        }
    }

    protected validateExportedClass(classDeclaration: ClassDeclaration){
        if(!classDeclaration.isExported()) {
            this.logger.error(this.name + ' should use for a exported class:', {
                class: classDeclaration.getName(),
                file: classDeclaration.getSourceFile().getFilePath(),
            });
            process.exit(0);
        }
    }

    protected validateMultipleTimeUsage(classDecoratorRefs: ClassDecoratorRef[], classDeclaration: ClassDeclaration) {
        const count = classDecoratorRefs.filter(item => item.reference.decorator.name === this.name).length;
        if(count > 0) {
            this.logger.error(this.name + ' should use one time for per class:', {
                class: classDeclaration.getName(),
                file: classDeclaration.getSourceFile().getFilePath(),
            });
            process.exit(0);
        }
    }

    protected validateUniqueDecorator(classDecoratorRefs: ClassDecoratorRef[], classDeclaration: ClassDeclaration) {
        const count = classDecoratorRefs.filter(item => item.reference.decorator.name !== this.name).length;
        if(count > 0) {
            this.logger.error(this.name + ' should be use alone:', {
                class: classDeclaration.getName(),
                conflict: classDecoratorRefs.map(item => item.reference.decorator.name).join(', '),
                file: classDeclaration.getSourceFile().getFilePath(),
            });
            process.exit(0);
        }
    }

    protected validateNotAbstract(classDeclaration: ClassDeclaration){
        if(classDeclaration.isAbstract()) {
            this.logger.error(this.name + ' should not use for Abstract Class:', {
                class: classDeclaration.getName(),
                file: classDeclaration.getSourceFile().getFilePath(),
            });
            process.exit(0);
        }
    }

    protected validateOnlyOneConstructor(classDeclaration: ClassDeclaration) {
        if(classDeclaration.getConstructors().length > 1) {
            this.logger.error(this.name + ' class should have only one constructor method:', {
                class: classDeclaration.getName(),
                file: classDeclaration.getSourceFile().getFilePath(),
            });
            process.exit(0);
        }
    }

    protected readArguments(args: Node[]): ServiceArgument {
        if(args.length > 1) {
            this.logger.error(this.name + ' should be have only one argument at:', {
                class: args[0].getFirstAncestorByKind(SyntaxKind.ClassDeclaration).getName(),
                file: args[0].getSourceFile().getFilePath(),
            });
            process.exit(0);
        } else if(args.length === 0) return;
        const argument = args[0];

        if(argument.getKind() === 193) {
            const qualifier = this.findQualifierInObject(argument);
            if(!qualifier) return;
            return {
                qualifier
            }
        } else if(argument.getKind() === 10) {
            return {
                qualifier: argument.compilerNode['text']
            }
        }
    }

    protected findQualifierInObject(argument) {
        let qualifier;
        argument.getChildrenOfKind(281).forEach(item => {
            if(item.getName() === 'qualifier') {
                qualifier = item.getInitializer().compilerNode.text;
            }
        })
        return qualifier;
    }
}

export interface ServiceArgument {
    qualifier: string
}
