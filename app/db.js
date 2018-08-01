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
