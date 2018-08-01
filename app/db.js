//
// Database management
//

let db;
let dbReq = indexedDB.open('myDatabase', 1);

// Fires when the version of the database goes up, or the database is created
// for the first time
dbReq.onupgradeneeded = function(event) {
  db = event.target.result;

  // Create an object store named notes. Object stores in databases are where
  // data are stored.
  let notes = db.createObjectStore('notes', {autoIncrement: true});
}

// Fires once the database is opened (and onupgradeneeded completes, if
// onupgradeneeded was called)
dbReq.onsuccess = function(event) {
  // Set the db variable to our database so we can use it!  
  db = event.target.result;
  getAndDisplayNotes(db);
}

// Fires when we can't open the database
dbReq.onerror = function(event) {
  alert('error opening database ' + event.target.errorCode);
}

//
// IndexedDB functions
//

// addStickyNote adds a sticky note for the message passed in in the notes
// object store.
function addStickyNote(db, message) {
  // Start a database transaction and get the notes object store
  let tx = db.transaction(['notes'], 'readwrite');
  let store = tx.objectStore('notes');

  // Put the sticky note into the object store
  let note = {text: message, timestamp: Date.now()};
  store.add(note);

  // Wait for the database transaction to complete
  tx.oncomplete = function() { getAndDisplayNotes(db); }
  tx.onerror = function(event) {
    alert('error storing note ' + event.target.errorCode);
  }
}

// addManyNotes adds sticky notes for an array of messages to the notes
// object store. This is to demonstrate that you can run multiple IndexedDB
// requests in the same transaction, and it is completely normal to do so.
function addManyNotes(db, messages) {
  let tx = db.transaction(['notes'], 'readwrite');
  let store = tx.objectStore('notes');

  for (let i = 0; i < messages.length; i++) {
    // All of the requests made from store.add are part of the same
    // transaction.
    store.add({text: messages[i], timestamp: Date.now()});
  }

  tx.oncomplete = function() { console.log('transaction complete') };
}

// getAndDisplayNotes retrieves all notes in the notes object store using an
// IndexedDB cursor and sends them to displayNotes so they can be displayed
function getAndDisplayNotes(db) {
  let tx = db.transaction(['notes'], 'readonly');
  let store = tx.objectStore('notes');

  // Create a cursor request to get all items in the store, which we collect
  // in the allNotes array
  let req = store.openCursor();
  let allNotes = [];

  req.onsuccess = function(event) {
    // The result of req.onsuccess is an IDBCursor
    let cursor = event.target.result;

    if (cursor != null) {
      // If the cursor isn't null, we got an IndexedDB item. Add it to the
      // note array and have the cursor continue!
      allNotes.push(cursor.value);

      // cursor.continue has the cursor move to the next item; we keep looping
      // through the notes because that causes req.onsuccess to fire again
      cursor.continue();
    } else {
      // If we have a null cursor, it means we've gotten all the items in the
      // store, so display the notes we got
      displayNotes(allNotes);
    }
  }

  req.onerror = function(event) {
    alert('error in cursor request ' + event.target.errorCode);
  }
}

//
// DOM manipulation
//

// submitNote submits the sticky note in the #newmessage text box to the
// notes object store
function submitNote() {
  let message = document.getElementById('newmessage');
  addStickyNote(db, message.value);
  message.value = '';
}

// displayNotes takes in an array of sticky note objects and displays them
// as <li> elements.
function displayNotes(notes) {
  let listHTML = '<ul>';

  for (let i = 0; i < notes.length; i++) {
    let note = notes[i];
    listHTML += '<li>' + note.text + ' ' +
      new Date(note.timestamp).toString() + '</li>';
  }
  document.getElementById('notes').innerHTML = listHTML;
}