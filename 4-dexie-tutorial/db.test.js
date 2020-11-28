// By requiring fake-indexeddb/auto, code in that module automatically runs,
// loading every global function and variable in IndexedDB, such as the
// indexedDB global object itself, the IDBCursor constructor, etc. In automated
// tests, we need to load this because indexedDB is not one of Node's global
// objects like it is in a browser's `window`.
require('fake-indexeddb/auto');
let Database = require('./db');

test('we can store and retrieve sticky notes!', async function() {
  let db = new Database('FORWARD_TEST');
  await db.addStickyNote('SLOTHS');
  await db.addStickyNote('RULE!');

  let notes = await db.getNotes(reverseOrder=false);
  expect(notes).toHaveLength(2);
  expect(notes[0].text).toBe('SLOTHS');
  expect(notes[1].text).toBe('RULE!');
});

test('reverse order', async function() {
  let db = new Database('REVERSE_TEST');
  await db.addStickyNote('REVERSE');
  await db.addStickyNote('IN');

  let notes = await db.getNotes(reverseOrder=true);
  expect(notes).toHaveLength(2);
  expect(notes[0].text).toBe('IN');
  expect(notes[1].text).toBe('REVERSE');
});