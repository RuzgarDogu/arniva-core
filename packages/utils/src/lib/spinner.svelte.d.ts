export default spinner;
export type SpinnerConfigProps = {
    /**
     * - Position of the spinner
     */
    position?: "fixed" | "absolute" | "relative" | undefined;
    /**
     * - Whether to show a backdrop (only for fixed and absolute)
     */
    showBackdrop?: boolean | undefined;
    /**
     * - Additional CSS classes to add to the spinner
     */
    className?: string | undefined;
    /**
     * - Custom ID for the spinner (if not provided, will be generated from name)
     */
    id?: string | undefined;
    /**
     * - Type of spinner (default or crescent)
     */
    type?: string | undefined;
    /**
     * - Container element or selector to append the spinner to (defaults to body)
     */
    container?: string | HTMLElement | null | undefined;
    /**
     * - Optional text to display with the spinner
     */
    text?: string | undefined;
    /**
     * - Whether to adapt the spinner size to its container
     */
    adaptSize?: boolean | undefined;
    /**
     * - Factor to multiply container dimensions (0-1, default 0.6)
     */
    sizeFactor?: number | undefined;
    /**
     * - Minimum size in pixels
     */
    minSize?: number | undefined;
    /**
     * - Maximum size in pixels
     */
    maxSize?: number | undefined;
    /**
     * - Margin to subtract from container dimensions
     */
    sizeMargin?: number | undefined;
    /**
     * - Color of the spinner's moving part
     */
    color?: string | undefined;
    /**
     * - Color of the spinner's background/track
     */
    backgroundColor?: string | undefined;
    /**
     * - Color of the backdrop (when showBackdrop is true)
     */
    backdropColor?: string | undefined;
    /**
     * - Opacity of the backdrop (0-1)
     */
    backdropOpacity?: number | undefined;
};
declare namespace spinner {
    export { showSpinner as show };
    export { hideSpinner as hide };
    export { hideSpinnerById as hideById };
    export { getActiveSpinners as getActive };
}
/**
 * Creates and shows a spinner with the given name and configuration
 * @param {string} name - The name identifier for the spinner
 * @param {Partial<SpinnerConfigProps>} [config={}] - Configuration options
 * @returns {string|null} The ID of the created spinner or null if not mounted
 */
declare function showSpinner(name?: string, config?: Partial<SpinnerConfigProps>): string | null;
/**
 * Hides all spinners with the given name
 * @param {string} name - The name identifier of spinners to hide
 */
declare function hideSpinner(name?: string): void;
/**
 * Hides a spinner by its specific ID
 * @param {string} id - The ID of the spinner to hide
 */
declare function hideSpinnerById(id: string): void;
/**
 * Gets all active spinners
 * @returns {Map<string, Array<Spinner>>} Map of active spinners
 */
declare function getActiveSpinners(): Map<string, Array<Spinner>>;
declare class Spinner {
    /**
     * @param {string} name - Name of the spinner
     * @param {SpinnerConfigProps} config - Configuration options
     */
    constructor(name: string, config: SpinnerConfigProps);
    name: string;
    config: {
        /**
         * - Position of the spinner
         */
        position?: "fixed" | "absolute" | "relative" | undefined;
        /**
         * - Whether to show a backdrop (only for fixed and absolute)
         */
        showBackdrop?: boolean | undefined;
        /**
         * - Additional CSS classes to add to the spinner
         */
        className?: string | undefined;
        /**
         * - Custom ID for the spinner (if not provided, will be generated from name)
         */
        id?: string | undefined;
        /**
         * - Type of spinner (default or crescent)
         */
        type?: string | undefined;
        /**
         * - Container element or selector to append the spinner to (defaults to body)
         */
        container?: string | HTMLElement | null | undefined;
        /**
         * - Optional text to display with the spinner
         */
        text?: string | undefined;
        /**
         * - Whether to adapt the spinner size to its container
         */
        adaptSize?: boolean | undefined;
        /**
         * - Factor to multiply container dimensions (0-1, default 0.6)
         */
        sizeFactor?: number | undefined;
        /**
         * - Minimum size in pixels
         */
        minSize?: number | undefined;
        /**
         * - Maximum size in pixels
         */
        maxSize?: number | undefined;
        /**
         * - Margin to subtract from container dimensions
         */
        sizeMargin?: number | undefined;
        /**
         * - Color of the spinner's moving part
         */
        color?: string | undefined;
        /**
         * - Color of the spinner's background/track
         */
        backgroundColor?: string | undefined;
        /**
         * - Color of the backdrop (when showBackdrop is true)
         */
        backdropColor?: string | undefined;
        /**
         * - Opacity of the backdrop (0-1)
         */
        backdropOpacity?: number | undefined;
    };
    element: HTMLDivElement | null;
    backdrop: HTMLDivElement | null;
    id: string;
    /**
     * Resolves the container element from the configuration
     * @returns {HTMLElement|Element|DocumentFragment} The resolved container element or document fragment
     */
    resolveContainer(): HTMLElement | Element | DocumentFragment;
    /**
     * Adapts the spinner size based on container dimensions
     * @param {Element|HTMLElement} container - The container element
     * @param {HTMLElement} spinnerElement - The spinner element
     */
    adaptSpinnerSize(container: Element | HTMLElement, spinnerElement: HTMLElement): void;
    /**
     * Creates the spinner DOM elements
     */
    create(): void;
    /**
     * Adds the spinner to the DOM
     * @returns {boolean} True if spinner was mounted, false otherwise
     */
    mount(): boolean;
    /**
     * Checks if container already has a spinner as a direct child
     * @param {Element|HTMLElement} container - The container to check
     * @returns {boolean} True if container already has a spinner
     */
    hasExistingSpinner(container: Element | HTMLElement): boolean;
    /**
     * Appends spinner to a specific container
     * @param {Element|HTMLElement|DocumentFragment} container - The container to append to
     * @returns {boolean} True if spinner was appended, false if a spinner already exists
     */
    appendToContainer(container: Element | HTMLElement | DocumentFragment): boolean;
    /**
     * Removes the spinner from the DOM
     */
    destroy(): void;
}
