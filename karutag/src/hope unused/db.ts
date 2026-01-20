//temp need to rename then add stuff
// import Dexie, { Table } from 'dexie';
import Dexie, { type Table } from 'dexie';
// Define the shape of a Card
export interface Card {
  id?: number;
  character: string;
  series: string;
  // Add any other fields your Card objects have
}

// Define the database
class MyDatabase extends Dexie {
  // Define a 'cards' table with the type 'Card'
  cards!: Table<Card>;

  constructor() {
    super('KarutaDB');
    this.version(1).stores({
      cards: '++id,character,series' // Indexes on 'character' and 'series'
    });
  }
}

// Export a single instance of the database
export const db = new MyDatabase();
