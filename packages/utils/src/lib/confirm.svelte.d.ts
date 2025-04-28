export default confirm;
export type ConfirmProps = {
    /**
     * - The title of the confirm dialog
     */
    title: string;
    /**
     * - The main message text
     */
    text: string;
    /**
     * - Icon to display
     */
    icon?: boolean | undefined;
    /**
     * - Additional information text
     */
    info?: string | undefined;
    /**
     * - Text for the confirm button
     */
    confirmText?: string | undefined;
    /**
     * - Text for the cancel button
     */
    cancelText?: string | undefined;
    /**
     * - Position of the dialog
     */
    position?: string | undefined;
    /**
     * - Animation type
     */
    transition?: "bounce" | "slide" | "fade" | undefined;
    /**
     * - Duration of the transition animation
     */
    transitionDuration?: number | undefined;
};
/**
 * Creates and shows a confirm dialog
 * @param {Partial<ConfirmProps>|string} configOrText - Configuration object or text string
 * @returns {Promise<boolean>} A promise that resolves to true if confirmed, false otherwise
 */
declare function confirm(configOrText?: Partial<ConfirmProps> | string): Promise<boolean>;
