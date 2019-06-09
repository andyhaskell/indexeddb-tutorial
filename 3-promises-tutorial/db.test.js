// By requiring fake-indexeddb/auto, code in that module automatically runs,
// loading every global function and variable in IndexedDB, such as the
// indexedDB global object itself, the IDBCursor constructor, etc. In automated
// tests, we need to load this because indexedDB is not one of Node's global
// objects like it is in a browser's `window`.
require("fake-indexeddb/auto");
let {setupDB, addStickyNote, getNotes} = require('./db');

test('we can store and retrieve sticky notes!', async function() {
  await setupDB('FORWARD_TEST');
  await addStickyNote('SLOTHS');
  await addStickyNote('RULE!');

  let notes = await getNotes(reverseOrder=false);
  expect(notes).toHaveLength(2);
  expect(notes[0].text).toBe('SLOTHS');
  expect(notes[1].text).toBe('RULE!');
});

test('reverse order', async function() {
  await setupDB('REVERSE_TEST');
  await addStickyNote('REVERSE');
  await addStickyNote('IN');

  let notes = await(getNotes(reverseOrder=true));
  expect(notes).toHaveLength(2);
  expect(notes[0].text).toBe('IN');
  expect(notes[1].text).toBe('REVERSE');
});