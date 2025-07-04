import Dexie from 'dexie';

class VoiceCacheDB extends Dexie {
  voices: Dexie.Table<{ key: string, blob: Blob }, string>;

  constructor() {
    super('VoiceCacheDB');
    this.version(1).stores({
      voices: 'key'
    });
    this.voices = this.table('voices');
  }
}

export const voiceCacheDB = new VoiceCacheDB();
