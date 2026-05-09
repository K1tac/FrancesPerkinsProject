type Step =
    "start" |
    "lockedDoor" |
    "lockedDoorMore" |
    "elevator" |
    "elevatorPush" |
    "elevatorLuck" |
    "workroom" |
    "foremanOffice" |
    "helpWorker" |
    "wetCloth" |
    "greenStreetStairs" |
    "roofStairs" |
    "roofCrowd" |
    "roof" |
    "roofSafe" |
    "window" |
    "street" |
    "dead";

type DifficultyName = "Easy" | "Normal" | "Hard" | "Challenge";

type Difficulty = {
    name: DifficultyName;
    startChance: number;
    startStamina: number;
    penalty: number;
    bonus: number;
};

const firstNames: string[] = [
    "Rosa",
    "Ida",
    "Morris",
    "Rebecca",
    "Anna",
    "Sam",
    "Clara",
    "Louis",
    "Bessie",
    "Maria",
    "Lucia",
    "Sofia",
    "Yetta",
    "Esther",
    "Pauline",
    "Nellie",
    "Teresa",
    "Josephine",
    "Giovanni",
    "Salvatore"
];

const lastNames: string[] = [
    "Levine",
    "Cohen",
    "Rosen",
    "Goldstein",
    "Miller",
    "Kaplan",
    "Weiss",
    "Friedman",
    "Schwartz",
    "Greenberg",
    "Russo",
    "Esposito",
    "Rizzo",
    "Romano",
    "Ferrara",
    "Bianchi",
    "Lombardi",
    "Petrova",
    "Nowak",
    "Kowalski"
];

const difficulties: Difficulty[] = [
    {
        name: "Easy",
        startChance: 88,
        startStamina: 100,
        penalty: 0.75,
        bonus: 1.2
    },
    {
        name: "Normal",
        startChance: 74,
        startStamina: 85,
        penalty: 1,
        bonus: 1
    },
    {
        name: "Hard",
        startChance: 48,
        startStamina: 68,
        penalty: 1.55,
        bonus: 0.55
    },
    {
        name: "Challenge",
        startChance: 35,
        startStamina: 55,
        penalty: 1.85,
        bonus: 0.4
    }
];

let playerName: string = "";
let survival: number = 100;
let stamina: number = 100;
let selectedDifficulty: Difficulty = difficulties[1];
let currentStep: Step = "start";

const game = document.getElementById("game") as HTMLElement;
const nameBox = document.getElementById("playername") as HTMLElement;
const chanceBox = document.getElementById("stat-risk") as HTMLElement;
const staminaBox = document.getElementById("stamina") as HTMLElement;
const airBox = document.getElementById("air") as HTMLElement;
const floorBox = document.getElementById("floor") as HTMLElement;
const showChancesBox = document.getElementById("show-chances") as HTMLInputElement;
const showMapBox = document.getElementById("show-map") as HTMLInputElement;
const mapBox = document.getElementById("map") as HTMLElement;
const mapFloorBox = document.getElementById("map-floor") as HTMLElement;
const mapPlaceBox = document.getElementById("map-place") as HTMLElement;
const mapDot = document.getElementById("map-dot") as HTMLElement;

function randomFirstName(): string {
    return firstNames[Math.floor(Math.random() * firstNames.length)];
}

function randomLastName(): string {
    return lastNames[Math.floor(Math.random() * lastNames.length)];
}

function showName(firstName: string, lastName: string): void {
    nameBox.textContent = firstName + " " + lastName;
}

function setChance(amount: number): void {
    survival = amount;

    if (survival < 0) {
        survival = 0;
    }

    if (survival > 100) {
        survival = 100;
    }

    chanceBox.textContent = survival + "%";

    if (survival > 60) {
        chanceBox.style.color = "green";
    } else if (survival > 25) {
        chanceBox.style.color = "orange";
    } else {
        chanceBox.style.color = "red";
    }
}

function setStamina(amount: number): void {
    stamina = amount;

    if (stamina < 0) {
        stamina = 0;
    }

    if (stamina > 100) {
        stamina = 100;
    }

    staminaBox.textContent = stamina + "%";

    if (stamina > 60) {
        staminaBox.style.color = "#3e7bd6";
    } else if (stamina > 25) {
        staminaBox.style.color = "orange";
    } else {
        staminaBox.style.color = "red";
    }
}

