/**
 * Represents a single option in a selection list
 */
export type Option = {
  label: string;
  value: string | boolean | number;
};

/**
 * Range value type used for both date and numeric ranges
 */
export type RangeValue = {
  min?: number;
  max?: number;
  start?: string | number;
  end?: string | number;
};

/**
 * Date picker translation strings
 */
export type DateTranslation = {
  months?: string[];
  weekdays?: string[];
  weekdaysShort?: string[];
  today?: string;
  clear?: string;
  close?: string;
  // Additional date translation properties
  selectdate?: string;
  selectenddate?: string;
  thisweek?: string;
  lastweek?: string;
  thismonth?: string;
  lastmonth?: string;
  thisyear?: string;
  lastyear?: string;
};

/**
 * Filter field configuration
 */
export type Field = {
  name: string;
  label: string;
  text: string;
  _id: string;
  type: 'range' | 'date' | 'select' | 'multiselect' | 'boolean';
  options?: Array<Option | string>;
  range?: {
    min: number;
    max: number;
  };
  isAmerican?: boolean;
  dateRange?: boolean;
  value?: string | string[] | boolean | RangeValue | null;
  isOpen?: boolean;
  order?: number;
  // Server-side filtering properties
  serverSide?: boolean;
  endpoint?: string;
  nameKey?: string;
  placeholder?: string;
};

/**
 * Filter configuration object
 */
export type FilterConfig = {
  name: string;
  fields: Field[];
  translation?: {
    general?: {
      filter?: string;
      clear?: string;
      delete?: string;
      selected?: string;
      loading?: string;
      loadingOptions?: string;
      noOptions?: string;
    };
    date?: DateTranslation;
  };
  search?: SearchConfig;
};

/**
 * Represents a generic row of data to be filtered
 */
export type DataRow = Record<string, any>;

/**
 * Maps field names to their types
 */
export type FieldTypeMap = Record<string, string>;

/**
 * Date range representation
 */
export type DateRange = {
  start?: string;
  end?: string;
};

/**
 * Object containing filter criteria
 */
export type Filters = {
  search?: string | { column: string, value: string };
  [key: string]: string | boolean | number | string[] | RangeValue | { column: string, value: string } | undefined;
};

/**
 * Function type for applying filters to data
 */
export type ApplyFiltersFunction = (
  data: DataRow[],
  filters: Filters,
  config: FilterConfig
) => DataRow[];

/**
 * Search column definition
 */
export type SearchColumns = {
  label: string;
  value: string;
};

/**
 * Column type for dropdown selection
 */
export type Column = {
  value: string;
  label: string;
  id?: string | number;
};

/**
 * Search configuration
 */
export type SearchConfig = {
  /**
   * Placeholder text for search input
   */
  placeholder?: string;
  
  /**
   * Columns to search in
   */
  columns: Array<SearchColumns | string>;
};