import {ImportVisitor} from "../../src/Visitors/ImportVisitor";
import {Service} from "../../src/Decorators/Service";
import {Configuration} from "../../src/Decorators/Configuration";
import {Project} from "ts-morph";
import {SourceCodeFile} from "../../src/Interfaces/SourceCodeFile";
import {ClassVisitor} from "../../src/Visitors/ClassVisitor/ClassVisitor";
import {Lokum} from "../../src/Decorators/Lokum";
import {AppContext} from "../../src/Decorators/AppContext";

describe('Method Decorator Tests', () => {
    let importVisitor: ImportVisitor;
    let classVisitor: ClassVisitor;

    const decorators = {
        Service: new Service(),
        Configuration: new Configuration(),
        AppContext: new AppContext(),
        Lokum: new Lokum(),
    };

    beforeAll( () => {
        importVisitor = new ImportVisitor(decorators, 'TEST_LOKUM');
        classVisitor = new ClassVisitor();
    });

    test('should read method decorator', () => {
        // given
        const project = new Project();
        const sourceCodeFile = project.createSourceFile("test.ts", `
            import * as namespaced from 'TEST_LOKUM';
            @Service
            export class TEST_CLASS {
                @Lokum
                hello(){}
            }
        `) as SourceCodeFile;

        // when
        sourceCodeFile.decorators = importVisitor.visit(sourceCodeFile);
        sourceCodeFile.classDeclarations = classVisitor.visit(sourceCodeFile);

        // then
        expect(sourceCodeFile.classDeclarations[0].methods).toHaveLength(1);
        expect(sourceCodeFile.classDeclarations[0].methods[0].name).toEqual('hello');
        expect(sourceCodeFile.classDeclarations[0].methods[0].async).toEqual(false);
        expect(sourceCodeFile.classDeclarations[0].methods[0].type).toBeUndefined();
        expect(sourceCodeFile.classDeclarations[0].methods[0].decoratorRefs[0].reference.name).toEqual('Lokum');
    });

    test('should throw exception when method is abstract ', () => {
        jest.spyOn(process, 'exit').mockImplementation(() => {throw 'exit'});
        jest.spyOn(console, 'error').mockImplementation();

        // given
        const project = new Project();
        const sourceCodeFile = project.createSourceFile("test.ts", `
            import * as namespaced from 'TEST_LOKUM';
            @Service
            export class TEST_CLASS {
                @Lokum
                abstract hello(){}
            }
        `) as SourceCodeFile;

        const when = () => {
            sourceCodeFile.decorators = importVisitor.visit(sourceCodeFile);
            sourceCodeFile.classDeclarations = classVisitor.visit(sourceCodeFile);
        }

        // then
        expect(when).toThrow('exit');
    });

    test('should throw exception when method is static', () => {
        jest.spyOn(process, 'exit').mockImplementation(() => {throw 'exit'});
        jest.spyOn(console, 'error').mockImplementation();

        // given
        const project = new Project();
        const sourceCodeFile = project.createSourceFile("test.ts", `
            import * as namespaced from 'TEST_LOKUM';
            @Service
            export class TEST_CLASS {
                @Lokum
                static hello(){}
            }
        `) as SourceCodeFile;

        const when = () => {
            sourceCodeFile.decorators = importVisitor.visit(sourceCodeFile);
            sourceCodeFile.classDeclarations = classVisitor.visit(sourceCodeFile);
        }

        // then
        expect(when).toThrow('exit');
    });

    test('should throw exception when method is generator', () => {
        jest.spyOn(process, 'exit').mockImplementation(() => {throw 'exit'});
        jest.spyOn(console, 'error').mockImplementation();

        // given
        const project = new Project();
        const sourceCodeFile = project.createSourceFile("test.ts", `
            import * as namespaced from 'TEST_LOKUM';
            @Service
            export class TEST_CLASS {
                @Lokum
                *hello(){}
            }
        `) as SourceCodeFile;

        const when = () => {
            sourceCodeFile.decorators = importVisitor.visit(sourceCodeFile);
            sourceCodeFile.classDeclarations = classVisitor.visit(sourceCodeFile);
        }

        // then
        expect(when).toThrow('exit');
    });

    test('should throw exception when @Lokum under wrong decorator class', () => {
        jest.spyOn(process, 'exit').mockImplementation(() => {throw 'exit'});
        jest.spyOn(console, 'error').mockImplementation();

        // given
        const project = new Project();
        const sourceCodeFile = project.createSourceFile("test.ts", `
            import * as namespaced from 'TEST_LOKUM';
            @AppContext
            export class TEST_CLASS {
                @Lokum
                hello(){}
            }
        `) as SourceCodeFile;

        const when = () => {
            sourceCodeFile.decorators = importVisitor.visit(sourceCodeFile);
            sourceCodeFile.classDeclarations = classVisitor.visit(sourceCodeFile);
        }

        // then
        expect(when).toThrow('exit');
    });

});
