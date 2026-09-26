const suits = ["Wands", "Cups", "Swords", "Pentacles"];
const ranks = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
const major = ["The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor", "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit", "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance", "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World"];

let deck = [];
major.forEach((name, i) => deck.push({ name, type: "Major Arcana", arcana: i }));
suits.forEach(suit => {
    ranks.forEach(rank => {
        deck.push({ name: `${rank} of ${suit}`, type: "Minor Arcana", suit, rank });
    });
});

console.log(JSON.stringify(deck));
