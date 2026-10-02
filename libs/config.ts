// Single source of truth for backend URLs. NEXT_PUBLIC_* values are inlined at
// build time, so they must be set in the deploy environment before building.
export const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/graphql';

// REST base (e.g. /upload/image). Falls back to the GraphQL URL's origin so a
// deploy that only sets NEXT_PUBLIC_GRAPHQL_URL doesn't send uploads to localhost.
export const API_BASE = (process.env.NEXT_PUBLIC_API_URL || new URL(GRAPHQL_URL).origin).replace(/\/+$/, '');
