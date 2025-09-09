<script>
	import { clickOutside } from '../functions';
	import { Icon } from '../icons';

	/**
	 * @typedef {Object} TimeTranslation
	 * @property {string} [hour] - Translation for hour label
	 * @property {string} [minute] - Translation for minute label
	 * @property {string} [second] - Translation for second label
	 */

	/**
	 * @typedef {Object} Props
	 * @property {string} [value] - Time value in format HH:MM:SS or HH:MM based on showSeconds
	 * @property {(time: string) => void} [onChange] - Callback function triggered when time changes
	 * @property {TimeTranslation} [translation] - Translation object for time labels
	 * @property {string} [name] - Name attribute for the input element
	 * @property {boolean} [showSeconds] - Whether to show seconds input and controls (default: true)
	 */

	/** @type {Props} */
	let {
		value = $bindable(),
		onChange,
		name = '',
		showSeconds = true,
		translation = {
			hour: 'sa',
			minute: 'dk',
			second: 'sn'
		}
	} = $props();

	// Raw input values (allow incomplete/invalid during typing)
	let rawHours = $state('00');
	let rawMinutes = $state('00');
	let rawSeconds = $state('00');

	// Validated display values
	let displayHours = $state('00');
	let displayMinutes = $state('00');
	let displaySeconds = $state('00');

	let showTimePicker = $state(false);

	// Focus tracking state to manage current input
	/** @type {'hours' | 'minutes' | 'seconds' | null} */
	let currentFocus = $state(null);

	// Initialize default value based on showSeconds prop
	if (!value) {
		value = showSeconds ? '00:00:00' : '00:00';
	}

	/** @type {HTMLDivElement|null} */
	let timePickerRef = $state(null);
	/** @type {HTMLDivElement|null} */
	let pickerContainerRef = $state(null);
	/** @type {HTMLInputElement|null} */
	let inputRef = $state(null);
	/** @type {HTMLInputElement|null} */
	let hoursInputRef = $state(null);
	/** @type {HTMLInputElement|null} */
	let minutesInputRef = $state(null);
	/** @type {HTMLInputElement|null} */
	let secondsInputRef = $state(null);

	// Parse the initial value when it changes externally
	$effect(() => {
		if (value) {
			const timeParts = value.split(':');
			const parsedHours = timeParts[0]?.padStart(2, '0') || '00';
			const parsedMinutes = timeParts[1]?.padStart(2, '0') || '00';
			const parsedSeconds = timeParts[2]?.padStart(2, '0') || '00';

			// Update both raw and display values
			rawHours = parsedHours;
			rawMinutes = parsedMinutes;
			rawSeconds = parsedSeconds;
			displayHours = parsedHours;
			displayMinutes = parsedMinutes;
			displaySeconds = parsedSeconds;
		}
	});

	// Synchronize the display values back to the main value
	$effect(() => {
		value = showSeconds
			? `${displayHours}:${displayMinutes}:${displaySeconds}`
			: `${displayHours}:${displayMinutes}`;
		if (onChange) {
			onChange(value);
		}
	});

	/**
	 * Validates and updates a time unit (hours, minutes, or seconds)
	 * @param {string} value - The value to validate
	 * @param {number} max - The maximum allowed value
	 * @returns {string} - The validated value, padded with leading zeros
	 */
	function validateTimeUnit(value, max) {
		let numValue = parseInt(value, 10);

		// Handle non-numeric input
		if (isNaN(numValue)) {
			return '00';
		}

		// Ensure value is within valid range
		if (numValue < 0) {
			numValue = 0;
		} else if (numValue > max) {
			numValue = max;
		}

		// Return value with leading zero if needed
		return numValue.toString().padStart(2, '0');
	}

	/**
	 * Auto-focus the hour input when picker opens
	 */
	function setupAutoFocus() {
		if (showTimePicker && hoursInputRef) {
			// Use setTimeout to ensure DOM is ready
			setTimeout(() => {
				if (hoursInputRef) {
					hoursInputRef.focus();
					currentFocus = 'hours';
				}
			}, 0);
		}
	}

	/**
	 * Advances focus to the next input and selects all text
	 * @param {'hours' | 'minutes' | 'seconds'} fromUnit - Current unit
	 */
	function advanceFocus(fromUnit) {
		let nextInput = null;
		/** @type {'hours' | 'minutes' | 'seconds' | null} */
		let nextFocus = null;

		if (fromUnit === 'hours') {
			nextInput = minutesInputRef;
			nextFocus = 'minutes';
		} else if (fromUnit === 'minutes' && showSeconds) {
			nextInput = secondsInputRef;
			nextFocus = 'seconds';
		}

		if (nextInput && nextFocus) {
			setTimeout(() => {
				if (nextInput) {
					nextInput.focus();
					nextInput.select(); // Select all text for easy replacement
					currentFocus = nextFocus;
				}
			}, 0);
		}
	}

	/**
	 * Checks if a value is a valid 2-digit entry that should trigger auto-advance
	 * @param {string} value - The input value
	 * @param {'hours' | 'minutes' | 'seconds'} unit - The time unit
	 * @returns {boolean} - Whether to advance focus
	 */
	function shouldAutoAdvance(value, unit) {
		// Only advance if we have exactly 2 digits
		if (value.length !== 2) return false;

		const numValue = parseInt(value, 10);
		if (isNaN(numValue)) return false;

		// Check if it's a valid value for the unit
		if (unit === 'hours') {
			return numValue >= 0 && numValue <= 23;
		} else {
			return numValue >= 0 && numValue <= 59;
		}
	}

	/**
	 * Updates the raw hours value during input (no validation)
	 * @param {Event} e - The input event
	 */
	function updateHours(e) {
		const target = /** @type {HTMLInputElement} */ (e.target);
		rawHours = target.value;

		// Check for auto-advance
		if (shouldAutoAdvance(target.value, 'hours')) {
			advanceFocus('hours');
		}
	}

	/**
	 * Updates the raw minutes value during input (no validation)
	 * @param {Event} e - The input event
	 */
	function updateMinutes(e) {
		const target = /** @type {HTMLInputElement} */ (e.target);
		rawMinutes = target.value;

		// Check for auto-advance
		if (shouldAutoAdvance(target.value, 'minutes')) {
			advanceFocus('minutes');
		}
	}

	/**
	 * Updates the raw seconds value during input (no validation)
	 * @param {Event} e - The input event
	 */
	function updateSeconds(e) {
		const target = /** @type {HTMLInputElement} */ (e.target);
		rawSeconds = target.value;

		// Check for auto-advance (seconds is the last input, so no advancement)
		// But we still validate the format for consistency
		shouldAutoAdvance(target.value, 'seconds');
	}

	/**
	 * Handles focus events for time inputs
	 * @param {'hours' | 'minutes' | 'seconds'} unit - The time unit being focused
	 */
	function handleFocus(unit) {
		currentFocus = unit;
	}

	/**
	 * Validates and updates display hours value on blur
	 * @param {Event} e - The blur event
	 */
	function validateHours(e) {
		const target = /** @type {HTMLInputElement} */ (e.target);
		displayHours = validateTimeUnit(target.value, 23);
		rawHours = displayHours; // Sync raw value with validated value

		// Clear focus tracking if this input is losing focus
		if (currentFocus === 'hours') {
			currentFocus = null;
		}
	}

	/**
	 * Validates and updates display minutes value on blur
	 * @param {Event} e - The blur event
	 */
	function validateMinutes(e) {
		const target = /** @type {HTMLInputElement} */ (e.target);
		displayMinutes = validateTimeUnit(target.value, 59);
		rawMinutes = displayMinutes; // Sync raw value with validated value

		// Clear focus tracking if this input is losing focus
		if (currentFocus === 'minutes') {
			currentFocus = null;
		}
	}

	/**
	 * Validates and updates display seconds value on blur
	 * @param {Event} e - The blur event
	 */
	function validateSeconds(e) {
		const target = /** @type {HTMLInputElement} */ (e.target);
		displaySeconds = validateTimeUnit(target.value, 59);
		rawSeconds = displaySeconds; // Sync raw value with validated value

		// Clear focus tracking if this input is losing focus
		if (currentFocus === 'seconds') {
			currentFocus = null;
		}
	}

	/**
	 * Increments a time unit by 1
	 * @param {'hours'|'minutes'|'seconds'} unit - The time unit to increment
	 */
	function increment(unit) {
		if (unit === 'hours') {
			const hoursNum = parseInt(displayHours, 10);
			displayHours = validateTimeUnit((hoursNum + 1).toString(), 23);
			rawHours = displayHours; // Sync raw value
		} else if (unit === 'minutes') {
			const minutesNum = parseInt(displayMinutes, 10);
			displayMinutes = validateTimeUnit((minutesNum + 1).toString(), 59);
			rawMinutes = displayMinutes; // Sync raw value
		} else if (unit === 'seconds') {
			const secondsNum = parseInt(displaySeconds, 10);
			displaySeconds = validateTimeUnit((secondsNum + 1).toString(), 59);
			rawSeconds = displaySeconds; // Sync raw value
		}
	}

	/**
	 * Decrements a time unit by 1
	 * @param {'hours'|'minutes'|'seconds'} unit - The time unit to decrement
	 */
	function decrement(unit) {
		if (unit === 'hours') {
			const hoursNum = parseInt(displayHours, 10);
			displayHours = validateTimeUnit((hoursNum - 1).toString(), 23);
			rawHours = displayHours; // Sync raw value
		} else if (unit === 'minutes') {
			const minutesNum = parseInt(displayMinutes, 10);
			displayMinutes = validateTimeUnit((minutesNum - 1).toString(), 59);
			rawMinutes = displayMinutes; // Sync raw value
		} else if (unit === 'seconds') {
			const secondsNum = parseInt(displaySeconds, 10);
			displaySeconds = validateTimeUnit((secondsNum - 1).toString(), 59);
			rawSeconds = displaySeconds; // Sync raw value
		}
	}

	/**
	 * Validates all current time inputs
	 * @returns {boolean} - Whether all inputs are valid
	 */
	function validateAllInputs() {
		// Validate hours
		const hoursValid = parseInt(rawHours, 10) >= 0 && parseInt(rawHours, 10) <= 23;
		// Validate minutes
		const minutesValid = parseInt(rawMinutes, 10) >= 0 && parseInt(rawMinutes, 10) <= 59;
		// Validate seconds (if shown)
		const secondsValid =
			!showSeconds || (parseInt(rawSeconds, 10) >= 0 && parseInt(rawSeconds, 10) <= 59);

		return (
			hoursValid &&
			minutesValid &&
			secondsValid &&
			!isNaN(parseInt(rawHours, 10)) &&
			!isNaN(parseInt(rawMinutes, 10)) &&
			(!showSeconds || !isNaN(parseInt(rawSeconds, 10)))
		);
	}

	/**
	 * Closes the picker with validation and focuses main input
	 */
	function closePicker() {
		if (validateAllInputs()) {
			// Ensure all values are properly formatted before closing
			displayHours = validateTimeUnit(rawHours, 23);
			displayMinutes = validateTimeUnit(rawMinutes, 59);
			if (showSeconds) {
				displaySeconds = validateTimeUnit(rawSeconds, 59);
			}

			showTimePicker = false;

			// Focus the main input after closing
			setTimeout(() => {
				if (inputRef) {
					inputRef.focus();
				}
			}, 0);
		} else {
			// If invalid, focus the first invalid input
			if (
				parseInt(rawHours, 10) < 0 ||
				parseInt(rawHours, 10) > 23 ||
				isNaN(parseInt(rawHours, 10))
			) {
				if (hoursInputRef) {
					hoursInputRef.focus();
					hoursInputRef.select();
				}
			} else if (
				parseInt(rawMinutes, 10) < 0 ||
				parseInt(rawMinutes, 10) > 59 ||
				isNaN(parseInt(rawMinutes, 10))
			) {
				if (minutesInputRef) {
					minutesInputRef.focus();
					minutesInputRef.select();
				}
			} else if (
				showSeconds &&
				(parseInt(rawSeconds, 10) < 0 ||
					parseInt(rawSeconds, 10) > 59 ||
					isNaN(parseInt(rawSeconds, 10)))
			) {
				if (secondsInputRef) {
					secondsInputRef.focus();
					secondsInputRef.select();
				}
			}
		}
	}

	/**
	 * Determines if the current input is the last visible input
	 * @param {'hours'|'minutes'|'seconds'} unit - The current time unit
	 * @returns {boolean} - Whether this is the last input
	 */
	function isLastInput(unit) {
		if (showSeconds) {
			return unit === 'seconds';
		} else {
			return unit === 'minutes';
		}
	}

	/**
	 * Handle keyboard events in the time inputs
	 * @param {KeyboardEvent} e - The keyboard event
	 * @param {'hours'|'minutes'|'seconds'} unit - The time unit being edited
	 */
	function handleKeyDown(e, unit) {
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			increment(unit);
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			decrement(unit);
		} else if (e.key === 'Enter') {
			e.preventDefault();
			closePicker();
		} else if (e.key === 'Tab' && isLastInput(unit)) {
			// Handle Tab on last input to close picker
			e.preventDefault();
			closePicker();
		}
	}

	/**
	 * Handle wheel events for scrolling to change time values
	 * @param {WheelEvent} e - The wheel event
	 * @param {'hours'|'minutes'|'seconds'} unit - The time unit being scrolled
	 */
	function handleWheel(e, unit) {
		e.preventDefault(); // Prevent the page from scrolling

		// The deltaY property indicates scroll direction
		if (e.deltaY < 0) {
			// Scrolling up - increment value
			increment(unit);
		} else if (e.deltaY > 0) {
			// Scrolling down - decrement value
			decrement(unit);
		}

		// Focus the input to maintain user's context
		const target = /** @type {HTMLInputElement} */ (e.target);
		if (target) {
			target.focus();
		}
	}

	/**
	 * Positions the time picker dropdown based on the input position
	 */
	function adjustPickerPosition() {
		if (!pickerContainerRef || !inputRef) return;

		// Make sure the picker is displayed so we can measure it
		pickerContainerRef.style.display = 'flex';
		pickerContainerRef.style.visibility = 'hidden';

		const inputRect = inputRef.getBoundingClientRect();
		const pickerRect = pickerContainerRef.getBoundingClientRect();

		// Available space calculations
		const availableSpaceBelow = window.innerHeight - inputRect.bottom;

		// Check if we're inside a modal
		const isInModal = timePickerRef?.closest('.modal') !== null;

		// Set fixed positioning
		pickerContainerRef.style.position = 'fixed';

		// Position calculation
		if (!isInModal) {
			// Position vertically
			if (availableSpaceBelow < pickerRect.height) {
				// Position above the input if not enough space below
				pickerContainerRef.style.top = `${inputRect.top - pickerRect.height}px`;
			} else {
				// Position below the input
				pickerContainerRef.style.top = `${inputRect.bottom}px`;
			}

			// Position horizontally
			// Ensure the picker doesn't extend beyond the right edge of the screen
			if (inputRect.left + pickerRect.width > window.innerWidth) {
				const rightAlignment = Math.max(window.innerWidth - pickerRect.width, 0);
				pickerContainerRef.style.left = `${rightAlignment}px`;
			} else {
				pickerContainerRef.style.left = `${inputRect.left}px`;
			}
		}

		// Make visible again
		pickerContainerRef.style.visibility = 'visible';
	}

	/**
	 * Adds event listeners for scroll and resize events
	 */
	function setupPositionListeners() {
		if (showTimePicker) {
			// Adjust position initially
			adjustPickerPosition();

			// Add event listeners
			window.addEventListener('scroll', adjustPickerPosition, true);
			window.addEventListener('resize', adjustPickerPosition);
		} else {
			// Remove event listeners when picker is closed
			window.removeEventListener('scroll', adjustPickerPosition, true);
			window.removeEventListener('resize', adjustPickerPosition);
		}
	}

	// Watch for changes in picker visibility
	$effect(() => {
		if (showTimePicker) {
			// Use setTimeout to ensure the DOM has updated
			setTimeout(setupPositionListeners, 0);
			// Setup auto-focus when picker opens
			setupAutoFocus();
		} else {
			window.removeEventListener('scroll', adjustPickerPosition, true);
			window.removeEventListener('resize', adjustPickerPosition);
			// Clear focus tracking when picker closes
			currentFocus = null;
		}
	});

	function handleClickOutside() {
		showTimePicker = false;
		// Clean up position listeners
		window.removeEventListener('scroll', adjustPickerPosition, true);
		window.removeEventListener('resize', adjustPickerPosition);
	}

	export function reset() {
		rawHours = '00';
		rawMinutes = '00';
		rawSeconds = '00';
		displayHours = '00';
		displayMinutes = '00';
		displaySeconds = '00';
		value = showSeconds ? '00:00:00' : '00:00';
	}
