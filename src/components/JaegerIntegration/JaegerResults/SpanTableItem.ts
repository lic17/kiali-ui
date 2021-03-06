import { Span } from 'types/JaegerInfo';
import { extractOpenTracingBaseInfo, getSpanType, getWorkloadFromSpan } from '../JaegerHelper';

export type SpanTableItem = Span & {
  type: 'envoy' | 'http' | 'tcp' | 'unknown';
  component: string;
  hasError: boolean;
  namespace: string;
  app: string;
  linkToApp: string;
  workload?: string;
  pod?: string;
  linkToWorkload?: string;
};

// Extracts some information from a span to make it suitable for table-display
export const itemFromSpan = (span: Span, defaultNamespace: string): SpanTableItem => {
  const type = getSpanType(span);
  const workloadNs = getWorkloadFromSpan(span);
  const info = extractOpenTracingBaseInfo(span);
  const split = span.process.serviceName.split('.');
  const app = split[0];
  const namespace = workloadNs ? workloadNs.namespace : split.length > 1 ? split[1] : defaultNamespace;
  const linkToApp = '/namespaces/' + namespace + '/applications/' + app;
  const linkToWorkload = workloadNs ? '/namespaces/' + namespace + '/workloads/' + workloadNs.workload : undefined;
  return {
    ...span,
    type: type,
    component: info.component || 'unknown',
    hasError: info.hasError,
    namespace: namespace,
    app: app,
    linkToApp: linkToApp,
    workload: workloadNs?.workload,
    pod: workloadNs?.pod,
    linkToWorkload: linkToWorkload
  };
};
