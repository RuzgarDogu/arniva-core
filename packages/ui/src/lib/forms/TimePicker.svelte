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
	 * @property {string} [value] - Time value in format HH:MM:SS
	 * @property {(time: string) => void} [onChange] - Callback function triggered when time changes
	 * @property {TimeTranslation} [translation] - Translation object for time labels
	 * @property {string} [name] - Name attribute for the input element
	 */

	/** @type {Props} */
	let {
		value = $bindable('00:00:00'),
		onChange,
		name = '',
		translation = {
			hour: 'sa',
			minute: 'dk',
			second: 'sn'
		}
	} = $props();

	let hours = $state('00');
	let minutes = $state('00');
	let seconds = $state('00');
	let showTimePicker = $state(false);

	/** @type {HTMLDivElement|null} */
	let timePickerRef = $state(null);
	/** @type {HTMLDivElement|null} */
	let pickerContainerRef = $state(null);
	/** @type {HTMLInputElement|null} */
	let inputRef = $state(null);

	// Parse the initial value when it changes externally
	$effect(() => {
		if (value) {
			const timeParts = value.split(':');
			hours = timeParts[0]?.padStart(2, '0') || '00';
			minutes = timeParts[1]?.padStart(2, '0') || '00';
			seconds = timeParts[2]?.padStart(2, '0') || '00';
		}
	});

	// Synchronize the three parts back to the value
	$effect(() => {
		value = `${hours}:${minutes}:${seconds}`;
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
	 * Updates the hours value after validation
	 * @param {Event} e - The input event
	 */
	function updateHours(e) {
		const target = /** @type {HTMLInputElement} */ (e.target);
		hours = validateTimeUnit(target.value, 23);
	}

	/**
	 * Updates the minutes value after validation
	 * @param {Event} e - The input event
	 */
	function updateMinutes(e) {
		const target = /** @type {HTMLInputElement} */ (e.target);
		minutes = validateTimeUnit(target.value, 59);
	}

	/**
	 * Updates the seconds value after validation
	 * @param {Event} e - The input event
	 */
	function updateSeconds(e) {
		const target = /** @type {HTMLInputElement} */ (e.target);
		seconds = validateTimeUnit(target.value, 59);
	}

	/**
	 * Increments a time unit by 1
	 * @param {'hours'|'minutes'|'seconds'} unit - The time unit to increment
	 */
	function increment(unit) {
		if (unit === 'hours') {
			const hoursNum = parseInt(hours, 10);
			hours = validateTimeUnit((hoursNum + 1).toString(), 23);
		} else if (unit === 'minutes') {
			const minutesNum = parseInt(minutes, 10);
			minutes = validateTimeUnit((minutesNum + 1).toString(), 59);
		} else if (unit === 'seconds') {
			const secondsNum = parseInt(seconds, 10);
			seconds = validateTimeUnit((secondsNum + 1).toString(), 59);
		}
	}

	/**
	 * Decrements a time unit by 1
	 * @param {'hours'|'minutes'|'seconds'} unit - The time unit to decrement
	 */
	function decrement(unit) {
		if (unit === 'hours') {
			const hoursNum = parseInt(hours, 10);
			hours = validateTimeUnit((hoursNum - 1).toString(), 23);
		} else if (unit === 'minutes') {
			const minutesNum = parseInt(minutes, 10);
			minutes = validateTimeUnit((minutesNum - 1).toString(), 59);
		} else if (unit === 'seconds') {
			const secondsNum = parseInt(seconds, 10);
			seconds = validateTimeUnit((secondsNum - 1).toString(), 59);
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
			showTimePicker = false;
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
		} else {
			window.removeEventListener('scroll', adjustPickerPosition, true);
			window.removeEventListener('resize', adjustPickerPosition);
		}
	});

	function handleClickOutside() {
		showTimePicker = false;
		// Clean up position listeners
		window.removeEventListener('scroll', adjustPickerPosition, true);
		window.removeEventListener('resize', adjustPickerPosition);
	}

	export function reset() {
		hours = '00';
		minutes = '00';
		seconds = '00';
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
			value={`${hours}:${minutes}:${seconds}`}
			onfocus={() => (showTimePicker = true)}
		/>
		<Icon icon="ic:outline-access-time" width="18" height="18" />
	</div>

	{#if showTimePicker}
		<div class="timepicker--picker-container" bind:this={pickerContainerRef}>
			<div class="timepicker--time-controls">
				<div class="timepicker--time-unit">
					<button class="timepicker--stepper" onclick={() => increment('hours')}>
						<Icon icon="mdi:chevron-up" width="14" />
					</button>
					<input
						autocomplete="off"
						type="text"
						value={hours}
						oninput={updateHours}
						onkeydown={(e) => handleKeyDown(e, 'hours')}
						onwheel={(e) => handleWheel(e, 'hours')}
						maxlength="2"
					/>
					<button class="timepicker--stepper" onclick={() => decrement('hours')}>
						<Icon icon="mdi:chevron-down" width="14" />
					</button>
					<span class="timepicker--label">{translation.hour}</span>
				</div>
				<div class="timepicker--separator">:</div>
				<div class="timepicker--time-unit">
					<button class="timepicker--stepper" onclick={() => increment('minutes')}>
						<Icon icon="mdi:chevron-up" width="14" />
					</button>
					<input
						autocomplete="off"
						type="text"
						value={minutes}
						oninput={updateMinutes}
						onkeydown={(e) => handleKeyDown(e, 'minutes')}
						onwheel={(e) => handleWheel(e, 'minutes')}
						maxlength="2"
					/>
					<button class="timepicker--stepper" onclick={() => decrement('minutes')}>
						<Icon icon="mdi:chevron-down" width="14" />
					</button>
					<span class="timepicker--label">{translation.minute}</span>
				</div>
				<div class="timepicker--separator">:</div>
				<div class="timepicker--time-unit">
					<button class="timepicker--stepper" onclick={() => increment('seconds')}>
						<Icon icon="mdi:chevron-up" width="14" />
					</button>
					<input
						autocomplete="off"
						type="text"
						value={seconds}
						oninput={updateSeconds}
						onkeydown={(e) => handleKeyDown(e, 'seconds')}
						onwheel={(e) => handleWheel(e, 'seconds')}
						maxlength="2"
					/>
					<button class="timepicker--stepper" onclick={() => decrement('seconds')}>
						<Icon icon="mdi:chevron-down" width="14" />
					</button>
					<span class="timepicker--label">{translation.second}</span>
				</div>
			</div>
		</div>
	{/if}
</div>
