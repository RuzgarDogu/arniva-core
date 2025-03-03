/** @type {import('./$types').PageLoad} */
import { getIconNames } from '$lib'
export async function load() {
    let icon_list = await getIconNames();
    return {
        icon_list
    };
};