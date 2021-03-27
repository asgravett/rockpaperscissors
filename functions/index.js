const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

exports.updateGame = functions.firestore
.document('games/{gameId}')
.onUpdate((change, context) => {

  const newValue = change.after.data();

  if (newValue.finished === true) {
    return null;
  }

  if (newValue.finished === false && newValue.player1Actions !== null && newValue.player2Actions !== null) {
    return change.after.ref.set({
      finished: true
    }, {merge: true});
  }

  return null
});