function changeChance(amount: number): void {
    let changedAmount = amount;

    if (amount < 0) {
        changedAmount = Math.round(amount * selectedDifficulty.penalty);
    }

    if (amount > 0) {
        changedAmount = Math.round(amount * selectedDifficulty.bonus);
    }

    setChance(survival + changedAmount);
}

function changeStamina(amount: number): void {
    setStamina(stamina + amount);
}

function shownChange(amount: number): number {
    if (amount < 0) {
        return Math.round(amount * selectedDifficulty.penalty);
    }

    if (amount > 0) {
        return Math.round(amount * selectedDifficulty.bonus);
    }

    return amount;
}

function labelChoice(text: string, change: number): string {
    if (!showChancesBox.checked) {
        return text;
    }

    const amount = shownChange(change);
    const sign = amount >= 0 ? "+" : "";

    return text + " (" + sign + amount + "%)";
}

function riskName(change: number, deathText: string, extraRisk: number = 0): string {
    if (selectedDifficulty.name === "Hard" || selectedDifficulty.name === "Challenge") {
        return "";
    }

    const amount = shownChange(change);

    if (deathText !== "" || extraRisk >= 70 || amount <= -45) {
        return "DEADLY";
    }

    if (extraRisk >= 38 || amount <= -15) {
        return "RISKY";
    }

    if (amount >= 0) {
        return "RECOMMENDED";
    }

    return "";
}

function setChoiceText(button: HTMLButtonElement, text: string, change: number, deathText: string, extraRisk: number = 0): void {
    const label = document.createElement("span");
    label.textContent = labelChoice(text, change);
    button.appendChild(label);

    const risk = riskName(change, deathText, extraRisk);

    if (risk !== "") {
        const badge = document.createElement("span");
        badge.className = "risk-badge " + risk.toLowerCase();
        badge.textContent = risk;
        button.appendChild(badge);
    }
}

function updateMap(place: string, floor: string): void {
    mapBox.style.display = showMapBox.checked ? "block" : "none";
    mapPlaceBox.textContent = place;
    mapFloorBox.textContent = floor;

    if (place === "Roof" || floor === "Roof") {
        mapDot.style.left = "50%";
        mapDot.style.top = "16%";
    } else if (place === "Roof stairs") {
        mapDot.style.left = "20%";
        mapDot.style.top = "47%";
    } else if (place === "Elevators") {
        mapDot.style.left = "25%";
        mapDot.style.top = "79%";
    } else if (place === "Windows") {
        mapDot.style.left = "70%";
        mapDot.style.top = "79%";
    } else if (place === "Street" || floor === "Street") {
        mapDot.style.left = "50%";
        mapDot.style.top = "94%";
    } else if (place === "Other stairs" || place === "Locked stair door") {
        mapDot.style.left = "20%";
        mapDot.style.top = "47%";
    } else {
        mapDot.style.left = "62%";
        mapDot.style.top = "47%";
    }
}

function randomPercent(): number {
    return Math.random() * 100;
}

function riskRoll(extraRisk: number): boolean {
    let target = survival - extraRisk + Math.round(stamina / 4);

    if (selectedDifficulty.name === "Hard") {
        target -= 12;
    }

    if (selectedDifficulty.name === "Challenge") {
        target -= 22;
    }

    if (selectedDifficulty.name === "Easy") {
        target += 10;
    }

    return randomPercent() < target;
}

