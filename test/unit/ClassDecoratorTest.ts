import {ImportVisitor} from "../../src/Visitors/ImportVisitor";
import {Service} from "../../src/Decorators/Service";
import {Configuration} from "../../src/Decorators/Configuration";
import {Project} from "ts-morph";
import {SourceCodeFile} from "../../src/Interfaces/SourceCodeFile";
import {ClassVisitor} from "../../src/Visitors/ClassVisitor/ClassVisitor";

describe('Class Decorator Tests', () => {
    let importVisitor: ImportVisitor;
    let classVisitor: ClassVisitor;

    const decorators = {
        Service: new Service(),
        Configuration: new Configuration(),
    };

    beforeAll( () => {
        importVisitor = new ImportVisitor(decorators, 'TEST_LOKUM');
        classVisitor = new ClassVisitor();
    });

    test('should read class decorator', () => {
        // given
        const project = new Project();
        const sourceCodeFile = project.createSourceFile("test.ts", `
            import * as namespaced from 'TEST_LOKUM';
            @Service
            export class TEST_CLASS {}
        `) as SourceCodeFile;

        // when
        sourceCodeFile.decorators = importVisitor.visit(sourceCodeFile);
        sourceCodeFile.classDeclarations = classVisitor.visit(sourceCodeFile);

        // then
        expect(sourceCodeFile.classDeclarations).toHaveLength(1);
        expect(sourceCodeFile.classDeclarations[0].className).toEqual('TEST_CLASS');
        expect(sourceCodeFile.classDeclarations[0]).toHaveProperty('filePath');
        expect(sourceCodeFile.classDeclarations[0].decoratorRefs).toHaveLength(1);
        expect(sourceCodeFile.classDeclarations[0].decoratorRefs[0].reference.name).toEqual('Service');
    });

    test('should throw exception when class is not exported', () => {
        jest.spyOn(process, 'exit').mockImplementation(() => {throw 'exit'});
        jest.spyOn(console, 'error').mockImplementation();

        // given
        const project = new Project();
        const sourceCodeFile = project.createSourceFile("test.ts", `
            import * as namespaced from 'TEST_LOKUM';
            @Service
            class TEST_CLASS {}
        `) as SourceCodeFile;

        const when = () => {
            sourceCodeFile.decorators = importVisitor.visit(sourceCodeFile);
            sourceCodeFile.classDeclarations = classVisitor.visit(sourceCodeFile);
        }

        // then
        expect(when).toThrow('exit');
    });

    test('should throw exception when class is abstract', () => {
        jest.spyOn(process, 'exit').mockImplementation(() => {throw 'exit'});
        jest.spyOn(console, 'error').mockImplementation();

        // given
        const project = new Project();
        const sourceCodeFile = project.createSourceFile("test.ts", `
            import * as namespaced from 'TEST_LOKUM';
            @Service
            export abstract class TEST_CLASS {}
        `) as SourceCodeFile;

        const when = () => {
            sourceCodeFile.decorators = importVisitor.visit(sourceCodeFile);
            sourceCodeFile.classDeclarations = classVisitor.visit(sourceCodeFile);
        }

        // then
        expect(when).toThrow('exit');
    });

    test('should throw exception when decorator multiple time used', () => {
        jest.spyOn(process, 'exit').mockImplementation(() => {throw 'exit'});
        jest.spyOn(console, 'error').mockImplementation();

        // given
        const project = new Project();
        const sourceCodeFile = project.createSourceFile("test.ts", `
            import * as namespaced from 'TEST_LOKUM';
            @Service
            @Service()
            export class TEST_CLASS {}
        `) as SourceCodeFile;

        const when = () => {
            sourceCodeFile.decorators = importVisitor.visit(sourceCodeFile);
            sourceCodeFile.classDeclarations = classVisitor.visit(sourceCodeFile);
        }

        // then
        expect(when).toThrow('exit');
    });

    test('should throw exception when high leven decorator conflict', () => {
        jest.spyOn(process, 'exit').mockImplementation(() => {throw 'exit'});
        jest.spyOn(console, 'error').mockImplementation();

        // given
        const project = new Project();
        const sourceCodeFile = project.createSourceFile("test.ts", `
            import * as namespaced from 'TEST_LOKUM';
            @Service
            @Configuration
            export class TEST_CLASS {}
        `) as SourceCodeFile;

        const when = () => {
            sourceCodeFile.decorators = importVisitor.visit(sourceCodeFile);
            sourceCodeFile.classDeclarations = classVisitor.visit(sourceCodeFile);
        }

        // then
        expect(when).toThrow('exit');
    });

    test('should throw exception when class has multiple constructor', () => {
        jest.spyOn(process, 'exit').mockImplementation(() => {throw 'exit'});
        jest.spyOn(console, 'error').mockImplementation();

        // given
        const project = new Project();
        const sourceCodeFile = project.createSourceFile("test.ts", `
            import * as namespaced from 'TEST_LOKUM';
            @Service
            export class TEST_CLASS {
                constructor(){}
                constructor(a: string){}
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
