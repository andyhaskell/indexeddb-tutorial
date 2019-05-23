// By requiring fake-indexeddb/auto, code in that module automatically runs,
// loading every global function and variable in IndexedDB, such as the
// indexedDB global object itself, the IDBCursor constructor, etc. In automated
// tests, we need to load this because indexedDB is not one of Node's global
// objects like it is in a browser's `window`.
require("fake-indexeddb/auto");
let {setupDB, addStickyNote, getNotes} = require('./db');

test('we can store and retrieve sticky notes', function(done) {
  setupDB('FORWARD_TEST', function() {
    addStickyNote('SLOTHS', function() {
      addStickyNote('RULE!', function() {
        // Now that our sticky notes are both added, we retrieve them from
        // IndexedDB and check that we got them back in the right order.
        getNotes(reverseOrder=false, function(notes) {
          expect(notes).toHaveLength(2);
          expect(notes[0].text).toBe('SLOTHS');
          expect(notes[1].text).toBe('RULE!');
          done();
        });
      });
    });
  });
});

test('reverse order', function(done) {
  setupDB('REVERSE_TEST', function() {
    addStickyNote('REVERSE', function() {
      addStickyNote('IN', function() {
        getNotes(reverseOrder=true, function(notes) {
          expect(notes).toHaveLength(2);
          expect(notes[0].text).toBe('IN');
          expect(notes[1].text).toBe('REVERSE');
          done();
        });
      });
    });
  });
});