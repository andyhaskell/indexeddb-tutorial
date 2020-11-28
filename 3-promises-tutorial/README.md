## Promises tutorial code

This directory contains the code from [Part 3](https://dev.to/andyhaskell/using-promises-in-indexeddb-4nc0) of my Build a Basic Web App with IndexedDB tutorial series. In that part, we look at how to refactor our callback-based IndexedDB code to promise-based IndexedDB code.

The code is arranged as follows:

* `db.js` contains all database logic, under three major functions:
  * `setupDB`, which creates our IndexedDB database with a `notes` object store.
  * `addStickyNote`, which adds a sticky note with a message to our database.
  * `getNotes`, which retrieves sticky notes, either in forward or reverse order.
* `page.js` contains all DOM manipulation, which is mostly the same as it was in Parts 1 and 2.
* `db.test.js` contains Jest unit test coverage for the database logic in `db.js`.

To try out the web app with this code, run:

```
yarn install
yarn serve
```

You can then try out the web app at `localhost:1123`.

![Sample screenshot of the web app from the tutorial, with some saved sticky notes in the database being displayed](../sample.png)