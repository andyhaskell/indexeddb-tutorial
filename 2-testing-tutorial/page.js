// page.js contains our code for working with the DOM in our web app.

import _ from 'underscore';

let {setupDB, addStickyNote, getNotes} = require('./db');

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
    listHTML += '<li>';
    listHTML += _.escape(`${note.text} + ' ' + ${new Date(note.timestamp).toString()}`);
    listHTML += '</li>';
  }
  document.getElementById('notes').innerHTML = listHTML;
}

// flipNoteOrder flips the order of the notes we display from forward to
// reverse, and vice versa, re-displaying the notes in the updated order.
function flipNoteOrder(notes) {
  reverseOrder = !reverseOrder;
  getAndDisplayNotes();
}

let reverseOrder = false;

// Make our DOM manipulation code global so that it can be used in index.html's
// "on..." handlers.
// https://stackoverflow.com/questions/35781579/basic-webpack-not-working-for-button-click-function-uncaught-reference-error
window.setupDB = setupDB;
window.submitNote = submitNote;
window.getAndDisplayNotes = getAndDisplayNotes;
window.flipNoteOrder = flipNoteOrder;