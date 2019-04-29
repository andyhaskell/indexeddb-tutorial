//
// Database management
//

let db;

function setupDB(callback) {
  // If setupDB has already been run and the database was set up, no need to
  // open the database again; just run our callback and return!
  if (db) {
    callback();
    return;
  }

  let dbReq = indexedDB.open('myDatabase', 2);

  // Fires when the version of the database goes up, or the database is created
  // for the first time
  dbReq.onupgradeneeded = function(event) {
    db = event.target.result;
  
    // Create an object store named notes, or retrieve it if it already exists.
    // Object stores in databases are where data are stored.
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
    callback();
  }
  
  // Fires when we can't open the database
  dbReq.onerror = function(event) {
    alert('error opening database ' + event.target.errorCode);
  }
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

let reverseOrder = false;

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

//
// DOM manipulation
//

// submitNote submits the sticky note in the #newmessage text box to the notes
// object store
function submitNote() {
  let message = document.getElementById('newmessage');
  addStickyNote(message.value, getAndDisplayNotes);
  message.value = '';
}

// getAndDisplayNotes is a helper function for retrieving notes and then
// having them be displayed with displayNotes.
function getAndDisplayNotes() { getNotes(reverseOrder, displayNotes); }

// displayNotes takes in an array of sticky note objects and displays them as
// <li> elements.
function displayNotes(notes) {
  let listHTML = '<ul>';

  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    listHTML += '<li>' + note.text + ' ' +
      new Date(note.timestamp).toString() + '</li>';
  }
  document.getElementById('notes').innerHTML = listHTML;
}

// flipNoteOrder flips the order of the notes we display from forward to
// reverse, and vice versa, re-displaying the notes in the updated order.
function flipNoteOrder(notes) {
  reverseOrder = !reverseOrder;
  getAndDisplayNotes();
}