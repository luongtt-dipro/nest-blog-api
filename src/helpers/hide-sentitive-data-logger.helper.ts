import { SENSITIVE_FIELDS } from 'src/constants/global.contant';

export function sanitizeBody(body: Record<string, any>): Record<string, any> {
  const sensitiveFields = SENSITIVE_FIELDS;

  return Object.keys(body).reduce(
    (sanitized, key) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      sanitized[key] = sensitiveFields.includes(key) ? '******' : body[key];
      return sanitized;
    },
    {} as Record<string, any>,
  );
}
