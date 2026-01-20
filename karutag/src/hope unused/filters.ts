//temp
import type { Collection } from 'dexie';
import type { QueryClause } from './ParsedQuery';

/**
 * Applies the given query clauses to a Dexie collection.
 *
 * This function takes a collection and a list of clauses, and returns a new collection with those clauses applied as filters.
 */
export function applyClauses<T>(collection: Collection<T, any>, clauses: QueryClause[]): Collection<T, any> {
  let filteredCollection = collection;

  clauses.forEach(clause => {
    switch (clause.type) {
      case 'character':
        filteredCollection = filteredCollection.filter(item => 
          item.character.toLowerCase().includes(clause.value.toLowerCase())
        );
        break;
      case 'series':
        filteredCollection = filteredCollection.filter(item => 
          item.series.toLowerCase().includes(clause.value.toLowerCase())
        );
        break;
      // Add more cases for other clause types if needed
    }
  });

  return filteredCollection;
} 
