import {SourceCodeFile} from "./SourceCodeFile";

export interface Visitable {
    visit(sourceCodeFile?: SourceCodeFile, any?: any): any;
}