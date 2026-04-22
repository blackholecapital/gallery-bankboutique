export class ValidationError extends Error {
  public readonly issues: string[];

  constructor(issues: string[]) {
    super(issues.join("; "));
    this.name = "ValidationError";
    this.issues = issues;
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function requireRecord(
  value: unknown,
  label: string,
): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new ValidationError([`${label} must be an object`]);
  }

  return value;
}

export function requireString(
  value: unknown,
  field: string,
  issues: string[],
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    issues.push(`${field} must be a non-empty string`);
    return "";
  }

  return value;
}

export function requireBoolean(
  value: unknown,
  field: string,
  issues: string[],
): boolean {
  if (typeof value !== "boolean") {
    issues.push(`${field} must be a boolean`);
    return false;
  }

  return value;
}

export function requireIsoDateTime(
  value: unknown,
  field: string,
  issues: string[],
): string {
  const result = requireString(value, field, issues);

  if (result && Number.isNaN(Date.parse(result))) {
    issues.push(`${field} must be a valid ISO datetime string`);
  }

  return result;
}

export function requireStringArray(
  value: unknown,
  field: string,
  issues: string[],
): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    issues.push(`${field} must be a string array`);
    return [];
  }

  return value;
}

export function requireEnum<T extends string>(
  value: unknown,
  field: string,
  allowed: readonly T[],
  issues: string[],
): T {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    issues.push(`${field} must be one of: ${allowed.join(", ")}`);
    return allowed[0];
  }

  return value as T;
}

export function throwIfIssues(issues: string[]): void {
  if (issues.length > 0) {
    throw new ValidationError(issues);
  }
}
