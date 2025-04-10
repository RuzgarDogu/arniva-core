<script>
	/**
	 * @typedef {Object} PaginationProps
	 * @property {number} totalItems - The total number of items to paginate.
	 * @property {number} [pageSize=10] - The number of items per page.
	 * @property {number} [initialPage=1] - The initial page to display.
	 * @property {number} [siblingCount=1] - How many page numbers to show on each side of the current page.
	 * @property {(page: number) => void} onPageChange - Callback function executed when the page changes. It receives the new page number.
	 */

	/** @type {PaginationProps} */
	let {
		totalItems,
		pageSize = 10,
		initialPage = 1,
		siblingCount = 0, // Default: show current +/- 1 page
		onPageChange
	} = $props();

	/** The current active page number. */
	let currentPage = $state(initialPage);

	/** Recalculate total pages whenever totalItems or pageSize changes. */
	let totalPages = $derived(
		totalItems > 0 && pageSize > 0 ? Math.ceil(totalItems / pageSize) : 1
	);

	// Effect to keep currentPage within valid bounds
	$effect(() => {
		const currentTotalPages = totalPages;
		if (currentPage > currentTotalPages) {
			currentPage = currentTotalPages;
		}
		if (currentPage < 1) {
			currentPage = 1;
		}
	});

	/**
	 * Navigates to a specific page number and notifies the parent.
	 * @param {number} page The target page number.
	 */
	function goToPage(page) {
		if (page >= 1 && page <= totalPages && page !== currentPage) {
			currentPage = page;
			onPageChange(currentPage);
		}
	}

	/** Navigates to the previous page. */
	function previousPage() {
		goToPage(currentPage - 1);
	}

	/** Navigates to the next page. */
	function nextPage() {
		goToPage(currentPage + 1);
	}

	// --- Logic for generating the visible page numbers using $derived ---
	const ELLIPSIS = '...';

	/** Helper function to generate a range of numbers. */
	function range(start, end) {
		let length = end - start + 1;
		if (length <= 0) return []; // Return empty if range is invalid
		return Array.from({ length }, (_, idx) => idx + start);
	}

	/**
	 * Derived state calculating the array of page numbers and ellipses to display.
	 * @type {($derived<(number | string)[]>)}
	 */
	let paginationRange = $derived.by(() => {
		const currentTotalPages = totalPages;
		const currentSiblingCount = Math.max(0, siblingCount); // Ensure non-negative
		const page = currentPage;

		// Handle trivial case: only 1 page total
		if (currentTotalPages <= 1) {
			return currentTotalPages === 1 ? [1] : [];
		}

		// Calculate the number of pages to display:
		// 1 (first) + 1 (last) + 1 (current) + (2 * siblingCount) + 2 (potential ellipses)
        // We simplify this: Aim to show firstPage, lastPage, currentPage, siblings.
        // Let's calculate the number of elements needed for the "core" block:
        // currentPage + siblings on left + siblings on right = 1 + 2 * currentSiblingCount
        const coreBlockLength = 1 + 2 * currentSiblingCount;

        // Calculate the number of page numbers we show *in addition* to first and last potentially with ellipses
        // This helps determine if ellipses are needed. Total slots needed roughly:
        // 1 (first) + 1 (last) + coreBlockLength + 2 (ellipses) = 5 + 2 * currentSiblingCount
		const totalPageNumbersInResultEstimate = 5 + 2 * currentSiblingCount;


		/*
		 * Case 1: Total pages are less than the number we'd want to display with ellipses.
		 * Show all pages directly without any ellipses.
		 * Example: totalPages=5, siblingCount=1 -> estimate=7. Show [1, 2, 3, 4, 5]
		 */
		if (totalPageNumbersInResultEstimate >= currentTotalPages) {
			// console.log("Pagination Range: Case 1 (Show All)", range(1, currentTotalPages));
			return range(1, currentTotalPages);
		}

		/*
		 * Calculate left and right sibling indices, constrained within [1, totalPages].
		 */
		const leftSiblingIndex = Math.max(page - currentSiblingCount, 1);
		const rightSiblingIndex = Math.min(page + currentSiblingCount, currentTotalPages);

		/*
		 * Determine if ellipses are needed. Show ellipsis if the gap is > 1 page number.
		 * Left Ellipsis: Is there a gap between page 1 and the left sibling?
		 * Right Ellipsis: Is there a gap between the right sibling and the last page?
		 */
		const shouldShowLeftEllipsis = leftSiblingIndex > 2;
		const shouldShowRightEllipsis = rightSiblingIndex < currentTotalPages - 1;

		const firstPageIndex = 1;
		const lastPageIndex = currentTotalPages;

		/*
		 * Case 2: No Left Ellipsis, Right Ellipsis Needed
		 * Display: [1, 2, 3, 4, 5, ..., 10] (example for siblingCount=1, current=3, total=10)
		 * We show: firstPage + (currentPage + siblings) range + ELLIPSIS + lastPage
		 */
		if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
            // Determine the page numbers to show on the left side
            // Should include page 1 up to the right sibling
			let leftRangeEnd = 1 + coreBlockLength + (currentSiblingCount > 0 ? 1 : 0); // Adjust based on complexity, aim for fixed # usually. Try a simpler fixed approach:
            let showCount = 3 + 2 * currentSiblingCount; // Fixed slots around the start
			let leftRange = range(1, showCount);
			const result = [...leftRange, ELLIPSIS, lastPageIndex];
			// console.log("Pagination Range: Case 2 (Right Ellipsis)", result);
			return result;
		}

		/*
		 * Case 3: Left Ellipsis Needed, No Right Ellipsis
		 * Display: [1, ..., 6, 7, 8, 9, 10] (example for siblingCount=1, current=8, total=10)
		 * We show: firstPage + ELLIPSIS + (currentPage + siblings) range + lastPage
		 */
		if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
            let showCount = 3 + 2 * currentSiblingCount; // Fixed slots around the end
			let rightRangeStart = currentTotalPages - showCount + 1;
			let rightRange = range(rightRangeStart, currentTotalPages);
			const result = [firstPageIndex, ELLIPSIS, ...rightRange];
			// console.log("Pagination Range: Case 3 (Left Ellipsis)", result);
			return result;
		}

		/*
		 * Case 4: Both Ellipses Needed
		 * Display: [1, ..., 4, 5, 6, ..., 10] (example for siblingCount=1, current=5, total=10)
		 * We show: firstPage + ELLIPSIS + (leftSibling...rightSibling) range + ELLIPSIS + lastPage
		 */
		if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
			let middleRange = range(leftSiblingIndex, rightSiblingIndex);
			const result = [firstPageIndex, ELLIPSIS, ...middleRange, ELLIPSIS, lastPageIndex];
			// console.log("Pagination Range: Case 4 (Both Ellipses)", result);
			return result;
		}

        // Fallback (should not be common if logic is correct)
        console.warn("Pagination range calculation reached unexpected fallback for totalPages:", currentTotalPages, "currentPage:", page);
        return range(1, currentTotalPages); // Default to showing all pages if logic fails

	});


	// --- Reactive flags for disabling buttons ---
	let isFirstPage = $derived(currentPage === 1);
	let isLastPage = $derived(currentPage === totalPages || totalPages === 0);

	// For debugging: log the calculated range when it changes
	$effect(() => {
		console.log("Calculated paginationRange:", paginationRange);
	});

