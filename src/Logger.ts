import { red, yellow, bold } from 'chalk';

export class Logger {

    error(message: string, params: Record<any, any>) {
        console.error(`${red(message)}\n${this.join(params)}`)
    }

    private join(params: Record<any, any>){
        return Object.keys(params).map(key => ` ${bold(yellow(key))}: ${params[key]}`).join('\n');
    }
}