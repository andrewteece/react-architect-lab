import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './testServer';

// MSW lifecycle wiring for Vitest
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
