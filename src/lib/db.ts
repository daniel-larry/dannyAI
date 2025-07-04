
import Dexie, { Table } from 'dexie';

export interface AudioCache {
  id: string;
  audioData: Uint8Array;
  createdAt: Date;
}

export class AppDB extends Dexie {
  audioCache!: Table<AudioCache>;

  constructor() {
    super('DannyAIDB');
    this.version(1).stores({
      audioCache: '&id, createdAt',
    });
  }
}

export const db = new AppDB();
