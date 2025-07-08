# ⚡ Lightning Roulette Casino Game

A visually stunning, interactive Lightning Roulette game that captures the thrill of a real casino! This project showcases skills in UI/UX, animation, game logic, and interactive web development.

![Demo GIF](link-to-your-demo.gif) ## ⭐ Game Overview

This is a web-based implementation of the popular Lightning Roulette casino game. It features standard roulette gameplay with an electrifying twist: **Lightning Multipliers**. Before each spin, 1 to 5 random numbers are struck by lightning, receiving multipliers of up to **1000x**!

## ✨ Core Features

* **Realistic Roulette Wheel:** A smooth CSS-animated roulette wheel and ball.
* **Interactive Betting System:** Place bets on single numbers using selectable chips.
* **Lightning Multipliers:** 1-5 numbers are randomly selected each round to have multipliers of 50x, 100x, 200x, 500x, or 1000x.
* **Authentic Payouts:**
    * **Lightning Win:** A straight-up bet on a lightning number pays the displayed multiplier.
    * **Standard Win:** A straight-up bet on a non-lightning number pays 35:1.
* **Casino Atmosphere:** Clean UI, betting history, and clear messaging to simulate a real casino experience.

## 🚀 Setup and Installation

No complex setup is required. Simply open the `index.html` file in your web browser.

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/lightning-roulette-casino-game.git](https://github.com/your-username/lightning-roulette-casino-game.git)
    ```

2.  **Navigate to the directory:**
    ```bash
    cd lightning-roulette-casino-game
    ```

3.  **Open `index.html`:**
    Open the `index.html` file in a modern web browser like Chrome, Firefox, or Edge.

## 🎮 How to Play

1.  **Select a Chip:** Click on a chip ($10, $50, $100, $500) to select your bet amount.
2.  **Place Your Bets:** Click on any number on the roulette table to place a bet. You can click multiple times to increase the bet on a single number.
3.  **Spin the Wheel:** Click the **"Spin"** button.
4.  **Watch the Lightning:** Before the ball lands, 1-5 numbers will be struck by lightning, revealing huge multipliers!
5.  **Win or Lose:** If the ball lands on a number you bet on, you win! The payout depends on whether it was a lightning number.
6.  **Clear Bets:** Use the **"Clear Bets"** button to remove all your bets from the table before a spin.

### Payout Table

| Bet Type          | Winning Numbers | Payout                  |
| ----------------- | --------------- | ----------------------- |
| **Straight Up (Lightning)** | 1 (the chosen number) | **50x to 1000x** |
| **Straight Up (Standard)** | 1 (the chosen number) | 35 to 1                 |
| *Other Bets* | *Not implemented* | *Standard roulette odds*|

*(Note: This version primarily implements straight-up bets to showcase the lightning feature.)*

## 🛠️ Tech Stack

* **Front-end:** HTML, CSS, JavaScript
* **Animations:** CSS Transitions and Animations
* **Sound:** Basic sound alerts via browser console (can be extended with actual audio files).

## 📄 Credits and License

This project was created for educational and portfolio purposes.

* **UI/UX Inspiration:** Various casino games on Dribbble and Behance.
* **License:** This project is open-source and available under the [MIT License](LICENSE).
