import type { ParsedQuery } from './ParsedQuery';
import { parseQuery } from './regexStuff';

export default function toQuery(searchFilter: string): ParsedQuery {
  return parseQuery(searchFilter);
}
/**
 * Converts a raw search filter string into a ParsedQuery object.
 * This breaks the input into tokens and categorizes them into clauses for later filtering.
 */
export default function toQuery(searchFilter: string): ParsedQuery {
  const raw = searchFilter.trim();
  const clauses: QueryClause[] = [];

  // Use the regex helpers to split and extract tokens
  const tokens = raw.split(/\s+/);

  tokens.forEach(token => {
    const prefixed = splitPrefixedToken(token);
    if (prefixed) {
      if (prefixed.key === 'c' || prefixed.key === 'character') {
        clauses.push({ type: 'character', value: prefixed.value });
      } else if (prefixed.key === 's' || prefixed.key === 'series') {
        clauses.push({ type: 'series', value: prefixed.value });
      }
      // Add more clause types here as needed.
    } else {
      // Bare tokens are assumed to be character matches by default
      clauses.push({ type: 'character', value: token });
    }
  });

  return {
    raw,
    clauses
  };
}