</script>

<nav class="pagination-nav" aria-label="Pagination">
	<ul class="pagination-list">
		<li class="pagination-item">
			<button
				class="pagination-button pagination-prev"
				onclick={previousPage}
				disabled={isFirstPage}
				aria-label="Go to previous page"
			>
				&lt; Prev
			</button>
		</li>

		{#each paginationRange as pageNumber, index (index)} <li class="pagination-item">
				{#if pageNumber === ELLIPSIS}
					<span class="pagination-ellipsis" aria-hidden="true">{ELLIPSIS}</span>
				{:else if typeof pageNumber === 'number'}
					<button
						class="pagination-button page-number"
						class:active={currentPage === pageNumber}
						onclick={() => goToPage(pageNumber)}
						aria-label={`Go to page ${pageNumber}`}
						aria-current={currentPage === pageNumber ? 'page' : undefined}
						disabled={totalPages <= 1}
					>
						{pageNumber}
					</button>
				{/if}
			</li>
		{/each}

		<li class="pagination-item">
			<button
				class="pagination-button pagination-next"
				onclick={nextPage}
				disabled={isLastPage}
				aria-label="Go to next page"
			>
				Next &gt;
			</button>
		</li>
	</ul>
</nav>

<style>
	.pagination-nav {
		display: flex;
		justify-content: center;
		margin-top: 1rem;
		margin-bottom: 1rem;
		font-family: sans-serif;
	}

	.pagination-list {
		display: flex;
		list-style: none;
		padding: 0;
		margin: 0;
		flex-wrap: wrap; /* Allow wrapping on smaller screens */
		justify-content: center; /* Center items when they wrap */
	}

	.pagination-item {
		margin: 0 0.25rem; /* Spacing between items */
        margin-bottom: 0.5rem; /* Spacing when items wrap */
	}

	.pagination-button {
		display: inline-block;
		padding: 0.5em 0.8em;
		border: 1px solid #ccc;
		background-color: #fff;
		color: #337ab7; /* Bootstrap-like blue */
		cursor: pointer;
		border-radius: 4px;
		transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
		font-size: 0.9rem;
		min-width: 40px; /* Ensure minimum touch target size */
		text-align: center;
	}

	.pagination-button:hover:not(:disabled) {
		background-color: #eee;
		border-color: #adadad;
	}

	.pagination-button:disabled {
		color: #aaa;
		cursor: not-allowed;
		background-color: #f9f9f9;
		border-color: #eee;
	}

	.pagination-button.active {
		background-color: #337ab7;
		color: #fff;
		border-color: #337ab7;
		font-weight: bold;
		cursor: default;
	}

    .pagination-ellipsis {
        display: inline-flex; /* Use flex to align vertically like buttons */
        align-items: center;
        padding: 0.5em 0.5em;
        color: #777;
        min-width: 40px; /* Match button width */
        justify-content: center; /* Center the ellipsis */
    }

	/* Basic responsiveness: Adjust padding/font-size slightly on smaller screens */
	@media (max-width: 600px) {
		.pagination-button {
			padding: 0.4em 0.6em;
			font-size: 0.85rem;
            min-width: 35px;
		}
        .pagination-ellipsis {
             padding: 0.4em 0.4em;
             min-width: 35px;
        }
		.pagination-item {
			margin: 0 0.15rem;
            margin-bottom: 0.4rem;
		}
	}
</style>