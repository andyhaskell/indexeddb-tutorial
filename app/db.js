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
  tx.oncomplete = function() { console.log('stored note!') }
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