function randomTrouble(nextStep: Step): void {
    if (nextStep === "dead" || nextStep === "roofSafe" || nextStep === "elevatorLuck") {
        showStep(nextStep);
        return;
    }

    let troubleChance = 12;

    if (selectedDifficulty.name === "Hard") {
        troubleChance = 30;
    }

    if (selectedDifficulty.name === "Easy") {
        troubleChance = 6;
    }

    if (randomPercent() > troubleChance) {
        showStep(nextStep);
        return;
    }

    const trouble = Math.floor(Math.random() * 4);

    if (trouble === 0) {
        changeChance(-12);
        changeStamina(-10);
        clearGame();
        airBox.textContent = "Awful";
        addTitle("Smoke");
        addText("A black wave of smoke comes through the room. People bend over and cover their mouths. For a few seconds, you cannot see the door.");
        addChoice("Keep moving.", nextStep, -5, "", -8, 10);
    }

    if (trouble === 1) {
        changeChance(-10);
        changeStamina(-12);
        clearGame();
        addTitle("The Crowd");
        addText("The crowd surges and you get shoved into a table. Needles, cloth, and broken glass scatter across the floor.");
        addChoice("Get up and keep going.", nextStep, -5, "", -10, 15);
    }

    if (trouble === 2) {
        changeChance(-8);
        changeStamina(-8);
        clearGame();
        addTitle("Heat");
        addText("The heat gets worse. Your hands sting when you touch the wall. Someone near you is crying and coughing.");
        addChoice("Move faster.", nextStep, -8, "", -14, 20);
    }

    if (trouble === 3) {
        clearGame();
        addTitle("Blocked");
        addText("A group runs the other way and blocks your path. You lose time trying to get around them.");
        addChoice("Force your way past.", nextStep, -14, "", -18, 25);
        addChoice("Back up and take another route.", "workroom", -8, "", -8, 0);
    }
}

function clearGame(): void {
    game.innerHTML = "";
}

function addTitle(text: string): void {
    const title = document.createElement("h2");
    title.textContent = text;
    game.appendChild(title);
}

function addText(text: string): void {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    game.appendChild(paragraph);
}

function addSmallText(text: string): void {
    const paragraph = document.createElement("p");
    paragraph.className = "small-text";
    paragraph.textContent = text;
    game.appendChild(paragraph);
}

function addChoice(text: string, nextStep: Step, change: number, deathText: string, staminaChange: number = -4, staminaNeeded: number = 0): void {
    const button = document.createElement("button");
    button.className = "choice-button";
    setChoiceText(button, text, change, deathText);

    button.onclick = function (): void {
        if (deathText !== "") {
            changeChance(change);
            changeStamina(staminaChange);
            die(deathText);
            return;
        }

        if (stamina < staminaNeeded) {
            die("You were too tired to move fast enough. The smoke caught up before you could get through.");
            return;
        }

        changeChance(change);
        changeStamina(staminaChange);

        randomTrouble(nextStep);
    };

    game.appendChild(button);
}

function addRiskChoice(text: string, successStep: Step, change: number, failText: string, staminaChange: number, staminaNeeded: number, extraRisk: number): void {
    const button = document.createElement("button");
    button.className = "choice-button";
    setChoiceText(button, text, change, "", extraRisk);

    button.onclick = function (): void {
        if (stamina < staminaNeeded) {
            die("You were too tired to try it. The smoke caught up before you could move.");
            return;
        }

        changeChance(change);
        changeStamina(staminaChange);

        if (riskRoll(extraRisk)) {
            showStep(successStep);
        } else {
            die(failText);
        }
    };

    game.appendChild(button);
}

function die(text: string): void {
    const message = encodeURIComponent(playerName + ": " + text);
    window.location.href = "dead.html?message=" + message;
}

