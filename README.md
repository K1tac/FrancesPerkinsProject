# Triangle Shirtwaist Factory Fire Project

This is a small HTML/CSS/TypeScript project about the Triangle Shirtwaist Factory Fire.

The project opens in a browser and lets the player make choices as a worker on the ninth floor. Choices affect survival chance and stamina.

## How to Run It

### Easiest Way

1. Download or open the project folder.
2. Find the file named `main.html`.
3. Double click `main.html`.
4. The project should open in your web browser.
5. Click `Start` to begin the game.

> [!WARNING]
> The methods ahead are more advanced.

### Using VS Code

1. Open the project folder in VS Code.
2. Install the `Live Server` extension if it is not already installed.
3. Right click `main.html`.
4. Click `Open with Live Server`.
5. The project should open in the browser.

### Using Python

If Python is installed:

1. Open a terminal in the project folder.
2. Run this command:

```bash
python -m http.server 8000
```

3. Open this link in a browser:

```text
http://localhost:8000/main.html
```

If that command does not work, try:

```bash
python3 -m http.server 8000
```

## Files

- `main.html` is the first page.
- `pages/game.html` is the game page.
- `scripts/game.ts` is the TypeScript source code.
- `scripts/game.js` is the JavaScript file the browser runs.
- `styles/site.css` has the styling.
- `pages/dead.html` shows the death message.
- `pages/whatidid.html` explains why the project was made.
- `pages/developers.html` has developer information.
