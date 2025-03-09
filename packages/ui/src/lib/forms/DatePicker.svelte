<script>
	import { clickOutside } from '../functions';
	import { Icon } from '../icons';

	/**
	 * @typedef {Object} Props
	 * @property {boolean|null|undefined} [isRange] - Whether to select a range of dates
	 * @property {boolean} [quickSelect] - Whether to show quick select options
	 * @property {boolean} [isEuropean] - Whether to use European date format (DD/MM/YYYY)
	 * @property {boolean} [manualInput] - Whether to allow manual input of dates
	 * @property {(dates: {start: Date|null, end: Date|null}) => void} [onChange] - Callback function triggered when dates change
	 */

	/** @type {Props} */
	let { isRange = false, quickSelect = false, isEuropean = true, manualInput = true, onChange } = $props();

	// State management with Svelte 5 runes
	/** @type {Date|null} */
	let startDate = $state(null);
	/** @type {Date|null} */
	let endDate = $state(null);
	/** @type {Date|null} */
	let hoveredDate = $state(null);
	let showStartPicker = $state(false);
	let showEndPicker = $state(false);
	let currentMonth = $state(new Date());
	let startInputValue = $state('');
	let endInputValue = $state('');

	// References to the input elements
	/** @type {HTMLInputElement|null} */
	let startInputRef = $state(null);
	/** @type {HTMLInputElement|null} */
	let endInputRef = $state(null);


    function updateDateValues() {
        startInputValue = formatDate(startDate);
        if (isRange) {
            endInputValue = formatDate(endDate);
        }
        if (onChange) {
            onChange({ start: startDate, end: endDate });
        }
    }

	/**
	 * Handle keyboard events for the input fields
	 * @param {KeyboardEvent} e - The keyboard event
	 * @param {'start'|'end'} inputType - Which input field triggered the event
	 */
	 function handleKeyDown(e, inputType) {
        // Enter key (13) or Tab key (9)
        if (e.key === 'Enter' || e.key === 'Tab') {
            if (inputType === 'start') {
                const parsedDate = parseInputDate(startInputValue);

                if (parsedDate) {
                    startDate = parsedDate;
                    updateDateValues();

                    if (isRange) {
                        // In range mode, focus the end input
                        e.preventDefault(); // Prevent default for Tab to handle focus manually
                        if (endInputRef) {
                            endInputRef.focus();
                        }
                    } else {
                        // In single mode, close the calendar
                        showStartPicker = false;
                    }
                }
            } else if (inputType === 'end') {
                const parsedDate = parseInputDate(endInputValue);

                if (parsedDate) {
                    // If end date is before start date, swap them
                    if (startDate && parsedDate < startDate) {
                        endDate = startDate;
                        startDate = parsedDate;
                        updateDateValues();
                    } else {
                        endDate = parsedDate;
                        updateDateValues();
                    }

                    // Close the calendar after successful end date input
                    showStartPicker = false;
                    showEndPicker = false;
                }
            }
        }
    }

	// Parse user input date string to Date object
	/**
	 * Parse user input date string to Date object
	 * @param {string} dateStr - The date string to parse
	 * @returns {Date|null} - Parsed date or null if invalid
	 */
	function parseInputDate(dateStr) {
		if (!dateStr) return null;

		// Try to parse the input date based on the expected format
		let parts;
		let day, month, year;

		if (isEuropean) {
			// DD/MM/YYYY format
			parts = dateStr.split(/[.\-/]/);
			if (parts.length !== 3) return null;

			day = parseInt(parts[0], 10);
			month = parseInt(parts[1], 10) - 1; // months are 0-based
			year = parseInt(parts[2], 10);
		} else {
			// MM/DD/YYYY format
			parts = dateStr.split(/[.\-/]/);
			if (parts.length !== 3) return null;

			month = parseInt(parts[0], 10) - 1; // months are 0-based
			day = parseInt(parts[1], 10);
			year = parseInt(parts[2], 10);
		}

		// Basic validation
		if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
		if (year < 1900 || year > 2100) return null;
		if (month < 0 || month > 11) return null;
		if (day < 1 || day > 31) return null;

		const date = new Date(year, month, day);
		if (isNaN(date.getTime())) return null;

		return date;
	}

    /**
     * Handle input change for start date
     * @param {Event} e - The input event
     */
	 function handleStartInputChange(e) {
        const target = /** @type {HTMLInputElement} */ (e.target);
        if (target) {
            startInputValue = target.value;
        }
        const parsedDate = parseInputDate(startInputValue);

        if (parsedDate) {
            startDate = parsedDate;
            updateDateValues();
            // Update current month to match the entered date
            currentMonth = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1);
        }
    }

    // Handle input change for end date
    /**
     * Handle input change for end date
     * @param {Event} e - The input event
     */
    function handleEndInputChange(e) {
        const target = /** @type {HTMLInputElement} */ (e.target);
        if (target) {
            endInputValue = target.value;
        }
        const parsedDate = parseInputDate(endInputValue);

        if (parsedDate) {
            endDate = parsedDate;
            // If end date is before start date, swap them
            if (startDate && parsedDate < startDate) {
                endDate = startDate;
                startDate = parsedDate;
                updateDateValues();
            } else {
                updateDateValues();
            }
        }
    }

    // Handle input blur to format the date correctly
    /**
     * Handle input blur to format the date correctly
     * @param {'start'|'end'} inputType - Which input was blurred
     */
	 function handleInputBlur(inputType) {
        if (inputType === 'start') {
            startInputValue = formatDate(startDate);
        } else if (inputType === 'end') {
            endInputValue = formatDate(endDate);
        }
    }

	// Calendar generation
	function generateCalendar(date = currentMonth) {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const days = [];

		// Add days from previous month
		for (let i = firstDay.getDay() - 1; i >= 0; i--) {
			days.push(new Date(year, month, -i));
		}

		// Add current month days
		for (let i = 1; i <= lastDay.getDate(); i++) {
			days.push(new Date(year, month, i));
		}

		return days;
	}

	/**
	 * Format a date for display in the input fields
	 * @param {Date|null} date - The date to format
	 * @returns {string} The formatted date string
	 */
	function formatDate(date) {
		if (!date) return '';
		return date.toLocaleDateString(isEuropean ? 'en-GB' : 'en-US', {
			month: '2-digit',
			day: '2-digit',
			year: 'numeric'
		});
	}

	/**
	 * Format a date to display the month and year
	 * @param {Date} date - The date to format
	 * @returns {string} The formatted month and year
	 */
	function formatMonth(date) {
		return date.toLocaleDateString(isEuropean ? 'en-GB' : 'en-US', {
			month: 'short',
			year: 'numeric'
		});
	}

	/**
	 * Determine if this day is the visual start of the selected range
	 * @param {Date} day - The day to check
	 * @returns {boolean} - Whether this day is the range start
	 */
	function isRangeStart(day) {
		if (!startDate) return false;

		// If we have a completed range
		if (endDate) {
			const earlierDate = startDate < endDate ? startDate : endDate;
			return day.getTime() === earlierDate.getTime();
		}

		// If we're in the process of selecting a range
		if (hoveredDate) {
			// If hovering before the start date
			if (hoveredDate < startDate) {
				return day.getTime() === hoveredDate.getTime();
			}
			// If hovering after the start date
			else {
				return day.getTime() === startDate.getTime();
			}
		}

		// If it's just the start date
		return day.getTime() === startDate.getTime();
	}

	/**
	 * Determine if this day is the visual end of the selected range
	 * @param {Date} day - The day to check
	 * @returns {boolean} - Whether this day is the range end
	 */
	function isRangeEnd(day) {
		if (!startDate) return false;

		// If we have a completed range
		if (endDate) {
			const laterDate = startDate > endDate ? startDate : endDate;
			return day.getTime() === laterDate.getTime();
		}

		// If we're in the process of selecting a range
		if (hoveredDate) {
			// If hovering before the start date
			if (hoveredDate < startDate) {
				return day.getTime() === startDate.getTime();
			}
			// If hovering after the start date
			else {
				return day.getTime() === hoveredDate.getTime();
			}
		}

		// If it's just the start date (no hover or end date)
		return day.getTime() === startDate.getTime();
	}

	/**
	 * Determine if this day is within the selected range
	 * @param {Date} day - The day to check
	 * @returns {boolean} - Whether this day is within the range
	 */
	function isInRange(day) {
		if (!startDate) return false;

		// If we have a completed range
		if (endDate) {
			const min = startDate < endDate ? startDate : endDate;
			const max = startDate < endDate ? endDate : startDate;
			return day > min && day < max;
		}

		// If we're in the process of selecting a range
		if (hoveredDate && isRange) {
			const min = startDate < hoveredDate ? startDate : hoveredDate;
			const max = startDate < hoveredDate ? hoveredDate : startDate;
			return day > min && day < max;
		}

		return false;
	}

	/**
	 * Handle date selection when a user clicks on a day in the calendar
	 * @param {Date} date - The selected date
	 */
    /**
     * Handle date selection when a user clicks on a day in the calendar
     * @param {Date} date - The selected date
     */
	 function selectDate(date) {
        if (!isRange) {
            startDate = date;
            updateDateValues();
            showStartPicker = false;
            return;
        }

        if (!startDate || (startDate && endDate)) {
            // First selection in a new range
            startDate = date;
            endDate = null;
            updateDateValues();
            // Don't close the picker yet, waiting for second selection
        } else {
            // Second selection to complete the range
            if (date < startDate) {
                // If selecting backwards, swap the dates
                endDate = startDate;
                startDate = date;
            } else {
                endDate = date;
            }
            updateDateValues();
            // Close the picker now that range is complete
            showStartPicker = false;
            showEndPicker = false;
        }
    }

	// Navigation functions
	function prevMonth() {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
	}

	function nextMonth() {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
	}

	// Weekday names
	const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    function handleClickOutside() {
        // If in range mode and only one date is selected (incomplete range),
        // reset all the selections
        if (isRange && ((startDate && !endDate) || (!startDate && endDate))) {
            startDate = null;
            endDate = null;
            updateDateValues();
        }

        // Always close the pickers when clicking outside
        showStartPicker = false;
        showEndPicker = false;
    }

	// Quick select options

	// Helper functions for quick selection
	function getToday() {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return today;
	}

	/**
	 * Adds the specified number of days to a date
	 * @param {Date} date - The starting date
	 * @param {number} days - The number of days to add (can be negative)
	 * @returns {Date} A new date object with the days added
	 */
	function addDays(date, days) {
		const result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}

	function getNextMonday() {
		const today = getToday();
		const day = today.getDay(); // 0 = Sunday, 1 = Monday
		const daysUntilMonday = day === 0 ? 1 : 8 - day;
		return addDays(today, daysUntilMonday);
	}

	/**
	 * Gets the first day of the month for a given date
	 * @param {Date} date - The reference date
	 * @returns {Date} First day of the month
	 */
	function getFirstDayOfMonth(date) {
		return new Date(date.getFullYear(), date.getMonth(), 1);
	}

	/**
	 * Gets the last day of the month for a given date
	 * @param {Date} date - The reference date
	 * @returns {Date} Last day of the month
	 */
	function getLastDayOfMonth(date) {
		return new Date(date.getFullYear(), date.getMonth() + 1, 0);
	}

	/**
	 * Gets the first day of the specified year
	 * @param {number} year - The year
	 * @returns {Date} First day of the year (January 1st)
	 */
	function getFirstDayOfYear(year) {
		return new Date(year, 0, 1);
	}

	/**
	 * Gets the last day of the specified year
	 * @param {number} year - The year
	 * @returns {Date} Last day of the year (December 31st)
	 */
	function getLastDayOfYear(year) {
		return new Date(year, 11, 31);
	}

	/**
	 * Gets the start date of the week containing the specified date
	 * @param {Date} date - The reference date
	 * @returns {Date} The Sunday of the week
	 */
	function getWeekStartDate(date) {
		const day = date.getDay();
		return addDays(date, -day); // Go back to Sunday
	}

	/**
	 * Gets the end date of the week containing the specified date
	 * @param {Date} date - The reference date
	 * @returns {Date} The Saturday of the week
	 */
	function getWeekEndDate(date) {
		const day = date.getDay();
		return addDays(date, 6 - day); // Go forward to Saturday
	}

	// Single date quick selection options
	const singleDateOptions = [
		{
			label: 'Today',
			action: () => {
				startDate = getToday();
				showStartPicker = false;
			}
		},
		{
			label: 'Yesterday',
			action: () => {
				startDate = addDays(getToday(), -1);
				showStartPicker = false;
			}
		},
		{
			label: 'Tomorrow',
			action: () => {
				startDate = addDays(getToday(), 1);
				showStartPicker = false;
			}
		},
		{
			label: 'Next week',
			action: () => {
				startDate = addDays(getToday(), 7);
				showStartPicker = false;
			}
		},
		{
			label: 'Next Monday',
			action: () => {
				startDate = getNextMonday();
				showStartPicker = false;
			}
		},
		{
			label: 'Next month',
			action: () => {
				const today = getToday();
				startDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
				showStartPicker = false;
			}
		},
		{
			label: 'Next year',
			action: () => {
				const today = getToday();
				startDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
				showStartPicker = false;
			}
		}
	];

	// Range date quick selection options
	const rangeDateOptions = [
		{
			label: 'This week',
			action: () => {
				const today = getToday();
				startDate = getWeekStartDate(today);
				endDate = getWeekEndDate(today);
				updateDateValues();
				showStartPicker = false;
				showEndPicker = false;
			}
		},
		{
			label: 'Last week',
			action: () => {
				const lastWeek = addDays(getToday(), -7);
				startDate = getWeekStartDate(lastWeek);
				endDate = getWeekEndDate(lastWeek);
				updateDateValues();
				showStartPicker = false;
				showEndPicker = false;
			}
		},
		{
			label: 'This month',
			action: () => {
				const today = getToday();
				startDate = getFirstDayOfMonth(today);
				endDate = getLastDayOfMonth(today);
				updateDateValues();
				showStartPicker = false;
				showEndPicker = false;
			}
		},
		{
			label: 'Last month',
			action: () => {
				const today = getToday();
				const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
				startDate = getFirstDayOfMonth(lastMonth);
				endDate = getLastDayOfMonth(lastMonth);
				updateDateValues();
				showStartPicker = false;
				showEndPicker = false;
			}
		},
		{
			label: 'Next month',
			action: () => {
				const today = getToday();
				const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
				startDate = getFirstDayOfMonth(nextMonth);
				endDate = getLastDayOfMonth(nextMonth);
				updateDateValues();
				showStartPicker = false;
				showEndPicker = false;
			}
		},
		{
			label: 'This year',
			action: () => {
				const today = getToday();
				startDate = getFirstDayOfYear(today.getFullYear());
				endDate = getLastDayOfYear(today.getFullYear());
				updateDateValues();
				showStartPicker = false;
				showEndPicker = false;
			}
		},
		{
			label: 'Last year',
			action: () => {
				const today = getToday();
				startDate = getFirstDayOfYear(today.getFullYear() - 1);
				endDate = getLastDayOfYear(today.getFullYear() - 1);
				updateDateValues();
				showStartPicker = false;
				showEndPicker = false;
			}
		}
	];

	export function reset() {
		startDate = null;
		endDate = null;
		startInputValue = '';
		endInputValue = '';
	}

