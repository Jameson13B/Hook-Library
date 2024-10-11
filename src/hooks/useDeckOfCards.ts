import { useState } from "react"

/**
 * A custom hook for managing a deck of cards using the Deck of Cards API.
 *
 * This hook provides functionality to create a new deck, shuffle the deck,
 * draw a single card, and draw multiple cards.
 *
 * @returns An object containing:
 *   - deckId: The current deck's ID, or null if no deck has been created.
 *   - newDeck: A function to create a new deck.
 *   - drawCard: A function to draw a single card from the deck.
 *   - shuffleDeck: A function to shuffle the current deck.
 *   - drawMultipleCards: A function to draw multiple cards from the deck.
 *
 * @example
 * const { deckId, newDeck, drawCard, shuffleDeck, drawMultipleCards } = useDeckOfCards();
 *
 * // Create a new deck
 * await newDeck();
 *
 * // Draw a single card
 * const card = await drawCard();
 *
 * // Shuffle the deck
 * await shuffleDeck();
 *
 * // Draw multiple cards
 * const cards = await drawMultipleCards(5);
 */

export const useDeckOfCards = () => {
  const [deckId, setDeckId] = useState<string | null>(null)

  const newDeck = async () => {
    const response = await fetch("https://deckofcardsapi.com/api/deck/new/")
    const data = await response.json()
    setDeckId(data.deck_id)
  }
  const shuffleDeck = async () => {
    if (!deckId) return
    const response = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`
    )
    const data = await response.json()
    return data
  }
  const drawCard = async () => {
    if (!deckId) return
    const response = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/`
    )
    const data = await response.json()
    return data.cards[0]
  }
  const drawMultipleCards = async (count: number) => {
    if (!deckId) return
    const response = await fetch(
      `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`
    )
    const data = await response.json()
    return data.cards
  }

  return {
    newDeck,
    shuffleDeck,
    drawCard,
    drawMultipleCards,
    deckId,
  }
}