</script>

<div
	class="timepicker {showTimePicker ? 'timepicker--focused' : ''}"
	use:clickOutside
	onclick_outside={handleClickOutside}
	bind:this={timePickerRef}
>
	<div class="timepicker--input">
		<input
			{name}
			autocomplete="off"
			bind:this={inputRef}
			type="text"
			readonly
			value={showSeconds
				? `${displayHours}:${displayMinutes}:${displaySeconds}`
				: `${displayHours}:${displayMinutes}`}
			onfocus={() => (showTimePicker = true)}
		/>
		<Icon icon="ic:outline-access-time" width="18" height="18" />
	</div>

	{#if showTimePicker}
		<div class="timepicker--picker-container" bind:this={pickerContainerRef} tabindex="-1">
			<div class="timepicker--time-controls">
				<div class="timepicker--time-unit">
					<button class="timepicker--stepper" onclick={() => increment('hours')} tabindex="-1">
						<Icon icon="mdi:chevron-up" width="14" />
					</button>
					<input
						bind:this={hoursInputRef}
						autocomplete="off"
						type="text"
						value={rawHours}
						oninput={updateHours}
						onblur={validateHours}
						onfocus={() => handleFocus('hours')}
						onkeydown={(e) => handleKeyDown(e, 'hours')}
						onwheel={(e) => handleWheel(e, 'hours')}
						maxlength="2"
					/>
					<button class="timepicker--stepper" onclick={() => decrement('hours')} tabindex="-1">
						<Icon icon="mdi:chevron-down" width="14" />
					</button>
					<span class="timepicker--label">{translation.hour}</span>
				</div>
				<div class="timepicker--separator">:</div>
				<div class="timepicker--time-unit">
					<button class="timepicker--stepper" onclick={() => increment('minutes')} tabindex="-1">
						<Icon icon="mdi:chevron-up" width="14" />
					</button>
					<input
						bind:this={minutesInputRef}
						autocomplete="off"
						type="text"
						value={rawMinutes}
						oninput={updateMinutes}
						onblur={validateMinutes}
						onfocus={() => handleFocus('minutes')}
						onkeydown={(e) => handleKeyDown(e, 'minutes')}
						onwheel={(e) => handleWheel(e, 'minutes')}
						maxlength="2"
					/>
					<button class="timepicker--stepper" onclick={() => decrement('minutes')} tabindex="-1">
						<Icon icon="mdi:chevron-down" width="14" />
					</button>
					<span class="timepicker--label">{translation.minute}</span>
				</div>
				{#if showSeconds}
					<div class="timepicker--separator">:</div>
					<div class="timepicker--time-unit">
						<button class="timepicker--stepper" onclick={() => increment('seconds')} tabindex="-1">
							<Icon icon="mdi:chevron-up" width="14" />
						</button>
						<input
							bind:this={secondsInputRef}
							autocomplete="off"
							type="text"
							value={rawSeconds}
							oninput={updateSeconds}
							onblur={validateSeconds}
							onfocus={() => handleFocus('seconds')}
							onkeydown={(e) => handleKeyDown(e, 'seconds')}
							onwheel={(e) => handleWheel(e, 'seconds')}
							maxlength="2"
						/>
						<button class="timepicker--stepper" onclick={() => decrement('seconds')} tabindex="-1">
							<Icon icon="mdi:chevron-down" width="14" />
						</button>
						<span class="timepicker--label">{translation.second}</span>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
