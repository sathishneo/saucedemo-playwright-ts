import { readFileSync } from 'node:fs';
import path from 'node:path';

// Loads a JSON file from the test-data folder.
// Playwright runs from the project root, so this path resolves correctly locally and in CI.
export function loadJson<T>(fileName: string): T {
  const fullPath = path.resolve('test-data', fileName);
  return JSON.parse(readFileSync(fullPath, 'utf-8')) as T;
}
