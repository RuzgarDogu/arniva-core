# Sticky Columns Feature

The Table component now supports sticky columns at both the start and end of the table, allowing for flexible table layouts with important columns always visible during horizontal scrolling.

## Usage

### Props

- `stickyColumns`: Number of columns to keep sticky from the left (start)
- `stickyColumnsEnd`: Number of columns to keep sticky from the right (end)
- `scroll`: Must be set to `true` for sticky columns to work

### Examples

#### 1. No Sticky Columns (Default)
```svelte
<Table scroll={true}>
  <!-- Regular scrollable table with no sticky columns -->
</Table>
```

#### 2. Sticky Columns at Start
```svelte
<Table scroll={true} stickyColumns={3}>
  <!-- First 3 columns will stick to the left -->
</Table>
```

#### 3. Sticky Columns at End
```svelte
<Table scroll={true} stickyColumnsEnd={2}>
  <!-- Last 2 columns will stick to the right -->
</Table>
```

#### 4. Sticky Columns on Both Ends
```svelte
<Table scroll={true} stickyColumns={2} stickyColumnsEnd={2}>
  <!-- First 2 columns stick to left, last 2 columns stick to right -->
</Table>
```

## Technical Implementation

The sticky columns functionality works by:

1. Detecting which cells should be sticky based on their position and the `stickyColumns`/`stickyColumnsEnd` props
2. Calculating cumulative widths of preceding/following columns to position sticky cells correctly
3. Applying appropriate CSS classes and inline styles for positioning
4. Managing z-index levels to ensure proper layering (headers above body cells)
5. Adding visual separators (box-shadow borders) to distinguish sticky columns

## CSS Classes

The implementation adds these CSS classes to cells:
- `table--cell--sticky`: Applied to all sticky cells
- `table--cell--sticky-start`: Applied to sticky columns at the start
- `table--cell--sticky-end`: Applied to sticky columns at the end

## Browser Support

Sticky positioning is supported in all modern browsers. The feature degrades gracefully in older browsers by falling back to regular scrolling behavior.
