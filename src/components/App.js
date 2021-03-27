import React, {useState} from 'react'
import firebase from '../firebase'
import { v4 as uuidv4 } from 'uuid'
import Game from './Game'

const App = () => {
  const [playerName, setPlayerName] = useState();
  const [game, setGame] = useState();
  const [loading, setLoading] = useState(false);
  const [readyUp, setReadyUp] = useState(false);

  const gamesRef = firebase.firestore().collection("games");

  const createGame = () => {
    // create game
    const newGame = {
      gameId: uuidv4(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      finished: false,
      player1Name: playerName,
      player1Actions: null,
      player2Name: null,
      player2Actions: null,
    };

    gamesRef.doc(newGame.gameId).set(newGame).then(() => { console.log("Created a game and added player 1");});

    // set the games id
    setGame(newGame.gameId);
    setReadyUp(true);
  };

  const joinGame = (games) => {
    // find a game with a space
    let foundGameId = null;

    for (let index = 0; index < games.length; index++) {
      const game = games[index].data();

      if (game.player2Name == null) {
        foundGameId = game.gameId;
        break;
      }
    }

    if (foundGameId === null) {
      createGame();
    } else {
      // add this user to the game

      gamesRef.doc(foundGameId).update({ player2Name: playerName }).then(() => { console.log("Added player 2 to the game");});

      // set the games id
      setGame(foundGameId);
      setReadyUp(true);
    }
  };

  const leaveGame = () => {
    // leave game
    setGame(null);
    setReadyUp(false)
  };

  const findGame = async () => {
    setLoading(true);

    const availableGames = await gamesRef.get();

    if (availableGames.docs.length > 0) {
      joinGame(availableGames.docs);
    } else {
      createGame();
    }

    setLoading(false);
  }

  if (loading) {
    return <h1>Loading...</h1>
  }

  return (
    <div>
      <h1>CHING BATTLE</h1>
      {
        readyUp ? 
          <Game gameRef={gamesRef} playerName={playerName} gameId={game} leave={leaveGame}/> 
        : 
        <>
          <div className='inputBox'>
            <h2>{`One chance, three outcomes.`}</h2>
            <h3>Enter Name</h3>
            <input type='text' value={playerName} onChange={(e) => setPlayerName(e.target.value)}/>
            <button onClick={() => findGame()}>Find Game</button>
          </div>
        </>
      }
     
    </div>
  )
}

export default App