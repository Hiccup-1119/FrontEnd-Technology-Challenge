import { vi } from 'vitest';

// Mock for testing
Object.defineProperty(window, 'fetch', {
  value: vi.fn(),
  writable: true
});