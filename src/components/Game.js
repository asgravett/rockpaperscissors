import React, {useState, useEffect} from 'react'

const Game = (props) => {

    const {gameRef , playerName, gameId, leave } = props;

    const [waiting, setWaiting] = useState(false)
    const [started, setStarted] = useState(false)
    const [game, setGame] = useState(null);

    // get the game object
    useEffect(() => {
        const unsubscribe = gameRef.doc(gameId).onSnapshot((querySnapshot) => {
            const lobby = querySnapshot.data();
            setGame(lobby);
            setWaiting(true);
            if (lobby.player1Name != null && lobby.player2Name != null) {
                setWaiting(false);
                setStarted(true);
            }
        });

        return () => {
            unsubscribe();
        };
        // eslint-disable-next-line
    },[]);

    // update readiness for joining player
    useEffect(() => {
        if (waiting) {
            // check if other player joined then set waiting to false
            if (game.player1Name != null && game.player2Name != null) {
                setWaiting(false);
                setStarted(true);
            }
        }
        // eslint-disable-next-line
    },[game]);

    function playerMove(action) {

        let update = {};

        if (game.player1Name === playerName) {
            update = {player1Actions: action}
        } else {
            update = {player2Actions: action}
        }

        gameRef.doc(gameId).set(update,{merge: true}).then(() => {console.log('player action added')});
    }

    function getResult() {
        if (game.player1Name === playerName) {
            return (<h2>{getOutcome(game.player1Actions, game.player2Actions)}</h2>);
        } else {
            return (<h2>{getOutcome(game.player2Actions, game.player1Actions)}</h2>);
        }
    }

    function getOutcome(player1, player2) {

        if (player1 === 'rock' && player2 === 'rock') {
            return "Rock 🧱 draws to Rock 🧱"
        }

        if (player1 === 'rock' && player2 === 'paper') {
            return "Rock 🧱 loses to Paper 🧻"
        }

        if (player1 === 'rock' && player2 === 'scissors') {
            return "Rock 🧱 beats Scissors ✂️"
        }

        if (player1 === 'paper' && player2 === 'rock') {
            return "Paper 🧻 beats Rock 🧱"
        }

        if (player1 === 'paper' && player2 === 'paper') {
            return "Paper 🧻 draws to Paper 🧻"
        }

        if (player1 === 'paper' && player2 === 'scissors') {
            return "Paper 🧻 loses to Scissors ✂️"
        }

        if (player1 === 'scissors' && player2 === 'rock') {
            return "Scissors ✂️ loses to Rock 🧱"
        }

        if (player1 === 'scissors' && player2 === 'paper') {
            return "Scissors ✂️ beats Paper 🧻"
        }

        if (player1 === 'scissors' && player2 === 'scissors') {
            return "Scissors ✂️ draws to Scissors ✂️"
        }
    }

    if (game !== null && game.finished) {
        return (
            <>
                <button onClick={() => leave()}>Leave Game</button>
                {getResult()}
            </>
        )
    }

    if (waiting) {
        return (
            <>
                <button onClick={() => leave()}>Leave Game</button>
                <h2>{`Hello, ${playerName}, we are waiting for another player to join the game.`}</h2>
            </>
        )
    }

    if (started) {
        return (
            <>
                <button onClick={() => leave()}>Leave Game</button>
                <h2>{`The game is ready, make your choice.`}</h2>
                <button onClick={() => playerMove('rock')}>Rock 🧱</button>
                <button onClick={() => playerMove('paper')}>Paper 🧻</button>
                <button onClick={() => playerMove('scissors')}>Scissors ✂️</button>
            </>
        )
    }

    return (
        <>
            <h2>{`Hello, ${playerName}`}</h2>
        </>
    )
}

export default Game
