import { FILTER_ACTION_APPEND, FILTER_ACTION_UPDATE, FilterTypes, FilterValue, RunnableFilter } from 'types/Filters';
import { SpanTableItem } from './SpanTableItem';

const byWorkload = (workloads: FilterValue[]): RunnableFilter<SpanTableItem> => {
  return {
    id: 'workload',
    title: 'Workload',
    placeholder: 'Filter by Workload',
    filterType: FilterTypes.typeAhead,
    action: FILTER_ACTION_APPEND,
    filterValues: workloads,
    run: (item, filters) => filters.filters.some(f => f.value === item.workload)
  };
};

const byApp = (apps: FilterValue[]): RunnableFilter<SpanTableItem> => {
  return {
    id: 'app',
    title: 'App',
    placeholder: 'Filter by App',
    filterType: FilterTypes.typeAhead,
    action: FILTER_ACTION_APPEND,
    filterValues: apps,
    run: (item, filters) => filters.filters.some(f => f.value === item.app)
  };
};

const byComponent = (components: FilterValue[]): RunnableFilter<SpanTableItem> => {
  return {
    id: 'type',
    title: 'Component',
    placeholder: 'Filter by Span Component',
    filterType: FilterTypes.typeAhead,
    action: FILTER_ACTION_APPEND,
    filterValues: components,
    run: (item, filters) => filters.filters.some(f => f.value === item.component)
  };
};

const byOperation = (ops: FilterValue[]): RunnableFilter<SpanTableItem> => {
  return {
    id: 'operation',
    title: 'Operation',
    placeholder: 'Filter by Operation Name',
    filterType: FilterTypes.typeAhead,
    action: FILTER_ACTION_APPEND,
    filterValues: ops,
    run: (item, filters) => filters.filters.some(f => f.value === item.operationName)
  };
};

const byError: RunnableFilter<SpanTableItem> = {
  id: 'error',
  title: 'Error',
  placeholder: 'Filter by Error',
  filterType: FilterTypes.select,
  action: FILTER_ACTION_UPDATE,
  filterValues: [
    { id: 'yes', title: 'With errors' },
    { id: 'no', title: 'Without errors' }
  ],
  run: (item, filters) => filters.filters.some(f => f.value === (item.hasError ? 'With errors' : 'Without errors'))
};

export const spanFilters = (spans: SpanTableItem[]): RunnableFilter<SpanTableItem>[] => {
  const workloads = new Set<string>();
  const apps = new Set<string>();
  const components = new Set<string>();
  const operations = new Set<string>();
  spans.forEach(s => {
    workloads.add(s.workload || 'unknown');
    apps.add(s.app);
    components.add(s.component);
    operations.add(s.operationName);
  });
  return [
    byWorkload(Array.from(workloads).map(w => ({ id: w, title: w }))),
    byApp(Array.from(apps).map(w => ({ id: w, title: w }))),
    byComponent(Array.from(components).map(w => ({ id: w, title: w }))),
    byOperation(Array.from(operations).map(w => ({ id: w, title: w }))),
    byError
  ];
};
