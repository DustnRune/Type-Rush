# TypeRush

TypeRush is a fast-paced survival typing game set in a dark neon universe. Words continuously spawn at the top of the screen and fall toward the bottom. Type the words correctly and quickly to destroy them before they reach the bottom and damage your health!


## Features
- **Endless Survival Mode**: The game gets harder the longer you survive, with words spawning faster and falling quicker.
- **Combo System**: String together correct words without mistakes to increase your multiplier and maximize your score!
- **Neon Aesthetic**: A sleek, dark-mode visual experience featuring vibrant neon colors and glowing elements.
- **Zero Dependencies**: Built with only Vanilla HTML, CSS, and JS. Lightweight and instant loading.

## How to Play
1. **Start the Game** - Click `START GAME` from the main menu.
2. **Type Fast** - When words start dropping, begin typing. The game will automatically lock on to the word closest to the bottom that starts with the letter you typed.
3. **No Mistakes** - Finish typing the active word completely. If you type the wrong letter, your combo will reset.
4. **Survive** - Don't let words touch the bottom. You have 3 HP (Health Points). If 3 words fall to the bottom, it's Game Over!

## Technologies
- **HTML5**: For semantic layout and game interface.
- **CSS3**: Leveraging CSS variables, flexbox, and CSS animations for the neon visuals.
- **Vanilla JavaScript (ES6)**: Game loop handled via `requestAnimationFrame` for buttery smooth 60fps performance and pure DOM manipulation for interactive elements.

## Deployment to GitHub Pages
This project is fully ready to deploy using GitHub Pages:
1. Ensure `index.html`, `style.css`, and `script.js` are in the root directory.
2. Push your code to a GitHub repository.
3. Go to the repository's **Settings** -> **Pages**.
4. Set the source to **Deploy from a branch** and choose `main` (or `master`).
5. Save, wait a minute, and test your live demo link!
