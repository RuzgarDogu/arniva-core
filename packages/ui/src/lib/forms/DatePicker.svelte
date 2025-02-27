<script>
    import { clickOutside } from '../functions'
    let { isRange=false, quickSelect=false, isEuropean=true, manualInput=false } = $props()
  
    // State management with Svelte 5 runes
    let startDate = $state(null);
    let endDate = $state(null);
    let hoveredDate = $state(null);
    let showStartPicker = $state(false);
    let showEndPicker = $state(false);
    let currentMonth = $state(new Date());
    let startInputValue = $state('');
    let endInputValue = $state('');
    
    // References to the input elements
    let startInputRef = $state(null);
    let endInputRef = $state(null);

    // Update input values when dates change
    $effect(() => {
        startInputValue = formatDate(startDate);
        if (isRange) {
            endInputValue = formatDate(endDate);
        }
    });

    // Handle keyboard events for the input fields
    function handleKeyDown(e, inputType) {
        // Enter key (13) or Tab key (9)
        if (e.keyCode === 13 || e.keyCode === 9) {
            if (inputType === 'start') {
                const parsedDate = parseInputDate(startInputValue);
                
                if (parsedDate) {
                    startDate = parsedDate;
                    
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
                        startInputValue = formatDate(startDate);
                        endInputValue = formatDate(endDate);
                    } else {
                        endDate = parsedDate;
                    }
                    
                    // Close the calendar after successful end date input
                    showStartPicker = false;
                    showEndPicker = false;
                }
            }
        }
    }

// Parse user input date string to Date object
function parseInputDate(dateStr) {
        if (!dateStr) return null;
        
        // Try to parse the input date based on the expected format
        let parts;
        let day, month, year;
        
        if (isEuropean) {
            // DD/MM/YYYY format
            parts = dateStr.split(/[.\-\/]/);
            if (parts.length !== 3) return null;
            
            day = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10) - 1; // months are 0-based
            year = parseInt(parts[2], 10);
        } else {
            // MM/DD/YYYY format
            parts = dateStr.split(/[.\-\/]/);
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

    // Handle input change for start date
    function handleStartInputChange(e) {
        startInputValue = e.target.value;
        const parsedDate = parseInputDate(startInputValue);
        
        if (parsedDate) {
            startDate = parsedDate;
            // Update current month to match the entered date
            currentMonth = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1);
        }
    }
    
    // Handle input change for end date
    function handleEndInputChange(e) {
        endInputValue = e.target.value;
        const parsedDate = parseInputDate(endInputValue);
        
        if (parsedDate) {
            endDate = parsedDate;
            // If end date is before start date, swap them
            if (startDate && parsedDate < startDate) {
                endDate = startDate;
                startDate = parsedDate;
                startInputValue = formatDate(startDate);
                endInputValue = formatDate(endDate);
            }
        }
    }
    
    // Handle input blur to format the date correctly
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
  
    // Date formatting
    function formatDate(date) {
      if (!date) return '';
      return date.toLocaleDateString(isEuropean ? 'en-GB' : 'en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      });
    }

    // Format month for display
    function formatMonth(date) {
      return date.toLocaleDateString(isEuropean ? 'en-GB' : 'en-US', {
        month: 'long',
        year: 'numeric'
      });
    }
  
    // Check if date is in range
    function isInRange(date) {
      if (!startDate || !endDate) {
        if (hoveredDate && startDate) {
          const lower = hoveredDate < startDate ? hoveredDate : startDate;
          const upper = hoveredDate > startDate ? hoveredDate : startDate;
          return date >= lower && date <= upper;
        }
        return false;
      }
      return date >= startDate && date <= endDate;
    }
  
    // Handle date selection
    function selectDate(date) {
      if (!isRange) {
        startDate = date;
        showStartPicker = false;
        return;
      }
  
      if (!startDate || (startDate && endDate)) {
        // First selection in a new range
        startDate = date;
        endDate = null;
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
        console.log('clicked outside');
        
        // If in range mode and only one date is selected (incomplete range),
        // reset all the selections
        if (isRange && ((startDate && !endDate) || (!startDate && endDate))) {
            startDate = null;
            endDate = null;
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
    
    function getFirstDayOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }
    
    function getLastDayOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
    
    function getFirstDayOfYear(year) {
        return new Date(year, 0, 1);
    }
    
    function getLastDayOfYear(year) {
        return new Date(year, 11, 31);
    }
    
    function getWeekStartDate(date) {
        const day = date.getDay();
        return addDays(date, -day); // Go back to Sunday
    }
    
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
                showStartPicker = false;
                showEndPicker = false;
            }
        }
    ];
</script>
  
<div class="datepicker" use:clickOutside onclick_outside={handleClickOutside}
class:datepicker-focused={showStartPicker || showEndPicker}
>
  <!-- Input Fields -->
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
    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracurrentColorerCarrier" stroke-linecurrentcap="round" stroke-linejoin="round"></g><g id="SVGRepo_icurrentColoronCarrier"> <path d="M20 10L4 10L9.5 4" stroke="currentColor" stroke-width="1.5" stroke-linecurrentcap="round" stroke-linejoin="round"></path> <path d="M4 14L20 14L14.5 20" stroke="currentColor" stroke-width="1.5" stroke-linecurrentcap="round" stroke-linejoin="round"></path> </g></svg>
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
    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracurrentColorerCarrier" stroke-linecurrentcap="round" stroke-linejoin="round"></g><g id="SVGRepo_icurrentColoronCarrier"> <path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z" stroke="currentColor" stroke-width="1.5"></path> <path d="M7 4V2.5" stroke="currentColor" stroke-width="1.5" stroke-linecurrentcap="round"></path> <path d="M17 4V2.5" stroke="currentColor" stroke-width="1.5" stroke-linecurrentcap="round"></path> <path d="M2.5 9H21.5" stroke="currentColor" stroke-width="1.5" stroke-linecurrentcap="round"></path> </g></svg>
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
                  <button onclick={option.action}>{option.label}
                    <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle> <path d="M8 12C12.6863 12 11.3137 12 16 12M16 12L13 9M16 12L13 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                  </button>
                </li>
              {/each}
            {:else}
              {#each rangeDateOptions as option}
                <li>
                  <button onclick={option.action}>{option.label}
                    <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle> <path d="M8 12C12.6863 12 11.3137 12 16 12M16 12L13 9M16 12L13 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
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
          <button class="datepicker--month-nav" onclick={prevMonth}>&lt;</button>
          <div class="datepicker--month-title">{formatMonth(currentMonth)}</div>
          <button class="datepicker--month-nav" onclick={nextMonth}>&gt;</button>
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
            onclick={() => selectDate(day)}
            onmouseover={() => { if (isRange && startDate && !endDate) hoveredDate = day }}
            onmouseout={() => { if (isRange) hoveredDate = null }}
          >
            {day.getDate()}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
  