<script>
    import Button from '../general/Button.svelte';
    import Icon from '../icons/Icon.svelte';
    import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
    import { onMount } from 'svelte';

    /**
     * @typedef {Object} Page
     * @property {string} title - The title of the page
     * @property {string} link - The link to the page
     * @property {string} icon - The icon to display in the tab
     */

    /**
     * @typedef {Object} Pages
     * @property {string} title The title of the page
     * @property {string} link The link to the page
     * @property {string} icon The icon to display in the tab
    */

    /**
     * @typedef {Object} Props
     * @property {Pages[]} pages The pages to display in the tabnav
     */

    /**
     * @typedef {Object} OpenPage
     * @property {string} title - The title of the tab
     * @property {string} link - The link to the page
     * @property {string} icon - The icon to display in the tab
     * @property {boolean} active - Whether the tab is currently active
     */

    // Cookie configuration
    const COOKIE_NAME = 'open_pages';
    const COOKIE_EXPIRES_DAYS = 7;

    /** @type {OpenPage[]} */
    let openPages = $state([]);
    let preventNextNavHandler = $state(false);
    /** @type {string} */
    let currentPath = $state('');
    let isInsidePages = $state(false)
    // Track current path for handling special cases

    
    /** @type {Props} */
    let { pages } = $props();

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
    * Deletes a cookie by setting its expiration to the past
    * @param {string} name - The name of the cookie to delete
    * @returns {void}
    */
    function deleteCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    // Load open pages from cookies on component mount
    onMount(() => {
        if (typeof document !== 'undefined') {  // Check if we're in browser environment
            const savedPages = getCookie(COOKIE_NAME);
            if (savedPages) {
                try {
                    openPages = JSON.parse(savedPages);
                    
                    // Set active page based on current path
                    if (currentPath) {
                        openPages = openPages.map(p => ({
                            ...p,
                            active: p.link === currentPath
                        }));
                    }
                } catch (e) {
                    console.error('Error parsing saved pages from cookie:', e);
                    openPages = [];
                }
            }
        }
    });

    // Save to cookies whenever openPages changes
    beforeNavigate(() => {
        if (typeof document !== 'undefined') {
            if (openPages.length > 0) {
                setCookie(COOKIE_NAME, JSON.stringify(openPages), COOKIE_EXPIRES_DAYS);
            } else {
                deleteCookie(COOKIE_NAME);
            }
        }
    });

    afterNavigate((r) => {
        // Skip this handler if we just closed a tab and navigated elsewhere
        if (preventNextNavHandler) {
            preventNextNavHandler = false;
            return;
        }

        let route = r?.to?.url?.pathname;
        currentPath = route || '';
        console.log("route", route)
        isInsidePages = pages.some(p => p.link === route);
        console.log("isInsidePages", isInsidePages)
        if (route) {
            let page = pages.find(p => p.link === route);
            if (page) {
                // First, update active status without changing order
                openPages = openPages.map(p => ({
                    ...p,
                    active: p.link === page.link
                }));
                
                // Then check if the page exists
                const pageExists = openPages.some(p => p.link === page.link);
                
                // If it doesn't exist, add it to the end with active status
                if (!pageExists) {
                    const newPage = {
                        ...page,
                        active: true
                    };
                    openPages = [...openPages, newPage];
                }
            }
        }
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
        
        // Set flag to prevent afterNavigate from adding the page back
        preventNextNavHandler = true;
        
        // Update the openPages state
        openPages = updatedPages;

        console.log("isactive", isActive)
        // Handle navigation if the closed tab was active
        if (isActive) {
            if (updatedPages.length > 0) {
                // Navigate to the first remaining tab
                console.log("Navigating to:", updatedPages[0].link);
                goto(updatedPages[0].link, { replaceState: true, invalidateAll: true });
                updatedPages[0].active = true;
            } else {
                // If no tabs left, navigate to home
                console.log("navigationg to home")
                goto("/");
            }
        }
    }
</script>

{#if openPages.length > 0 && isInsidePages}
    <div class="tabnav">
        {#each openPages as page}
            <div class="tabnav--tab" class:active={page.active}>
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
    </div>
{/if}