function startNameScreen(): void {
    const defaultFirstName = randomFirstName();
    const defaultLastName = randomLastName();
    clearGame();
    showName(defaultFirstName, defaultLastName);
    addTitle("Worker Name");
    addText("Pick a name for the worker.");

    const firstRow = document.createElement("div");
    firstRow.className = "name-row";

    const firstInput = document.createElement("input");
    firstInput.value = defaultFirstName;
    firstInput.placeholder = "First name";

    const lastRow = document.createElement("div");
    lastRow.className = "name-row";

    const lastInput = document.createElement("input");
    lastInput.value = defaultLastName;
    lastInput.placeholder = "Last name";

    firstRow.appendChild(firstInput);

    const firstRandomButton = document.createElement("button");
    firstRandomButton.className = "random-button";
    firstRandomButton.textContent = "Random";
    firstRandomButton.onclick = function (): void {
        firstInput.value = randomFirstName();
        showName(firstInput.value.trim(), lastInput.value.trim());
    };
    firstRow.appendChild(firstRandomButton);
    game.appendChild(firstRow);

    lastRow.appendChild(lastInput);

    const lastRandomButton = document.createElement("button");
    lastRandomButton.className = "random-button";
    lastRandomButton.textContent = "Random";
    lastRandomButton.onclick = function (): void {
        lastInput.value = randomLastName();
        showName(firstInput.value.trim(), lastInput.value.trim());
    };
    lastRow.appendChild(lastRandomButton);
    game.appendChild(lastRow);

    const error = document.createElement("p");
    error.className = "small-text";
    game.appendChild(error);

    const difficultyTitle = document.createElement("p");
    difficultyTitle.textContent = "Difficulty";
    game.appendChild(difficultyTitle);

    const difficultyRow = document.createElement("div");
    difficultyRow.className = "difficulty-row";

    difficulties.forEach(function (difficulty: Difficulty): void {
        const difficultyButton = document.createElement("button");
        difficultyButton.className = "difficulty-button";
        difficultyButton.textContent = difficulty.name;

        if (difficulty.name === selectedDifficulty.name) {
            difficultyButton.className = "difficulty-button selected";
        }

        difficultyButton.onclick = function (): void {
            selectedDifficulty = difficulty;

            document.querySelectorAll(".difficulty-button").forEach(function (button: Element): void {
                button.className = "difficulty-button";
            });

            difficultyButton.className = "difficulty-button selected";
        };

        difficultyRow.appendChild(difficultyButton);
    });

    game.appendChild(difficultyRow);

    const button = document.createElement("button");
    button.className = "big-button";
    button.textContent = "Start";
    button.onclick = function (): void {
        const firstName = firstInput.value.trim();
        const lastName = lastInput.value.trim();

        if (firstName === "" || lastName === "") {
            error.textContent = "First and last name are required.";
            return;
        }

        playerName = firstName + " " + lastName;
        nameBox.textContent = playerName;
        setChance(selectedDifficulty.startChance);
        setStamina(selectedDifficulty.startStamina);
        showStep("start");
    };

    game.appendChild(button);
}

showChancesBox.onchange = function (): void {
    if (playerName !== "") {
        showStep(currentStep);
    }
};

showMapBox.onchange = function (): void {
    mapBox.style.display = showMapBox.checked ? "block" : "none";
};

