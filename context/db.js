import Dexie from 'dexie';

export const db = new Dexie("ShortlistsDB");
db.version(1).stores({
    stageOne: '&imageName',
    finalShortlist: '&imageName'
});
