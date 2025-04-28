import { browser } from '$app/environment';

/**
 * @param {string} name
 * @returns {void}
 * */
export function hello(name = 'world') {
	let str = `Hello ${name}`;
	if (browser && alert) alert && alert(str);
}
