<script>
    import Button from '../general/Button.svelte';
    import Dropdown from '../general/Dropdown.svelte';
    import DropdownContent from '../general/DropdownContent.svelte';
    import Icon from '../icons/Icon.svelte';
    import { afterNavigate, goto } from '$app/navigation';
    import { onMount } from 'svelte';
    
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
     * The container element reference
     * @type {HTMLElement}
     */
    let containerEl;


    /**
     * Tabs that fit in the visible container
     * @type {PageItem[]}
     */
    let visibleTabs = $state([]);

    /**
     * Tabs that don't fit in the visible container and should be shown in dropdown
     * @type {PageItem[]}
     */
    let overflowTabs = $state([]);

    /**
     * Width of the dropdown button
     * @type {number}
     */
    const DROPDOWN_WIDTH = 50; // in pixels

    /**
     * Gap between tabs
     * @type {number}
     */
    const TAB_GAP = 8; // in pixels

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
        // Initial calculation
        calculateVisibleTabs();
        
        // Set up resize observer to recalculate on container resize
        const resizeObserver = new ResizeObserver(() => {
            calculateVisibleTabs();
        });
        
        if (containerEl) {
            resizeObserver.observe(containerEl);
        }
        
        return () => {
            if (containerEl) {
                resizeObserver.unobserve(containerEl);
            }
        };
    });

    /**
     * Calculates which tabs should be visible and which should go to overflow dropdown
     */
    function calculateVisibleTabs() {
        if (!containerEl || openPages.length === 0) {
            visibleTabs = [];
            overflowTabs = [];
            return;
        }
        
        const containerWidth = containerEl.offsetWidth;
        
        // Handle simple case first - just show all tabs if we have a small number
        if (openPages.length <= 3) {
            visibleTabs = [...openPages];
            overflowTabs = [];
            return;
        }
        
        // Create temporary elements to measure actual tab widths
        const tempContainer = document.createElement('div');
        tempContainer.style.visibility = 'hidden';
        tempContainer.style.position = 'absolute';
        tempContainer.style.top = '-9999px';
        tempContainer.className = 'tabnav';
        document.body.appendChild(tempContainer);
        
        // For each page, create a temporary tab to measure its width
        const tabWidths = [];
        for (let i = 0; i < openPages.length; i++) {
            const tempTab = document.createElement('div');
            tempTab.className = 'tabnav--tab';
            tempTab.style.maxWidth = ''; // Let it size naturally
            tempTab.innerHTML = `
                <div class="tabnav--tab-button">
                    <span style="width: 24px;"></span>
                    <span class="tab-title">${openPages[i].title}</span>
                    <span style="width: 24px;"></span>
                </div>
            `;
            tempContainer.appendChild(tempTab);
            tabWidths.push(tempTab.offsetWidth + TAB_GAP); // Add gap
        }
        
        // Clean up temp elements
        document.body.removeChild(tempContainer);
        
        // Determine how many tabs can fit based on actual widths
        let availableWidth = containerWidth;
        let visibleCount = 0;
        let widthSum = 0;
        let needsDropdown = false;
        
        // First pass - see if we need a dropdown
        for (let i = 0; i < tabWidths.length; i++) {
            widthSum += tabWidths[i];
        }
        
        if (widthSum > availableWidth) {
            // Need dropdown, reduce available width
            availableWidth -= DROPDOWN_WIDTH;
            needsDropdown = true;
        }
        
        // Second pass - calculate how many tabs can fit
        widthSum = 0;
        for (let i = 0; i < tabWidths.length; i++) {
            if (widthSum + tabWidths[i] <= availableWidth) {
                widthSum += tabWidths[i];
                visibleCount++;
            } else {
                break;
            }
        }
        
        // Always show at least one tab
        visibleCount = Math.max(1, visibleCount);
        
        if (needsDropdown && visibleCount >= openPages.length) {
            // Edge case - we thought we'd need a dropdown, but turns out we don't
            visibleCount = openPages.length;
            needsDropdown = false;
        }
        
        // Update the state
        visibleTabs = openPages.slice(0, visibleCount);
        overflowTabs = needsDropdown ? openPages.slice(visibleCount) : [];

    }

    /**
     * Handle visibility detection using resize observer
     * @param {HTMLElement} node - The node to observe
     */
    function handleVisible(node) {
        // Set containerEl to enable calculations
        containerEl = node;
        calculateVisibleTabs();
    }

    afterNavigate((r) => {
        let path = r?.to?.url?.pathname
        let isInPages = pages.some(p => p.link === path)
        if(path && isInPages) {
            initialize(path);
            calculateVisibleTabs();
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

        // After state update, recalculate visible tabs
        setTimeout(calculateVisibleTabs, 0);
    }
</script>

<div class="tabnav" class:invisible={openPages.length === 0} use:handleVisible>
    {#if openPages.length > 0}
        <!-- Visible tabs -->
        {#each visibleTabs as page}
            <div class="tabnav--tab" class:active={page.active} data-link={page.link}>
                <Button class="tabnav--tab-button" thin size="small" color="transparent" link url={page.link}>
                    <Icon icon={page.icon} size="small" />
                    <span class="tab-title">{page.title}</span>
                    <button 
                        data-close-url={page.link}
                        class="close" 
                        onclick={(e) => closePage(e, page.link)}>
                        <Icon icon="mdi:close" size="extra-small" color="#696a6b" />
                    </button>
                </Button>
            </div>
        {/each}
        
        <!-- Dropdown for overflow tabs -->
        {#if overflowTabs.length > 0}
            <div class="tabnav--more">
                <Dropdown>
                    <Button dropdown size="small" square color="transparent">
                        <Icon icon="mdi:dots-horizontal" width="24" height="24" />
                    </Button>
                    <DropdownContent>
                        {#each overflowTabs as page}
                            <div class="tabnav--dropdown-item" class:active={page.active}>
                                <Button 
                                    class="tabnav--dropdown-button" 
                                    thin 
                                    size="small" 
                                    color="transparent" 
                                    link 
                                    url={page.link}
                                >
                                    <Icon icon={page.icon} size="small" />
                                    <span>{page.title}</span>
                                    <button 
                                        data-close-url={page.link}
                                        class="close" 
                                        onclick={(e) => closePage(e, page.link)}>
                                        <Icon icon="mdi:close" size="extra-small" color="#696a6b" />
                                    </button>
                                </Button>
                            </div>
                        {/each}
                    </DropdownContent>
                </Dropdown>
            </div>
        {/if}
    {/if}
</div>

