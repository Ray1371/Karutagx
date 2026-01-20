//temp
// Define the structure of a single query clause
export interface QueryClause {
  type: 'character' | 'series'; // You can extend this with more types if needed
  value: string;
}

// Define the overall structure of a parsed query
export interface ParsedQuery {
  raw: string; // The original search string
  clauses: QueryClause[]; // The list of parsed clauses
}
