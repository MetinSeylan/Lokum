import {SourceCodeFile} from "./Interfaces/SourceCodeFile";
import {Project} from "ts-morph";
import {Visitor} from "./Visitor";
import {AppContext} from "./Decorators/AppContext";
import {Decoratable} from "./Interfaces/Decoratable";
import {Configuration} from "./Decorators/Configuration";
import {Lokum} from "./Decorators/Lokum";
import {Provide} from "./Decorators/Provide";
import {Service} from "./Decorators/Service";

export class Compiler {
    private readonly rootFolder: string;
    private readonly visitor: Visitor;
    private readonly decorators: Record<string, Decoratable> = {
        AppContext: new AppContext(),
        Configuration: new Configuration(),
        Lokum: new Lokum(),
        Provide: new Provide(),
        Service: new Service()
    }

    private project: Project;
    private sourceCodeFiles: SourceCodeFile[];

    constructor({ rootFolder, packageName }) {
        this.rootFolder = rootFolder;
        this.visitor = new Visitor(packageName, this.decorators);
    }

    public compile(){
        this.project = new Project();
        this.project.addSourceFilesAtPaths(this.rootFolder + "./**/*.ts");
        this.sourceCodeFiles = this.project.getSourceFiles() as SourceCodeFile[];

        this.analyze();
    }

    private analyze() {
        this.visitor.visit(this.sourceCodeFiles)
    }
}