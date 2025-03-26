<script>
    import Button from '../general/Button.svelte';
    import Icon from '../icons/Icon.svelte';
    import { afterNavigate, goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import Sortable from 'sortablejs';
    
    /**
     * @typedef {Object} PageItem
     * @property {string} title - The title of the page
     * @property {string} link - The link to the page
     * @property {string} icon - The icon to display in the tab
     * @property {boolean} [active] - Whether the page is currently active
     */


    /**
     * @typedef {Object} Props
     * @property {PageItem[]} pages The pages to display in the tabnav
     */


    // Cookie configuration
    const COOKIE_NAME = 'open_pages';
    const COOKIE_EXPIRES_DAYS = 7;

    /** @type {PageItem[]} */
    let openPages = $state([]);

    
    /** @type {Props} */
    let { pages } = $props();

    /**
     * The sortable element reference
     * @type {HTMLElement}
     */
    let sortableEl;

    /**
     * Sets a cookie with the specified name, value, and expiration days
     * @param {string} name - The name of the cookie
     * @param {string} value - The value to store in the cookie
     * @param {number} days - Number of days until cookie expiration
     * @returns {void}
     */
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "; expires=" + date.toUTCString();
        document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; SameSite=Strict";
    }

    /**
     * Gets a cookie value by name
     * @param {string} name - The name of the cookie to retrieve
     * @returns {string|null} - The cookie value or null if not found
     */
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }
    
    /**
    * Initializes the open pages state
     * @param {string} path - The current path
     */
    function initialize(path) {
        let cookiePages = getCookie(COOKIE_NAME);
        /**
         * @type {PageItem[]}
         */
        let parsed = [];
        if (cookiePages) {
            parsed = JSON.parse(cookiePages);
        }
        // Check if the current path is already in the open pages
        const exists = parsed.some(p => p.link === path);
        if (!exists) {
            // Add the current page to the open pages
            const page = pages.find(p => p.link === path);
            if (page) {
                parsed.push({
                    title: page.title,
                    link: page.link,
                    icon: page.icon,
                    active: true
                });
            }
        }

            parsed = parsed.map(p => {
                p.active = p.link === path;
                return p;
            });
            setCookie(COOKIE_NAME, JSON.stringify(parsed), COOKIE_EXPIRES_DAYS);
            openPages = parsed;
    }

    // Load open pages from cookies on component mount
    onMount(() => {
        if (sortableEl) {
            Sortable.create(sortableEl, {
                group: {
                    name: 'sortableEl',
                    put: false
                },
                ghostClass: 'sortable-ghost',
                animation: 200,
                onEnd: () => {
                    /**
                     * Array of tab elements from the DOM
                     * @type {Array<HTMLDivElement>}
                     */
                    const tabs = Array.from(sortableEl.querySelectorAll('.tabnav--tab'));

                                        /**
                     * Array of link URLs extracted from tab elements' data attributes
                     * @type {Array<string>}
                     */
                    const newOrder = tabs.map(tab => /** @type {string} */ (tab.dataset.link));
                    
                    const newPages = newOrder.map(link => 
                        openPages.find(p => p.link === link)
                    ).filter(Boolean); // Filter out any undefined items
                                        
                    try {
                        // Update cookie with the new order
                        setCookie(COOKIE_NAME, JSON.stringify(newPages), COOKIE_EXPIRES_DAYS);
                    } catch (e) {
                        console.error('Error updating open pages:', e);
                    }
                }
            })
        }
    });


    afterNavigate((r) => {
        let path = r?.to?.url?.pathname
        let isInPages = pages.some(p => p.link === path)
        if(path && isInPages) initialize(path)
    });

    /**
     * Removes a page tab and handles navigation
     * @param {Event} e - The click event
     * @param {string} link - The link of the page to close
     * @returns {Promise<void>}
     */
     async function closePage(e, link) {
        e.preventDefault();
        e.stopPropagation();
        // Check if the page being closed is active
        const isActive = openPages.find(p => p.link === link)?.active || false;

        // Remove the page from openPages
        const updatedPages = openPages.filter(p => p.link !== link);

        // Update the openPages state
        openPages = updatedPages;

        setCookie(COOKIE_NAME, JSON.stringify(updatedPages), COOKIE_EXPIRES_DAYS);

        // Handle navigation if the closed tab was active
        if (isActive) {
            if (updatedPages.length > 0) {
                // Navigate to the first remaining tab
                goto(updatedPages[0].link, { replaceState: true, invalidateAll: true });
                updatedPages[0].active = true;
            } else {
                // If no tabs left, navigate to home
                goto("/");
            }
        }
    }
</script>

<div class="tabnav" bind:this={sortableEl} class:invisible={openPages.length === 0}>
        {#if openPages.length > 0}
        {#each openPages as page}
            <div class="tabnav--tab" class:active={page.active} data-link={page.link}>
                <Button class="tabnav--tab-button" thin size="small" color="transparent" link url={page.link}>
                    <Icon icon={page.icon} size="small" />
                    {page.title}
                    <button 
                        data-close-url={page.link}
                        class="close" 
                        onclick={(e) => closePage(e, page.link)}>
                        <Icon icon="mdi:close" size="extra-small" color="#696a6b" />
                    </button>
                </Button>
            </div>
        {/each}
        {/if}
    </div>

