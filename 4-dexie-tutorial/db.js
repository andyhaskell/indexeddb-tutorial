let { Dexie } = require('dexie');

// Database contains all IndexedDB database logic for our web app.
class Database extends Dexie {
  // The constructor creates the database titled myDatabase, with a single
  // object store for sticky notes.
  constructor(namespace) {
    // Use the Dexie constructor to create the database and get back a Dexie
    // object that represents the database.
    super(Database.dbName(namespace));

    // Now that we have our Dexie object, we define a sticky notes object store
    // using the "stores" method. The indices we put on the store are:
    //
    // - ++id, which makes the "id" field on our sticky notes an
    //   auto-incrementing primary key, similar to how in plain IndexedDB you
    //   would specify autoIncrement: true
    // - timestamp, so we can retrieve sticky notes in order by timestamp.
    //
    // You can see information on all types of indices you can create at
    // https://dexie.org/docs/Version/Version.stores()
    this.version(1).stores({
      notes: '++id,timestamp',
    });

    // Keep a reference to the notes store, called a dexie Table, so that we
    // can then run Dexie methods from that Table.
    this.notes = this.table('notes');
  }

  // addStickyNote adds a sticky note with the text passed in to the "notes"
  // object store. Returns a promise that resolves when the sticky note is
  // successfully added.
  addStickyNote(message) {
    return this.notes.add({
      text:      message,
      timestamp: new Date(),
    });
  }

  // getNotes retrieves all sticky notes from the "notes" object store. Returns
  // a promise that resolves when we successfully retrieve the sticky notes,
  // giving us the notes in an array.
  getNotes(reverseOrder) {
    return reverseOrder ?
      this.notes.orderBy('timestamp').reverse().toArray() :
      this.notes.orderBy('timestamp').toArray();
  }

  // dbName sets up the name of the database using an optional namespace
  // parameter for test coverage.
  static dbName(namespace) {
    return namespace != undefined ?
      `my_db_${namespace}` :
      'my_db';
  }
}

module.exports = Database;