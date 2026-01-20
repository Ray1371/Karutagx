// import { useEffect, useState } from 'react';
// import { db } from './db'; // Make sure this import is correct and that db.ts is in place

// export default function MainMenu() {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     // Inline the logic to get the collection count
//     db.cards.count().then(setCount);
//   }, []);

//   return (
//     <div>
//       <h2>Collection</h2>
//       <p>Total cards: {count}</p>
//     </div>
//   );
// }

// MainMenu.tsx
// Primary UI + orchestration component
// Handles uploads, search input, and displaying cards

//todo: Check out the following chat log topic names:
/*
From the chat log titles I can see on my side, the most relevant threads were:

“Bulk vs piecemeal adding” (2025-12-17) — this is where we were explicitly talking about upload approach/structure (bulk vs incremental).

“React Project Progress” (2025-12-30) — this is where we were working on the table/UI + Dexie collection updates, which ties directly into upload + refresh behavior.

“Downloadable Files and Codebases” (2026-01-15) — this is more about the dev-server/react version issue, but it’s part of the same “project restoration” arc.

*/

import './App.css';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { useLiveQuery } from 'dexie-react-hooks';

import { db } from './Upload';
import type { Card } from './Upload';
import type { progressSignal } from './progressSignals';

import { searchCards } from './regexStuff';

// -----------------------------

export default function MainMenu() {


  // Upload-related state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [cardsUpdated, setCardsUpdated] = useState(0);

  // Search-related state
  const [searchFilter, setSearchFilter] = useState('');
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);

  //Select-related state
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Full collection (live)
  const fullCollection = useLiveQuery(
    () => db.collection.toArray(),
    [],
    []
  );

  // Progress signals passed into upload logic
  const signals: progressSignal = {
    updateRowCount: (count) => setRowCount(count),
    updateCompletedRows: (count) => setCardsUpdated(count),
    updateValid: (valid: boolean) => {
  if (valid) setIsUploading(false);
},
    // updateValid: () => {
    //   setIsUploading(false);
    // },
  };

  // -----------------------------
  // Filtering logic (older style)
  // -----------------------------
  useEffect(() => {
    if (!fullCollection) return;

    // Empty search = show everything
    if (!searchFilter.trim()) {
      setFilteredCards(fullCollection);
      return;
    }

    const parsed = searchCards(searchFilter);

    // NOTE: at this time, everything was done with .filter()
    // (no .where() yet)
    const query = db.collection.filter(card => {
      for (const clause of parsed.clauses) {
        const field = clause.field as keyof Card;

        // Text fields
        if (typeof clause.value === 'string') {
          const cardVal = card[field];
          if (typeof cardVal !== 'string') return false;

          // Case-insensitive contains
          if (
            !cardVal
              .toLowerCase()
              .includes(clause.value.toLowerCase())
          ) {
            return false;
          }
        }

        // Numeric fields
        else if (typeof clause.value === 'number') {
          const cardVal = card[field];
          if (typeof cardVal !== 'number') return false;

          switch (clause.operator) {
            case '<':
              if (!(cardVal < clause.value)) return false;
              break;
            case '<=':
              if (!(cardVal <= clause.value)) return false;
              break;
            case '=':
              if (!(cardVal === clause.value)) return false;
              break;
            case '>':
              if (!(cardVal > clause.value)) return false;
              break;
            case '>=':
              if (!(cardVal >= clause.value)) return false;
              break;
          }
        }
      }
      return true;
    });

    query.toArray().then(setFilteredCards);
  }, [searchFilter, fullCollection]);


  //Select all cards and toggle
      const allSelected =
      filteredCards.length > 0 &&
      filteredCards.every(c => selected.has(c.code));

    function toggleSelectAll() {
      setSelected(prev => {
        const next = new Set(prev);
        if (allSelected) {
          filteredCards.forEach(c => next.delete(c.code));
        } else {
          filteredCards.forEach(c => next.add(c.code));
        }
        return next;
      });
    }

  function toggleOne(code: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  }

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="main-menu">
      <h1>Karuta Collection</h1>

      {/* Upload */}
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
      />

      {/* Search */}
      <input
        type="text"
        placeholder="Search cards..."
        value={searchFilter}
        onChange={(e) => setSearchFilter(e.target.value)}
      />

      {/* Table */}
      <table>
        <thead>
          <tr>
          <th scope="col">
              <input
                type="checkbox"
                aria-label="Select all cards"
                checked={allSelected}
                onChange={toggleSelectAll}
              />
            </th>
            <th>Code</th>
            <th>Wishlists</th>
            <th>Character</th>
            <th>Series</th>
            <th>Edition</th>
            <th>Print</th>
            <th>Tag</th>
            
          </tr>
        </thead>
        <tbody>
          {filteredCards.map(card => (
            <tr key={card.code}>
              <td>
                <input
                  type="checkbox"
                  aria-label={`Select ${card.character}`}
                  checked={selected.has(card.code)}
                  onChange={() => toggleOne(card.code)}
                />
              </td>
              <td>{card.code}</td>
              <td>{card.wishlists}</td>
              <td>{card.character}</td>
              <td>{card.series}</td>
              <td>{card.edition}</td>
              <td>{card.number}</td>
              <td>{card.tag}</td>

            </tr>
          ))}
        </tbody>
      </table>
{/* todo: left align the collection div */}
      <div>
        Total Cards in Collection: {fullCollection?.length ?? 0}
      </div>

{/* Table for Selected Cards */}

      {/* Upload progress */}
      {isUploading && (
        <div>
          Uploaded {cardsUpdated} / {rowCount}
        </div>
      )}
    </div>
  );
}