</script>

<div
    class="datepicker {(showStartPicker || showEndPicker) ? 'datepicker--focused' : ''}"
    use:clickOutside
    onclick_outside={handleClickOutside}
>	<!-- Input Fields -->
	<div class="datepicker--inputs">
		<input
			bind:this={startInputRef}
			type="text"
			value={startInputValue}
			placeholder="Select date"
			onfocus={() => (showStartPicker = true)}
			oninput={handleStartInputChange}
			onblur={() => handleInputBlur('start')}
			onkeydown={(e) => handleKeyDown(e, 'start')}
			readonly={!manualInput}
		/>
		{#if isRange}
		<Icon icon="ic:baseline-compare-arrows" width="24" height="24" />
		<input
		bind:this={endInputRef}
		type="text"
		value={endInputValue}
		placeholder="Select end date"
		onfocus={() => (showEndPicker = true)}
		oninput={handleEndInputChange}
		onblur={() => handleInputBlur('end')}
		onkeydown={(e) => handleKeyDown(e, 'end')}
		readonly={!manualInput}
		/>
		{/if}
		<Icon icon="ic:outline-calendar-today" width="18" height="18" />
	</div>
	
	<!-- Calendar Display -->
	{#if showStartPicker || (isRange && showEndPicker)}
	<div class="datepicker--picker-container">
		<!-- Quick Selection Panel -->
		{#if quickSelect}
		<div class="datepicker--quick-select">
			<ul>
				{#if !isRange}
				{#each singleDateOptions as option}
				<li>
					<button onclick={option.action}
					>{option.label}
					<Icon name="alt-arrow-right" size="13px"/>
				</button>
			</li>
			{/each}
			{:else}
			{#each rangeDateOptions as option}
			<li>
				<button onclick={option.action}
				>{option.label}
						<Icon name="alt-arrow-right" size="13px"/>
									</button>
								</li>
							{/each}
						{/if}
					</ul>
				</div>
			{/if}

			<div class="datepicker--calendar">
				<!-- Month navigation -->
				<div class="datepicker--calendar-header">
					<button aria-label="prev" class="datepicker--month-nav" onclick={prevMonth}>
						<Icon name="alt-arrow-left" size="14px"/>
					</button>
					<div class="datepicker--month-title">{formatMonth(currentMonth)}</div>
					<button aria-label="next" class="datepicker--month-nav" onclick={nextMonth}>
						<Icon name="alt-arrow-right" size="14px"/>
					</button>
				</div>

				<!-- Weekday headers -->
				{#each weekdays as weekday}
					<div class="datepicker--weekday">{weekday}</div>
				{/each}

				<!-- Calendar days -->
				{#each generateCalendar() as day}
					<button
						class="datepicker--day"
						class:datepicker--other-month={day.getMonth() !== currentMonth.getMonth()}
						class:selected={day.getTime() === startDate?.getTime() ||
							day.getTime() === endDate?.getTime()}
						class:datepicker--in-range={isInRange(day)}
						class:datepicker--range-start={isRangeStart(day)}
						class:datepicker--range-end={isRangeEnd(day)}
						onclick={() => selectDate(day)}
						onmouseover={() => {
							if (isRange && startDate && !endDate) hoveredDate = day;
						}}
						onfocus={() => {
							if (isRange && startDate && !endDate) hoveredDate = day;
						}}
						onmouseout={() => {
							if (isRange) hoveredDate = null;
						}}
						onblur={() => {
							if (isRange) hoveredDate = null;
						}}
					>
						{day.getDate()}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
