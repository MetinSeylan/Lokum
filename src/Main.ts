import * as Manifest from '../package.json';
import * as Minimist from 'minimist';
import {Compiler} from "./Compiler";

const params = Minimist(process.argv.slice(2));

const compiler = new Compiler({
    rootFolder: params.folder,
    packageName: Manifest.name
});

compiler.compile();
