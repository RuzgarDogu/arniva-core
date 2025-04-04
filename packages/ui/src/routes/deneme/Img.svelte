<script>

    /**
     * @typedef {Object} Props
     * @property {string} [src] - The image URL
     * @property {string} [srcset] - The image URL for different resolutions
     * @property {string} [sizes] - The image sizes for different viewports
     * @property {string} [class] - Additional CSS classes
     * @property {string} [fallback] - The fallback image URL
     * @property {string} [alt] - The image alt text
     * @property {boolean} [lazy] - Whether to lazy load the image
     * @property {boolean} [fluid] - Whether to make the image fluid
     * @property {boolean} [webp] - Whether to use WebP format
     * @property {string} [caption] - The image caption
     * @property {string | null} [aspectRatio] - The aspect ratio of the image (e.g., "16:9")
     * @property {string} [objectFit] - The object-fit CSS property
     * @property {string} [objectPosition] - The object-position CSS property
     * @property {"auto" | "high" | "low"} [fetchpriority] - The image fetch priority
     * @property {"async" | "sync" | "auto"} [decoding] - The image decoding method
     * @property {number|string} [width] - The image width
     * @property {number|string} [height] - The image height
     * @property {Record<string, any>} [rest] - Additional attributes
     */
    
    /** @type {Props} */
    let { 
        src = '',
        srcset = '',
        sizes = '',
        class:cls = '',
        fallback = '/placeholder.png', 
        alt = "Web Image", 
        lazy = false,
        fluid = false,
        webp = false,
        caption = '',
        aspectRatio = null,
        objectFit = 'cover',
        objectPosition = 'center',
        fetchpriority = 'auto',
        decoding = 'async',
        width,
        height,
        ...rest 
    } = $props();
    
    // Track states
    let isMainImageLoaded = $state(false);
    let showMainImage = $state(false);
    let isPlaceholderLoading = $state(true);
    
    const loadingAttr = lazy ? 'lazy' : 'eager';
    
    // Generate WebP path if enabled and src has appropriate extension
    let webpSrc = $derived(webp && src ? src.replace(/\.(jpe?g|png)$/i, '.webp') : null);
    
    /**
     * Helper to parse aspect ratio string (e.g., "16:9" -> 0.5625)
     * @param {string|null} ratio - The aspect ratio string in format "width:height"
     * @returns {number|null} - The calculated ratio as a decimal, or null if no valid ratio
     */
    function parseAspectRatio(ratio) {
        if (!ratio) return null;
        const parts = ratio.split(':').map(Number);
        if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1]) || parts[0] === 0) {
            return null;
        }
        return parts[1] / parts[0];
    }
    
    // Calculate padding based on aspect ratio for maintaining image dimensions
    // Using a null check to satisfy TypeScript
    let paddingBottom = $derived(() => {
        const ratio = parseAspectRatio(aspectRatio);
        return ratio !== null ? `${(ratio * 100)}%` : null;
    });
    
    // Handle placeholder load completion
    function handlePlaceholderLoad() {
        isPlaceholderLoading = false;
    }
    
    $effect(() => {
        if (src) {
            const mainImage = new Image();
            mainImage.onload = () => {
                isMainImageLoaded = true;
                showMainImage = true;
            };
            mainImage.onerror = () => {
                isMainImageLoaded = false;
            };
            mainImage.src = src;
            
            // Also preload WebP version if enabled
            if (webpSrc) {
                const webpImage = new Image();
                webpImage.src = webpSrc;
            }
        }
    });
</script>

<figure class="img-figure">
    <div class="img-container" class:has-ratio={!!aspectRatio}>
        <div 
            class="img-wrapper"
            style={paddingBottom ? `padding-bottom: ${paddingBottom};` : ''}
        >
            <!-- Always start by showing the placeholder/fallback image -->
            <img 
                src={fallback}
                {alt}
                class={`placeholder ${cls}`}
                class:image-fluid={fluid && !width}
                class:loading={isPlaceholderLoading}
                class:hidden={showMainImage}
                loading={loadingAttr}
                {decoding}
                {fetchpriority}
                {width}
                {height}
                aria-hidden={!!caption || showMainImage}
                style={`object-fit: ${objectFit}; object-position: ${objectPosition};`}
                onload={handlePlaceholderLoad}
                {...rest}
            />

            <!-- Show the main image only after it's loaded -->
            {#if isMainImageLoaded}
                {#if webpSrc}
                    <picture>
                        <source srcset={webpSrc} type="image/webp">
                        <img 
                            src={src}
                            {srcset}
                            {sizes}
                            {alt}
                            class={cls}
                            class:image-fluid={fluid && !width}
                            class:visible={showMainImage}
                            loading={loadingAttr}
                            {decoding}
                            {fetchpriority}
                            {width}
                            {height}
                            aria-hidden={!!caption}
                            style={`object-fit: ${objectFit}; object-position: ${objectPosition};`}
                            {...rest}
                        />
                    </picture>
                {:else}
                    <img 
                        src={src}
                        {srcset}
                        {sizes}
                        {alt}
                        class={cls}
                        class:image-fluid={fluid && !width}
                        class:visible={showMainImage}
                        loading={loadingAttr}
                        {decoding}
                        {fetchpriority}
                        {width}
                        {height}
                        aria-hidden={!!caption}
                        style={`object-fit: ${objectFit}; object-position: ${objectPosition};`}
                        {...rest}
                    />
                {/if}
            {/if}
        </div>
    </div>
    
    <!-- Optional caption -->
    {#if caption}
        <figcaption>{caption}</figcaption>
    {/if}
</figure>

<style>
    .img-figure {
        margin: 0;
        padding: 0;
        width: 100%;
        display: block;
    }
    
    .img-container {
        display: block;
        width: 100%;
    }
    
    .img-container.has-ratio {
        width: 100%;
    }
    
    .img-wrapper {
        position: relative;
        width: 100%;
    }
    
    .has-ratio .img-wrapper {
        height: 0; /* Height determined by padding-bottom */
        overflow: hidden;
    }
    
    .has-ratio img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    
    img {
        display: block;
        max-width: 100%;
        transition: opacity 0.3s ease;
    }
    
    .image-fluid {
        width: 100%;
    }
    
    .hidden {
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
    }
    
    .visible {
        opacity: 1;
    }
    
    figcaption {
        font-size: 0.9rem;
        margin-top: 0.5rem;
        color: #555;
        text-align: center;
    }
    
    /* Subtle pulse animation for loading state */
    @keyframes pulse {
        0% { opacity: 0.7; }
        50% { opacity: 1; }
        100% { opacity: 0.7; }
    }
    
    .loading {
        animation: pulse 1.5s infinite;
    }
    
    .placeholder {
        background-color: #f0f0f0;
    }
</style>