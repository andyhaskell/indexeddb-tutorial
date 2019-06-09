//
// Database management
//

let db;
let dbNamespace;

function setupDB(namespace) {
  return new Promise(function(resolve, reject) {
    if (namespace != dbNamespace) {
      db = null;
    }
    dbNamespace = namespace;

    // If setupDB has already been run and the database was set up, no need to
    // open the database again; just resolve and return!
    if (db) {
      resolve();
      return;
    }

    let dbName = namespace == '' ? 'myDatabase' : 'myDatabase_' + namespace;
    let dbReq = indexedDB.open(dbName, 2);

    // Fires when the version of the database goes up, or the database is
    // created for the first time
    dbReq.onupgradeneeded = function(event) {
      db = event.target.result;

      // Create an object store named notes, or retrieve it if it already
      // exists. Object stores in databases are where data are stored.
      let notes;
      if (!db.objectStoreNames.contains('notes')) {
        notes = db.createObjectStore('notes', {autoIncrement: true});
      } else {
        notes = dbReq.transaction.objectStore('notes');
      }
    }

    // Fires once the database is opened (and onupgradeneeded completes, if
    // onupgradeneeded was called)
    dbReq.onsuccess = function(event) {
      // Set the db variable to our database so we can use it!
      db = event.target.result;
      resolve();
    }

    // Fires when we can't open the database
    dbReq.onerror = function(event) {
      reject(`error opening database ${event.target.errorCode}`);
    }
  });
}

//
// IndexedDB functions
//

// addStickyNote adds a sticky note for the message passed in in the notes
// object store.
function addStickyNote(message, callback) {
  // Start a database transaction and get the notes object store
  let tx = db.transaction(['notes'], 'readwrite');
  let store = tx.objectStore('notes');

  // Put the sticky note into the object store
  let note = {text: message, timestamp: Date.now()};
  store.add(note);

  // Wait for the database transaction to complete. If it is successful, run
  // the callback function
  tx.oncomplete = callback;
  tx.onerror = function(event) {
    alert('error storing note ' + event.target.errorCode);
  }
}

// getNotes retrieves all notes in the notes object store using an IndexedDB
// cursor and sends them to the calback passed in
function getNotes(reverseOrder, callback) {
  let tx = db.transaction(['notes'], 'readonly');

  // Retrieve the sticky notes object store to run our cursor query on
  let store = tx.objectStore('notes');
  let req = store.openCursor(null, reverseOrder ? 'prev' : 'next');

  let allNotes = [];
  req.onsuccess = function(event) {
    let cursor = event.target.result;

    if (cursor != null) {
      // If the cursor isn't null, we got an IndexedDB item. Add it to the note
      // array and have the cursor continue!
      allNotes.push(cursor.value);
      cursor.continue();
    } else {
      // If we have a null cursor, it means we've gotten all the items in the
      // store, so display the notes we got
      callback(allNotes);
    }
  }

  req.onerror = function(event) {
    alert('error in cursor request ' + event.target.errorCode);
  }
}

module.exports = {setupDB, addStickyNote, getNotes};