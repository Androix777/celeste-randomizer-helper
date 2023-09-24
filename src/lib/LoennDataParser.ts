import { parse } from 'lua-json';

export function parseData(data: string) {
	console.log(parse('return ' + data));
}
