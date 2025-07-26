<script>
	import { clickOutside } from '../functions';
	import { Icon } from '../icons';


	/**
	 * FIXME: This is just a flag for working version. Just ignore this.
	*/
	/**
	 * FIXME: This is just a flag for working version. Just ignore this.
	*/
	/**
	 * FIXME: This is just a flag for working version. Just ignore this.
	*/



	/**
	 * @typedef {import('./filter/types').DateTranslation} DateTranslation
	 */

	/**
	 * @typedef {'iso'|'date'|'timestamp'|'auto'} DateFormatType
	 */

	/**
	 * @typedef {Object} Props
	 * @property {boolean|null|undefined} [isRange] - Whether to select a range of dates
	 * @property {boolean} [quickSelect] - Whether to show quick select options
	 * @property {boolean} [isEuropean] - Whether to use European date format (DD/MM/YYYY)
	 * @property {boolean} [manualInput] - Whether to allow manual input of dates
	 * @property {(dates: {start: Date|string|number|null, end: Date|string|number|null}) => void} [onChange] - Callback function triggered when dates change
	 * @property {Date|string|number|null} [startDate] - The selected start date
	 * @property {Date|string|number|null} [endDate] - The selected end date
	 * @property {DateFormatType} [dateFormat] - Format to use for date binding and onChange values
	 * @property {DateTranslation} [translation] - Translation object for date picker
	 * @property {string} [name] - Name attribute for the input fields
	 */

	// Helper to convert various date formats to Date objects
	/**
	 * Converts a date value to a Date object
	 * @param {Date|string|number|null} dateValue - The date to convert
	 * @returns {Date|null} - The converted Date object or null
	 */
	function ensureDate(dateValue) {
		if (!dateValue) return null;
		
		if (typeof dateValue === 'string') {
			const parsedDate = new Date(dateValue);
			// Check if the date is valid
			return isNaN(parsedDate.getTime()) ? null : parsedDate;
		}
		
		if (typeof dateValue === 'number') {
			const parsedDate = new Date(dateValue);
			return isNaN(parsedDate.getTime()) ? null : parsedDate;
		}
		
		return dateValue;
	}

	/**
	 * Check if two dates represent the same day (ignoring time)
	 * @param {Date|null} date1 - First date
	 * @param {Date|null} date2 - Second date
	 * @returns {boolean} - True if same day
	 */
	function isSameDay(date1, date2) {
		if (!date1 || !date2) return false;
		return date1.getFullYear() === date2.getFullYear() &&
			   date1.getMonth() === date2.getMonth() &&
			   date1.getDate() === date2.getDate();
	}

	/**
	 * Detects the format of a date value
	 * @param {Date|string|number|null} dateValue - The date to check
	 * @returns {DateFormatType} - The detected format type
	 */
	function detectDateFormat(dateValue) {
		if (!dateValue) return 'iso'; // Default format for null values
		
		if (dateValue instanceof Date) return 'date';
		
		if (typeof dateValue === 'number') return 'timestamp';
		
		if (typeof dateValue === 'string') {
			// Check if it's an ISO string
			if (/^\d{4}-\d{2}-\d{2}T.*Z$/.test(dateValue)) {
				return 'iso';
			}
			// If it's some other string format, still use ISO for output
			return 'iso';
		}
		
		return 'iso'; // Default to ISO for unknown types
	}

	/**
	 * Converts a Date object to the specified output format
	 * @param {Date|null} date - The date to convert
	 * @param {DateFormatType} format - The target format
	 * @returns {Date|string|number|null} - The converted date in the requested format
	 */
	function formatDateForOutput(date, format) {
		if (!date) return null;
		
		switch(format) {
			case 'date':
				return date;
			case 'timestamp':
				return date.getTime();
			case 'iso':
			default: {
				// Create ISO string preserving the local date without timezone conversion
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}T00:00:00Z`;
			}
		}
	}
	 
	/** @type {Props} */
	let {
		isRange = false,
		quickSelect = false,
		isEuropean = true,
		manualInput = true,
		onChange,
		name='date',
		startDate = $bindable(null),
		endDate = $bindable(null),
		dateFormat = 'auto',
		translation = {
			selectdate: "Tarih Seç",
			selectenddate: "Bitiş Tarihi Seç",
			thisweek: "Bu Hafta",
			lastweek: "Geçen Hafta",
			thismonth: "Bu Ay",
			lastmonth: "Geçen Ay",
			thisyear: "Bu Yıl",
			lastyear: "Geçen Yıl",
			apply: "Uygula",
			cancel: "İptal",
		}
	} = $props();

	// Detect initial date formats if auto is specified
	let startDateFormat = $state(dateFormat === 'auto' ? detectDateFormat(startDate) : dateFormat);
	let endDateFormat = $state(dateFormat === 'auto' ? detectDateFormat(endDate) : dateFormat);

	// Initialize currentMonth based on startDate (only once or when external change)
	$effect(() => {
		if (!hasUserNavigated) {
			const startDateObj = ensureDate(startDate);
			if (startDateObj) {
				currentMonth = new Date(startDateObj.getFullYear(), startDateObj.getMonth(), 1);
			}
		}
	});

	// Handle reactive updates for format detection and input values
	$effect(() => {
		// Update format detection if auto is specified and value changes
		if (dateFormat === 'auto') {
			startDateFormat = detectDateFormat(startDate);
			endDateFormat = detectDateFormat(endDate);
		}
		
		// Update input values when startDate or endDate change externally
		updateDateValues();
	});

	/** @type {Date|null} */
	let hoveredDate = $state(null);
	let showStartPicker = $state(false);
	let showEndPicker = $state(false);
	let currentMonth = $state(new Date());
	let startInputValue = $state('');
	let endInputValue = $state('');
	let isManuallyEditing = $state(false);

	// References to the input elements
	/** @type {HTMLInputElement|null} */
	let startInputRef = $state(null);
	/** @type {HTMLInputElement|null} */
	let endInputRef = $state(null);
	/** @type {HTMLDivElement|null} */
	let datePickerRef = $state(null);
	/** @type {HTMLDivElement|null} */
	let pickerContainerRef = $state(null);
	/** @type {HTMLDivElement|null} */
	let inputsContainerRef = $state(null);

	let isUpdating = $state(false);
	let hasUserNavigated = $state(false);

	// Override the updateDateValues function to not override manual input
	function updateDateValues() {
		// Only proceed if not already updating
		if (isUpdating || isManuallyEditing) return;
		
		isUpdating = true;
		startInputValue = formatDateDisplay(ensureDate(startDate));
		if (isRange) {
			endInputValue = formatDateDisplay(ensureDate(endDate));
		}
		
		// Reset the flag after a small delay to ensure all updates have completed
		setTimeout(() => {
			isUpdating = false;
		}, 0);
	}

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
			// Allow free editing without updating the actual startDate yet
			isManuallyEditing = true;
			startInputValue = target.value;
			
			// Try to preview the date if it's valid
			const parsedDate = parseInputDate(startInputValue);
			if (parsedDate) {
				// Only update visual representation, don't trigger onChange
				startDate = formatDateForOutput(parsedDate, startDateFormat);
				// Update current month to match the entered date for calendar view
				currentMonth = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1);
			}
		}
	}

	/**
	 * Handle input change for end date
	 * @param {Event} e - The input event
	 */
	function handleEndInputChange(e) {
		const target = /** @type {HTMLInputElement} */ (e.target);
		if (target) {
			// Allow free editing without updating the actual endDate yet
			isManuallyEditing = true;
			endInputValue = target.value;
			
			// Try to preview the date if it's valid
			const parsedDate = parseInputDate(endInputValue);
			if (parsedDate) {
				// Only update visual representation, don't trigger onChange
				const startDateObj = ensureDate(startDate);
				if (startDateObj && parsedDate < startDateObj) {
					// If end date is before start date, don't swap automatically during preview
					endDate = formatDateForOutput(parsedDate, endDateFormat);
				} else {
					endDate = formatDateForOutput(parsedDate, endDateFormat);
				}
			}
		}
	}

	/**
	 * Apply the manually entered dates
	 */
	function applyManualInputs() {
		// Try to parse the start date
		const startParsedDate = parseInputDate(startInputValue);
		if (startParsedDate) {
			startDate = formatDateForOutput(startParsedDate, startDateFormat);
			// Update current month to match the entered date
			currentMonth = new Date(startParsedDate.getFullYear(), startParsedDate.getMonth(), 1);
		} else if (startInputValue === '') {
			// If input is empty, clear the date
			startDate = null;
		}
		
		// Try to parse the end date if in range mode
		if (isRange && endInputValue) {
			const endParsedDate = parseInputDate(endInputValue);
			if (endParsedDate) {
				const startDateObj = ensureDate(startDate);
				if (startDateObj && endParsedDate < startDateObj) {
					// If end date is before start date, swap them
					endDate = formatDateForOutput(startDateObj, endDateFormat);
					startDate = formatDateForOutput(endParsedDate, startDateFormat);
				} else {
					endDate = formatDateForOutput(endParsedDate, endDateFormat);
				}
			} else if (endInputValue === '') {
				// If input is empty, clear the date
				endDate = null;
			}
		}
		
		// Update the display values and reset manual editing flag
		isManuallyEditing = false;
		updateDateValues();
		
		// Trigger onChange if provided
		if (onChange) {
			onChange({ 
				start: startDate, 
				end: endDate 
			});
		}
	}

	// Handle input blur to format the date correctly
	/**
	 * Handle input blur to format the date correctly without applying
	 */
	function handleInputBlur() {
		// Only apply values if they've been manually edited
		if (isManuallyEditing) {
			applyManualInputs();
		}
	}

	/**
	 * Handle keyboard events for the input fields
	 * @param {KeyboardEvent} e - The keyboard event
	 * @param {'start'|'end'} inputType - Which input field triggered the event
	 */
	function handleKeyDown(e, inputType) {
		// Enter key (13)
		if (e.key === 'Enter') {
			// If the user presses enter, try to apply the manual inputs
			applyManualInputs();
			
			// Handle focus change for range mode
			if (isRange && inputType === 'start') {
				if (endInputRef) {
					endInputRef.focus();
				}
			} else {
				// In single mode or when entering end date, close the calendar
				showStartPicker = false;
				showEndPicker = false;
			}
			e.preventDefault();
		}
	}

	export function reset() {
		startDate = null;
		endDate = null;
		startInputValue = '';
		endInputValue = '';
		isManuallyEditing = false;
	}

	/**
	 * Positions the date picker dropdown based on the position of the input element
	 */
	function adjustPickerPosition() {
		if (!pickerContainerRef || !inputsContainerRef) return;

		// Make sure the picker is displayed so we can measure it
		pickerContainerRef.style.display = 'flex';
		pickerContainerRef.style.visibility = 'hidden';

		const inputsRect = inputsContainerRef.getBoundingClientRect();
		const pickerRect = pickerContainerRef.getBoundingClientRect();
		
		// Available space calculations
		const availableSpaceBelow = window.innerHeight - inputsRect.bottom;
		
		// Check if we're inside a modal
		const isInModal = datePickerRef?.closest('.modal') !== null;

		// Set fixed positioning
		pickerContainerRef.style.position = 'fixed';
		
		// Position calculation
		if (!isInModal) {
			// Position vertically
			if (availableSpaceBelow < pickerRect.height) {
				// Position above the input if not enough space below
				pickerContainerRef.style.top = `${inputsRect.top - pickerRect.height}px`;
			} else {
				// Position below the input
				pickerContainerRef.style.top = `${inputsRect.bottom}px`;
			}
			
			// Position horizontally
			// Ensure the picker doesn't extend beyond the right edge of the screen
			if (inputsRect.left + pickerRect.width > window.innerWidth) {
				const rightAlignment = Math.max(window.innerWidth - pickerRect.width, 0);
				pickerContainerRef.style.left = `${rightAlignment}px`;
			} else {
				pickerContainerRef.style.left = `${inputsRect.left}px`;
			}
		}
		
		// Make visible again
		pickerContainerRef.style.visibility = 'visible';
	}

	/**
	 * Adds event listeners for scroll and resize events
	 */
	function setupPositionListeners() {
		if (showStartPicker || showEndPicker) {
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
		if (showStartPicker || showEndPicker) {
			// Use setTimeout to ensure the DOM has updated
			setTimeout(setupPositionListeners, 0);
		} else {
			window.removeEventListener('scroll', adjustPickerPosition, true);
			window.removeEventListener('resize', adjustPickerPosition);
		}
	});

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
	function formatDateDisplay(date) {
		if (!date) return '';
		try {
			return date.toLocaleDateString(isEuropean ? 'en-GB' : 'en-US', {
				month: '2-digit',
				day: '2-digit',
				year: 'numeric'
			});
		} catch (e) {
			console.error("Error formatting date:", e);
			return '';
		}
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

	function handleClickOutside() {
		// Always close the pickers when clicking outside
		showStartPicker = false;
		showEndPicker = false;
		// Clean up position listeners
		window.removeEventListener('scroll', adjustPickerPosition, true);
		window.removeEventListener('resize', adjustPickerPosition);
	}

	/**
	 * Determine if this day is the visual start of the selected range
	 * @param {Date} day - The day to check
	 * @returns {boolean} - Whether this day is the range start
	 */
	function isRangeStart(day) {
		const startDateObj = ensureDate(startDate);
		if (!startDateObj) return false;

		// If we have a completed range
		if (endDate) {
			const endDateObj = ensureDate(endDate);
			if (!endDateObj) return day.getTime() === startDateObj.getTime();
			
			const earlierDate = startDateObj < endDateObj ? startDateObj : endDateObj;
			return day.getTime() === earlierDate.getTime();
		}

		// If we're in the process of selecting a range
		if (hoveredDate) {
			// If hovering before the start date
			if (hoveredDate < startDateObj) {
				return day.getTime() === hoveredDate.getTime();
			}
			// If hovering after the start date
			else {
				return day.getTime() === startDateObj.getTime();
			}
		}

		// If it's just the start date
		return day.getTime() === startDateObj.getTime();
	}

	/**
	 * Determine if this day is the visual end of the selected range
	 * @param {Date} day - The day to check
	 * @returns {boolean} - Whether this day is the range end
	 */
	function isRangeEnd(day) {
		const startDateObj = ensureDate(startDate);
		if (!startDateObj) return false;

		// If we have a completed range
		if (endDate) {
			const endDateObj = ensureDate(endDate);
			if (!endDateObj) return day.getTime() === startDateObj.getTime();
			
			const laterDate = startDateObj > endDateObj ? startDateObj : endDateObj;
			return day.getTime() === laterDate.getTime();
		}

		// If we're in the process of selecting a range
		if (hoveredDate) {
			// If hovering before the start date
			if (hoveredDate < startDateObj) {
				return day.getTime() === startDateObj.getTime();
			}
			// If hovering after the start date
			else {
				return day.getTime() === hoveredDate.getTime();
			}
		}

		// If it's just the start date (no hover or end date)
		return day.getTime() === startDateObj.getTime();
	}

	/**
	 * Determine if this day is within the selected range
	 * @param {Date} day - The day to check
	 * @returns {boolean} - Whether this day is within the range
	 */
	function isInRange(day) {
		const startDateObj = ensureDate(startDate);
		if (!startDateObj) return false;

		// If we have a completed range
		if (endDate) {
			const endDateObj = ensureDate(endDate);
			if (!endDateObj) return false;
			
			const min = startDateObj < endDateObj ? startDateObj : endDateObj;
			const max = startDateObj < endDateObj ? endDateObj : startDateObj;
			return day > min && day < max;
		}

		// If we're in the process of selecting a range
		if (hoveredDate && isRange) {
			const min = startDateObj < hoveredDate ? startDateObj : hoveredDate;
			const max = startDateObj < hoveredDate ? hoveredDate : startDateObj;
			return day > min && day < max;
		}

		return false;
	}

	/**
	 * Handle date selection when a user clicks on a day in the calendar
	 * @param {Date} date - The selected date
	 */
	function selectDate(date) {
		if (!isRange) {
			// Convert to the appropriate format before assigning
			startDate = formatDateForOutput(date, startDateFormat);
			updateDateValues();
			
			// Don't trigger onChange here - wait for Apply button
			
			// Don't automatically close the picker
			return;
		}

		const startDateObj = ensureDate(startDate);
		const endDateObj = ensureDate(endDate);

		if (!startDateObj || (startDateObj && endDateObj)) {
			// First selection in a new range - convert to appropriate format
			startDate = formatDateForOutput(date, startDateFormat);
			endDate = null;
			updateDateValues();
			
			// Don't trigger onChange here - wait for Apply button
			
			// Don't close the picker yet, waiting for second selection
		} else {
			// Second selection to complete the range
			if (date < startDateObj) {
				// If selecting backwards, swap the dates
				endDate = formatDateForOutput(startDateObj, endDateFormat);
				startDate = formatDateForOutput(date, startDateFormat);
			} else {
				endDate = formatDateForOutput(date, endDateFormat);
			}
			updateDateValues();
			
			// Don't trigger onChange here - wait for Apply button
		}
	}

	// Navigation functions
	function prevMonth() {
		hasUserNavigated = true;
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
	}

	function nextMonth() {
		hasUserNavigated = true;
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
	}

	// Weekday names
	const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
				startDate = formatDateForOutput(getToday(), startDateFormat);
				updateDateValues();
				if (onChange) {
					onChange({ 
						start: startDate, 
						end: endDate 
					});
				}
			}
		},
		{
			label: 'Yesterday',
			action: () => {
				startDate = formatDateForOutput(addDays(getToday(), -1), startDateFormat);
				updateDateValues();
				if (onChange) {
					onChange({ 
						start: startDate, 
						end: endDate 
					});
				}
			}
		},
		{
			label: 'Tomorrow',
			action: () => {
				startDate = formatDateForOutput(addDays(getToday(), 1), startDateFormat);
				updateDateValues();
				if (onChange) {
					onChange({ 
						start: startDate, 
						end: endDate 
					});
				}
			}
		},
		{
			label: 'Next week',
			action: () => {
				startDate = formatDateForOutput(addDays(getToday(), 7), startDateFormat);
				updateDateValues();
				if (onChange) {
					onChange({ 
						start: startDate, 
						end: endDate 
					});
				}
			}
		},
		{
			label: 'Next Monday',
			action: () => {
				startDate = formatDateForOutput(getNextMonday(), startDateFormat);
				updateDateValues();
				if (onChange) {
					onChange({ 
						start: startDate, 
						end: endDate 
					});
				}
			}
		},
		{
			label: 'Next month',
			action: () => {
				const today = getToday();
				startDate = formatDateForOutput(new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()), startDateFormat);
				updateDateValues();
				if (onChange) {
					onChange({ 
						start: startDate, 
						end: endDate 
					});
				}
			}
		},
		{
			label: 'Next year',
			action: () => {
				const today = getToday();
				startDate = formatDateForOutput(new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()), startDateFormat);
				updateDateValues();
				if (onChange) {
					onChange({ 
						start: startDate, 
						end: endDate 
					});
				}
			}
		}
	];

	// Range date quick selection options
	const rangeDateOptions = [
		{
			label: translation?.thisweek || "This week",
			action: () => {
				const today = getToday();
				startDate = formatDateForOutput(getWeekStartDate(today), startDateFormat);
				endDate = formatDateForOutput(getWeekEndDate(today), endDateFormat);
				updateDateValues();
				if (onChange) {
					onChange({ 
						start: startDate, 
						end: endDate 
					});
				}
			}
		},
		{
			label: translation?.lastweek || "Last week",
			action: () => {
				const lastWeek = addDays(getToday(), -7);
				startDate = formatDateForOutput(getWeekStartDate(lastWeek), startDateFormat);
				endDate = formatDateForOutput(getWeekEndDate(lastWeek), endDateFormat);
				updateDateValues();
				if (onChange) {
					onChange({ 
						start: startDate, 
						end: endDate 
					});
				}
			}
		},
		{
			label: translation?.thismonth || "This month",
			action: () => {
				const today = getToday();
				startDate = formatDateForOutput(getFirstDayOfMonth(today), startDateFormat);
				endDate = formatDateForOutput(getLastDayOfMonth(today), endDateFormat);
				updateDateValues();
				if (onChange) {
					onChange({ 
						start: startDate, 
						end: endDate 
					});
				}
			}
		},
		{
			label: translation?.lastmonth || "Last month",
			action: () => {
				const today = getToday();
				const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
				startDate = formatDateForOutput(getFirstDayOfMonth(lastMonth), startDateFormat);
				endDate = formatDateForOutput(getLastDayOfMonth(lastMonth), endDateFormat);
				updateDateValues();
				if (onChange) {
					onChange({ 
						start: startDate, 
						end: endDate 
					});
				}
			}
		},
		{
			label: translation?.thisyear || "This year",
			action: () => {
				const today = getToday();
				startDate = formatDateForOutput(getFirstDayOfYear(today.getFullYear()), startDateFormat);
				endDate = formatDateForOutput(getLastDayOfYear(today.getFullYear()), endDateFormat);
				updateDateValues();
				if (onChange) {
					onChange({ 
						start: startDate, 
						end: endDate 
					});
				}
			}
		},
		{
			label: translation?.lastyear || "Last year",
			action: () => {
				const today = getToday();
				startDate = formatDateForOutput(getFirstDayOfYear(today.getFullYear() - 1), startDateFormat);
				endDate = formatDateForOutput(getLastDayOfYear(today.getFullYear() - 1), endDateFormat);
				updateDateValues();
				if (onChange) {
					onChange({ 
						start: startDate, 
						end: endDate 
					});
				}
			}
		}
	];
</script>

<div
	class="datepicker {showStartPicker || showEndPicker ? 'datepicker--focused' : ''}"
	use:clickOutside
	onclick_outside={handleClickOutside}
	bind:this={datePickerRef}
>
	<!-- Input Fields -->
	<div class="datepicker--inputs" bind:this={inputsContainerRef}>
		<input
			autocomplete="off"
			name={name}
			bind:this={startInputRef}
			type="text"
			value={startInputValue}
			placeholder={translation?.selectdate || "Select date"}
			onfocus={() => (showStartPicker = true)}
			oninput={handleStartInputChange}
			onblur={() => handleInputBlur()}
			onkeydown={(e) => handleKeyDown(e, 'start')}
			readonly={!manualInput}
		/>
		{#if isRange}
			<Icon icon="ic:baseline-compare-arrows" width="24" height="24" />
			<input
				name={name}
				bind:this={endInputRef}
				type="text"
				value={endInputValue}
				placeholder={translation.selectenddate || "Select end date"}
				onfocus={() => (showEndPicker = true)}
				oninput={handleEndInputChange}
				onblur={() => handleInputBlur()}
				onkeydown={(e) => handleKeyDown(e, 'end')}
				readonly={!manualInput}
			/>
		{/if}
		<button
			class="datepicker--calendar-button"
			type="button"
			onclick={() => (showStartPicker = true)}
			title="Open calendar"
		>
			<Icon icon="ic:outline-calendar-today" width="18" height="18" />
		</button>
		<!-- <button 
			class="datepicker--apply-button" 
			onclick={() => {
				applyManualInputs();
				showStartPicker = false;
				showEndPicker = false;
			}}
			title="Apply date"
		>
			<Icon icon="mdi:check" width="18" height="18" />
		</button> -->
	</div>

	<!-- Calendar Display -->
	{#if showStartPicker || (isRange && showEndPicker)}
		<div class="datepicker--picker-container" bind:this={pickerContainerRef}>
			<!-- Quick Selection Panel -->
			{#if quickSelect}
				<div class="datepicker--quick-select">
					<ul>
						{#if !isRange}
							{#each singleDateOptions as option}
								<li>
									<button type="button" onclick={option.action}
										>{option.label}
										<Icon icon="mdi:chevron-right" width="13" />
									</button>
								</li>
							{/each}
						{:else}
							{#each rangeDateOptions as option}
								<li>
									<button type="button" onclick={option.action}
										>{option.label}
										<Icon icon="mdi:chevron-right" width="13" />
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
					<button aria-label="prev" class="datepicker--month-nav" type="button" onclick={prevMonth}>
						<Icon icon="mdi:chevron-left" width="14" />
					</button>
					<div class="datepicker--month-title">{formatMonth(currentMonth)}</div>
					<button aria-label="next" class="datepicker--month-nav" type="button" onclick={nextMonth}>
						<Icon icon="mdi:chevron-right" width="14" />
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
						type="button"
						class:datepicker--other-month={day.getMonth() !== currentMonth.getMonth()}
						class:selected={isSameDay(day, ensureDate(startDate)) ||
							isSameDay(day, ensureDate(endDate))}
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
				
				<!-- Footer with actions -->
				<div class="datepicker--footer">
					<button 
						class="datepicker--footer-button datepicker--cancel-button"
						type="button"
						onclick={() => {
							// Reset input values to match actual dates
							updateDateValues();
							showStartPicker = false;
							showEndPicker = false;
						}}
					>
						{translation?.cancel || "Cancel"}
					</button>
					<button 
						class="datepicker--footer-button datepicker--apply-button-footer"
						type="button"
						onclick={() => {
							applyManualInputs();
							showStartPicker = false;
							showEndPicker = false;
						}}
					>
						{translation?.apply || "Apply"}
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
