import { useState } from "react"

import "./App.css"
import { useKonamiCode, useStopwatch, useDeckOfCards } from "./hooks"

function App() {
  const [cards, setCards] = useState<{ code: string; image: string }[]>([])
  const {
    hours,
    minutes,
    seconds,
    milliseconds,
    isRunning,
    toggleTime,
    resetTime,
  } = useStopwatch()
  const { active, swipeKey, reset } = useKonamiCode()
  const { deckId, newDeck, drawCard, shuffleDeck, drawMultipleCards } =
    useDeckOfCards()

  // Deck of Cards Functions
  const deckNewDeck = async () => {
    await newDeck()
  }
  const deckShuffleDeck = async () => {
    await shuffleDeck()
  }
  const deckDrawCard = async () => {
    const newCard = await drawCard()
    setCards([newCard, ...cards])
  }
  const deckDrawMultipleCards = async () => {
    const newCards = await drawMultipleCards(5)
    setCards([...newCards, ...cards])
  }

  return (
    <>
      <h1
        style={{
          borderBottom: "3px solid #ccc",
          paddingBottom: "1rem",
          marginBottom: "1rem",
        }}
      >
        Hooks Library
      </h1>
      {/* Test Hooks Here */}
      <div id="stopwatch">
        <h2 style={{ fontSize: "1.5rem" }}>Hello Stopwatch Hook</h2>
        <p className="stopwatch-time">
          {hours}:{minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}:
          {milliseconds.toString().padStart(2, "0")}
        </p>
        <div className="stopwatch-buttons">
          <button
            className="stopwatch-button"
            onClick={toggleTime}
            style={{ marginRight: "0.5rem" }}
          >
            {isRunning ? "Stop" : "Start"}
          </button>
          <button
            className="stopwatch-button"
            onClick={() => resetTime(false)}
            style={{ marginRight: "0.5rem" }}
          >
            Reset
          </button>
          <button
            className="stopwatch-button"
            onClick={() => resetTime(true)}
            style={{ marginRight: "0.5rem" }}
          >
            Full Reset
          </button>
        </div>
      </div>

      <hr style={{ margin: "1.5rem 0" }} />

      <div id="konami-code">
        <h2 style={{ fontSize: "1.5rem" }}>Konami Code Hook</h2>
        <p>{swipeKey.join(", ")}</p>
        {active && <p>Konami code activated!</p>}
        <button onClick={reset}>Reset</button>
      </div>

      <hr style={{ margin: "1.5rem 0" }} />

      <div id="deck-of-cards">
        <h2 style={{ fontSize: "1.5rem" }}>Deck of Cards Hook</h2>
        <p style={{ marginBottom: "0.5rem" }}>
          Deck ID: {deckId || "Start new deck"}
        </p>
        <button onClick={deckNewDeck} style={{ marginRight: "0.5rem" }}>
          New Deck
        </button>
        <button onClick={deckShuffleDeck} style={{ marginRight: "0.5rem" }}>
          Shuffle Deck
        </button>
        <button onClick={deckDrawCard} style={{ marginRight: "0.5rem" }}>
          Draw Card
        </button>
        <button onClick={deckDrawMultipleCards}>Draw 5 Cards</button>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            maxWidth: "450px",
            margin: "1rem auto",
          }}
        >
          {cards.map((card) => (
            <img
              src={card.image}
              alt={card.code}
              style={{ maxWidth: "100px" }}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default App
