let {setupDB, addStickyNote, getNotes} = require('./db');

test('we can store and retrieve sticky notes', function(done) {
  setupDB(function() {
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