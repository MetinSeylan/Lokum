import {ImportVisitor} from "../../src/Visitors/ImportVisitor";
import {Service} from "../../src/Decorators/Service";
import {Configuration} from "../../src/Decorators/Configuration";
import {Project} from "ts-morph";
import {SourceCodeFile} from "../../src/Interfaces/SourceCodeFile";

describe('Import Visitor Tests', () => {
    let importVisitor: ImportVisitor;

    const decorators = {
        Service: new Service(),
        Configuration: new Configuration(),
    };

    beforeAll( () => {
        importVisitor = new ImportVisitor(decorators, 'TEST_LOKUM');
    });

    test('should read namespaced imports', () => {
        // given
        const project = new Project();
        const sourceCodeFile = project
            .createSourceFile("test.ts", `import * as namespaced from 'TEST_LOKUM'`) as SourceCodeFile;

        // when
        let result = importVisitor.visit(sourceCodeFile);

        // then
        expect(result).toHaveProperty('Service')
        expect(result.Service).toEqual([ { namespace: 'namespaced', name: 'Service', decorator: decorators.Service } ])
        expect(result).toHaveProperty('Configuration')
        expect(result.Configuration).toEqual([ { namespace: 'namespaced', name: 'Configuration', decorator: decorators.Configuration } ])
    });

    test('should read named imports', () => {
        // given
        const project = new Project();
        const sourceCodeFile = project
            .createSourceFile("test.ts", `import { Service } from 'TEST_LOKUM'`) as SourceCodeFile;

        // when
        let result = importVisitor.visit(sourceCodeFile);

        // then
        expect(result).toHaveProperty('Service')
        expect(result.Service).toEqual([ { name: 'Service', decorator: decorators.Service } ])
        expect(result).toHaveProperty('Configuration')
        expect(result.Configuration).toEqual([])
    });

    test('should read named imports with alias', () => {
        // given
        const project = new Project();
        const sourceCodeFile = project
            .createSourceFile("test.ts", `import { Service as METIN } from 'TEST_LOKUM'`) as SourceCodeFile;

        // when
        let result = importVisitor.visit(sourceCodeFile);

        // then
        expect(result).toHaveProperty('Service')
        expect(result.Service).toEqual([ { name: 'Service', alias: 'METIN', decorator: decorators.Service } ])
        expect(result).toHaveProperty('Configuration')
        expect(result.Configuration).toEqual([])
    });

    test('should read multiple time import with different combination', () => {
        // given
        const project = new Project();
        const sourceCodeFile = project
            .createSourceFile("test.ts", `
            import { Service as METIN } from 'TEST_LOKUM';
            import { Service as SEYLAN } from 'TEST_LOKUM';
            import { Service } from 'TEST_LOKUM';
        `) as SourceCodeFile;

        // when
        let result = importVisitor.visit(sourceCodeFile);

        // then
        expect(result).toHaveProperty('Service')
        expect(result.Service).toEqual([
            { name: 'Service', alias: 'METIN', decorator: decorators.Service },
            { name: 'Service', alias: 'SEYLAN', decorator: decorators.Service },
            { name: 'Service', decorator: decorators.Service },
        ])
        expect(result).toHaveProperty('Configuration')
        expect(result.Configuration).toEqual([])
    });
});