function showStep(which: Step): void {
    currentStep = which;
    clearGame();

    if (which === "start") {
        floorBox.textContent = "9";
        airBox.textContent = "Bad";
        updateMap("Starting room", "9th floor");
        addTitle("The Fire Starts");
        addText("It is late afternoon. You are on the ninth floor. Someone yells that there is fire below. Smoke is already coming up fast. It smells like hot cloth, machine oil, and burning hair.");
        addSmallText("The fire began on the eighth floor. The ninth floor had very little time.");
        addSmallText("Around you, workers are yelling in English, Yiddish, and Italian.");
        addSmallText("A lot of workers ended up at the windows because the stairs and elevators were blocked or too crowded.");
        addSmallText("Your best interest is to get to the street or up on the roof.");
        addChoice("Go to the Washington Place stairs.", "lockedDoor", -25, "", -8, 0);
        addChoice("Run for the elevators.", "elevator", -10, "", -18, 20);
        addChoice("Follow the crowd to the windows.", "window", -30, "", -12, 0);
        addChoice("Look for another stairway.", "greenStreetStairs", -12, "", -10, 0);
        addChoice("Go through the workroom first.", "workroom", -8, "", -7, 0);
        addChoice("Try to get to the roof stairs.", "roofStairs", 8, "", -16, 25);
        addRiskChoice("Go to the fire escape.", "street", -60, "The fire escape bent and broke under the crowd. You fell with it.", -20, 25, 75);
    }

    if (which === "workroom") {
        updateMap("Workroom", "9th floor");
        addTitle("Workroom");
        addText("The long tables are still covered with cloth. Some fabric is already burning. The room smells like dye, smoke, and singed hair.");
        addChoice("Grab a wet scrap for your mouth.", "wetCloth", -6, "", -6, 0);
        addChoice("Help someone who fell.", "helpWorker", -12, "", -18, 30);
        addChoice("Cut straight through to the other side.", "foremanOffice", -10, "", -14, 20);
        addChoice("Turn back to the elevators.", "elevator", -18, "", -12, 0);
    }

    if (which === "wetCloth") {
        updateMap("Workroom", "9th floor");
        addTitle("Wet Cloth");
        addText("You press damp cloth over your mouth. It does not fix the smoke, but it helps enough to move.");
        addChoice("Go toward the roof stairs.", "roofStairs", 8, "", -10, 20);
        addChoice("Go toward the elevators.", "elevator", -5, "", -8, 0);
    }

    if (which === "helpWorker") {
        updateMap("Workroom", "9th floor");
        addTitle("Another Worker");
        addText("You pull another worker up from the floor. It costs time, but the two of you move together through the smoke.");
        if (riskRoll(20)) {
            addChoice("Stay together and go upward.", "roofStairs", 5, "", -14, 15);
            addChoice("Try the elevator with them.", "elevator", -8, "", -10, 0);
        } else {
            addChoice("Keep moving.", "window", -20, "", -10, 0);
        }
    }

    if (which === "foremanOffice") {
        updateMap("Office", "9th floor");
        addTitle("Office Door");
        addText("You find a small office. Papers are on the floor. The air is clearer for a moment, but there is no real exit here.");
        addChoice("Use the office to catch your breath.", "roofStairs", 5, "", 10, 0);
        addChoice("Search the desk for keys.", "lockedDoor", -22, "", -8, 0);
    }

    if (which === "greenStreetStairs") {
        updateMap("Other stairs", "9th floor");
        addTitle("Other Stairs");
        addText("You reach another stairway, but the smoke is heavy there too. People are coming back up, coughing and scared.");
        addRiskChoice("Try to go down anyway.", "street", -45, "You tried to go down through smoke and fire. The stairway filled before you could reach the street.", -18, 20, 60);
        addChoice("Turn around and go up.", "roofStairs", -12, "", -15, 25);
        addChoice("Run for the elevators instead.", "elevator", -18, "", -18, 25);
    }

    if (which === "lockedDoor") {
        updateMap("Locked stair door", "9th floor");
        addTitle("The Door");
        addText("The stair door will not open. Workers push against it, but it is locked or stuck. The smoke is getting worse. Your throat burns when you breathe.");
        addChoice("Keep trying the door.", "lockedDoorMore", -20, "", -12, 0);
        addChoice("Turn back and look for another way.", "elevator", -10, "", -10, 0);
        addChoice("Break a window for air.", "window", -35, "", -12, 0);
    }

    if (which === "lockedDoorMore") {
        updateMap("Locked stair door", "9th floor");
        addTitle("Too Much Smoke");
        addText("More people press into the hallway. Nobody can move well. The air is hot and bitter, and people are coughing hard.");
        addChoice("Drop low and crawl back.", "elevator", -15, "", -18, 20);
        addRiskChoice("Stay by the door.", "elevator", -50, "You stayed at the locked stair door too long. The smoke filled the hallway before help could reach you.", -5, 0, 70);
    }

    if (which === "elevator") {
        updateMap("Elevators", "9th floor");
        addTitle("Elevators");
        addText("The elevators are still moving, but everyone is trying to get in. The operators are making dangerous trips through smoke and heat. The metal doors are warm when people hit them.");
        addSmallText("Some workers survived by elevator. Others could not fit or reached it too late.");
        addChoice("Wait your turn and squeeze in.", "elevatorLuck", 5, "", -8, 0);
        addChoice("Push through the crowd.", "elevatorPush", -20, "", -22, 35);
        addRiskChoice("Jump down the elevator shaft.", "street", -30, "You jumped into the elevator shaft and hit too hard to survive.", -20, 30, 65);
        addRiskChoice("Slide down the elevator shaft.", "street", 25, "You tried to slide down the elevator shaft, but lost your grip in the smoke and heat.", -26, 40, 38);
        addChoice("Give up and head upward.", "roofStairs", -5, "", -16, 25);
    }

    if (which === "elevatorPush") {
        updateMap("Elevators", "9th floor");
        addTitle("The Crowd");
        addText("Pushing makes people fall and shout. The elevator leaves before you can get inside. The hallway smells like scorched wool and sweat.");
        addChoice("Run to the roof stairs.", "roofStairs", -15, "", -20, 25);
        addChoice("Go to the windows.", "window", -35, "", -8, 0);
    }

    if (which === "elevatorLuck") {
        if (Math.random() * 100 < survival) {
            survived("You made it into the elevator. It dropped fast and rough, but it reached the street.");
        } else {
            die("You waited for the elevator, but it stopped coming back. The heat and smoke reached the hallway, and the air turned too thick to breathe.");
        }
    }

    if (which === "roofStairs") {
        updateMap("Roof stairs", "9th floor");
        addTitle("Upward");
        addText("You head upward instead of down. The stairs are crowded, but the air is a little better than the hall. Your eyes water from the smoke.");
        addSmallText("Many people on the tenth floor survived by going to the roof and crossing to nearby buildings.");
        addChoice("Keep going up to the roof.", "roofCrowd", 5, "", -18, 30);
        addChoice("Stop to pull someone up the stairs.", "helpWorker", -14, "", -18, 35);
        addChoice("Turn back because it feels wrong.", "elevator", -25, "", -12, 0);
    }

    if (which === "roofCrowd") {
        updateMap("Roof stairs", "Near roof");
        addTitle("Roof Stairs");
        addText("The stairwell is jammed. People are pushing upward. Smoke is following behind, and every pause feels dangerous.");
        addChoice("Stay low and keep climbing.", "roof", 0, "", -16, 25);
        addChoice("Push hard through the group.", "roof", -18, "", -25, 40);
        addChoice("Go back down.", "elevator", -28, "", -12, 0);
    }

    if (which === "roof") {
        floorBox.textContent = "Roof";
        airBox.textContent = "Better";
        updateMap("Roof", "Roof");
        addTitle("The Roof");
        addText("People are crossing over from the roof toward the next building. It is confusing, but there is space to move. Cold outside air hits your face.");
        addChoice("Follow the crowd across.", "roofSafe", 5, "", -12, 20);
        addRiskChoice("Stop and wait near the roof door.", "roofSafe", -45, "You waited near the roof door while smoke kept coming up the stairs.", -2, 0, 65);
    }

    if (which === "roofSafe") {
        if (riskRoll(18)) {
            survived("You crossed from the roof and got away with the group.");
        } else {
            die("You reached the roof, but smoke and the crush at the doorway slowed you down too long.");
        }
    }

    if (which === "window") {
        addTitle("The Windows");
        airBox.textContent = "Smoke";
        updateMap("Windows", "9th floor");
        addText("The windows give a little air. Down below, people are yelling. The ladders do not reach high enough. Smoke rolls out behind you, and there is a sick burnt smell from the rooms.");
        addSmallText("Many workers went to the windows. Some jumped because the heat behind them felt worse than the fall.");
        addRiskChoice("Stay at the window and call for help.", "street", -55, "The ladders could not reach the ninth floor. Waiting at the window did not save you. The smoke and heat kept getting worse.", -5, 0, 82);
        addChoice("Jump.", "dead", -100, "You jumped from the ninth floor. Many workers died this way because there was no safe landing.");
        addChoice("Leave the window and try the stairs again.", "roofStairs", -20, "", -22, 30);
    }

    if (which === "street") {
        floorBox.textContent = "Street";
        airBox.textContent = "Outside";
        updateMap("Street", "Street");
        survived("You are one of the few who made it out. The rest of your colleagues are still inside.");
    }

    if (which === "dead") {
        die("You ran out of time.");
    }
}

function survived(text: string): void {
    clearGame();
    game.className = "game-main survived";
    addTitle("You Survived");
    addText(playerName + ": " + text);
    addSmallText("Final survival chance: " + survival + "%");
    addSmallText("Final stamina: " + stamina + "%");

    const button = document.createElement("button");
    button.className = "big-button";
    button.textContent = "Restart";
    button.onclick = function (): void {
        window.location.href = "../main.html";
    };
    game.appendChild(button);
}

startNameScreen();
