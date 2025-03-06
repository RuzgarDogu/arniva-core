<script>
  /**
   * @typedef {Object} Props
   * @property {'single' | 'range'} [type]
   * @property {number} [min]
   * @property {number} [max]
   * @property {'primary' | 'secondary' | 'accent' | 'warning' | 'danger' | 'success'} [color]
   * @property {(value: number | { start: number, end: number }) => void} [onChange]
   * @property {string} [class]
   * @property {any} [rest]
   */

  /** @type {Props} */
  let { 
    type = 'single',  // 'single' or 'range'
    min = 0,
    max = 99,
    color = 'primary',
    class:cls = '',
    onChange
  } = $props();
  

	export function reset() {
		startValue = min;
    endValue = max;
	}

  // Initial values
  let startValue = $state(min);
  let endValue = $state(max);
  
  // DOM references
  /** @type {HTMLElement} */
  let track;
  
  // Track dimensions and state
  let isDragging = $state(false);
  /** @type {null | 'start' | 'end'} */
  let activeDot = $state(null);
  let trackWidth = $state(0);
  let trackLeft = $state(0);
  
  /** @type {number} */
  let initialDragStartValue;
  /** @type {number} */
  let initialDragEndValue;

  // Use $derived syntax
  let startPercent = $derived(((startValue - min) / (max - min)) * 100);
  let endPercent = $derived(((endValue - min) / (max - min)) * 100);
  
  /**
   * @type {number | { start: number, end: number }}
   */
   let value = $derived(type === 'single' ? startValue : { start: startValue, end: endValue });
  
  // Handle drag with use:directive
  /**
   * @param {HTMLElement} node
   */
  function handleDrag(node) {
    const updateTrackDimensions = () => {
      if (track) {
        const rect = track.getBoundingClientRect();
        trackWidth = rect.width;
        trackLeft = rect.left;
      }
    };
    
    updateTrackDimensions();
    
    /**
     * @param {MouseEvent | Touch} event
     * @param {'start' | 'end'} handle
     */
    const handleMouseDown = (event, handle) => {
      isDragging = true;
      activeDot = handle;
      // Capture current values at the start of dragging
      initialDragStartValue = startValue;
      initialDragEndValue = endValue;
      updateHandlePosition(event);
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
    };
    
    /**
     * @param {MouseEvent | TouchEvent} event
     */
    const handleMouseMove = (event) => {
      if (!isDragging) return;
      
      // For MouseEvent, pass directly; for TouchEvent, extract the Touch object
      if ('touches' in event && event.touches[0]) {
        // Here we extract the Touch object which matches the expected type
        updateHandlePosition(event.touches[0]);
      } else {
        // If it's not a TouchEvent, it must be a MouseEvent
        updateHandlePosition(/** @type {MouseEvent} */ (event));
      }
    };
    
    /**
     * @param {TouchEvent} event
     */
    const handleTouchMove = (event) => {
      if (!isDragging) return;
      
      if (event.touches && event.touches[0]) {
        updateHandlePosition(event.touches[0]);
        event.preventDefault(); // Prevent scrolling while dragging
      }
    };
    
    /**
     * Clean up event listeners when dragging stops
     */
     const handleMouseUp = () => {
      if (isDragging && onChange && value !== undefined) {
        // Check if values changed during THIS drag operation
        let valueChanged;
        
        if (type === 'single') {
          valueChanged = startValue !== initialDragStartValue;
        } else {
          valueChanged = (
            startValue !== initialDragStartValue || 
            endValue !== initialDragEndValue
          );
        }
        
        if (valueChanged) {
          // Only trigger onChange if value changed during this drag
          onChange(value);
        }
      }
      
      isDragging = false;
      activeDot = null;
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
    
    /**
     * Update the handle position based on mouse/touch event
     * @param {MouseEvent | Touch} event
     */
    const updateHandlePosition = (event) => {
      if (!trackWidth) return;
      
      const clientX = event.clientX || event.pageX;
      let position = clientX - trackLeft;
      
      // Constrain to track bounds
      position = Math.max(0, Math.min(position, trackWidth));
      
      // Convert position to value
      const percentage = position / trackWidth;
      const rawValue = min + percentage * (max - min);
      const value = Math.round(rawValue);
      
      // Update appropriate value based on active handle
      if (activeDot === 'start') {
        startValue = Math.min(value, type === 'range' ? endValue : max);
      } else if (activeDot === 'end') {
        endValue = Math.max(value, startValue);
      }
    };
    
    // Add resize listener
    window.addEventListener('resize', updateTrackDimensions);
    
    // Setup event listeners for handles
    node.querySelectorAll('.range--handle').forEach(handle => {
      const handleType = handle.classList.contains('range--handle-start') ? 'start' : 'end';
      
      handle.addEventListener('mousedown', (e) => {
        /** @type {MouseEvent} */
        const mouseEvent = /** @type {MouseEvent} */ (e);
        handleMouseDown(mouseEvent, handleType);
      });
      
      handle.addEventListener('touchstart', (e) => {
        /** @type {TouchEvent} */
        const touchEvent = /** @type {TouchEvent} */ (e);
        if (touchEvent.touches && touchEvent.touches[0]) {
          handleMouseDown(touchEvent.touches[0], handleType);
          touchEvent.preventDefault();
        }
      });
    });
    
    // Cleanup on component destruction
    return {
      destroy() {
        window.removeEventListener('resize', updateTrackDimensions);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      }
    };
  }

  // let isInitialRender = $state(true);
  // // Update external onChange callback when value changes
  // $effect(() => {
  //   console.log("------")
  //   let valueChanged;
    
  //   if (type === 'single') {
  //     valueChanged = value !== min;
  //   } else {
  //     // Type assertion to tell TypeScript that value is an object in this case
  //     const rangeValue = /** @type {{ start: number, end: number }} */ (value);
  //     valueChanged = rangeValue.start !== min || rangeValue.end !== max;
  //   }
      
  //   let shouldUpdate = valueChanged && !isInitialRender && !isDragging && onChange && value !== undefined;
  //   if (shouldUpdate) {
  //     onChange && onChange(value);
  //   }
    
  //   // Set flag to false after initial render
  //   if (isInitialRender) {
  //     isInitialRender = false;
  //     console.log("@@@@@@")
  //   }
  // });
</script>

<div use:handleDrag
  class={['range', cls, `range--${color}`].join(' ')}
>
  <div 
    class="range--track" 
    bind:this={track}
  >
    <div 
      class="range--filled-track" 
      style="left: {type === 'single' ? '0' : startPercent}%; 
             right: {100 - (type === 'single' ? startPercent : endPercent)}%;"
    ></div>
  </div>
  
  <!-- Start handle (always visible) -->
  <div 
    class="range--handle range--handle-start {isDragging && activeDot === 'start' ? 'range--handle-active' : ''}"
    style="left: {startPercent}%"
  >
    <span class="range--tooltip">{startValue}</span>
  </div>
  
  <!-- End handle (only visible in range mode) -->
  {#if type === 'range'}
    <div 
      class="range--handle range--handle-end {isDragging && activeDot === 'end' ? 'range--handle-active' : ''}"
      style="left: {endPercent}%"
    >
      <span class="range--tooltip">{endValue}</span>
    </div>
  {/if}
</div>
