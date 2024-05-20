import { AlignmentTracker } from "./alignment-tracker.js";

export class AlignmentTrackerUtils {
    static buildTrackerData() {
        const characterDataArray = this.buildCharacterDataArray();
        return { 
            cells: this.#buildCells(characterDataArray),
            sideButtons: this.#buildSideButtons(characterDataArray)
         };
    }

    static adjust() {
        
    }

    static buildCharacterDataArray() {
        const currentUser = game.user;
        const allUsers = game.users._source;
        let characterData = [];
        /* Iterate ovar all the users and build an object that will be used
           to color the cells and build out the side buttons of the UI.
        */  
        for (let index = 0; index < allUsers.length; index++) {
            const actorId = allUsers[index].character;
            if ((currentUser.isGM || 
                 (game.settings.get("alignment-tracker", "show-user-badge") && 
                 allUsers[index]._id == currentUser._id)) && 
                (actorId != null && actorId != undefined)) {
                const tracker = this.#getTracker(allUsers[index]._id, actorId);
                let rowOfAlignment;
                let columnOfAlignment;
                if (tracker != undefined) {
                    rowOfAlignment = this.#calculatePosition(tracker.evilLevel);
                    columnOfAlignment = this.#calculatePosition(tracker.chaosLevel);
                }
                characterData.push(
                    {
                        actorId: allUsers[index].character,
                        actorName: game.actors.get(actorId)?.name,
                        userId: allUsers[index]._id,
                        playerColor: allUsers[index].color,
                        alignmentRow: rowOfAlignment,
                        alignmentColumn: columnOfAlignment
                    }
                )
            }
        }
        return characterData;
    }

    static #buildCells(characterDataArray) {
        let cellData = "";
        for (let rows = 0; rows < 21; rows++) {
            for (let cols = 0; cols < 21; cols++) {
                let foundOne = false;
                for (let index = 0; index < characterDataArray.length; index++) {
                    let alignmentColumn = characterDataArray[index].alignmentColumn;
                    let alignmentRow = characterDataArray[index].alignmentRow;
                    if (alignmentColumn != undefined && alignmentRow != undefined) {
                        if (cols == alignmentColumn && rows == alignmentRow) {
                            cellData += `<div style="background-color: ${characterDataArray[index].playerColor}"></div>`
                            foundOne = true;
                            break;
                        }
                    }
                }
                if (!foundOne) {
                    cellData += "<div></div>"
                }
            }
        }
        return cellData;
    }

    static #buildSideButtons(characterDataArray) {
        let sideButtons = "";
        if (!game.user.isGM) {
            sideButtons +=  `<div style="display: grid;grid-template-columns: 130px;grid-template-rows: 2em">\n`;
            sideButtons += `<div class="alignment-tracker__refresh_button"><button data-action="refresh">`;
            sideButtons += `<i class="fa-solid fa-arrow-rotate-right"></i><div>Refresh</div></button>\n`;
            sideButtons += "</div>";
            return sideButtons;
        }
        const numberofCharacters = characterDataArray.length;
        let rowPattern = "";
        for (let index = 0; index < numberofCharacters; index++) {
            rowPattern += " 2em 4px";
        }
        rowPattern += " 2em";
        if (numberofCharacters > 0) {
            sideButtons +=  `<div style="display: grid;grid-template-columns: 130px;grid-template-rows: ${rowPattern};">\n`;
            for (let index = 0; index < numberofCharacters; index++) {
                const playerColor = characterDataArray[index].playerColor;
                sideButtons += `<button style="background-color: ${playerColor};color: ${this.#contrastColor(playerColor, true)};`
                sideButtons += ` text-align: center;" data-action="${characterDataArray[index].actorId}">${characterDataArray[index].actorName}</button>\n`;
                sideButtons += "<div></div>";
            }
            sideButtons += `<div class="alignment-tracker__refresh_button"><button data-action="refresh">`;
            sideButtons += `<i class="fa-solid fa-arrow-rotate-right"></i><div>Refresh</div></button>\n`;
            sideButtons += "</div>";
        }
        return sideButtons;
    }

    static #getTracker(userId, actorId) {
        if (actorId == null || actorId == undefined) {
            return;
        }
        let tracker = AlignmentTracker.getByActorId(actorId);
        if (tracker == null || tracker == undefined) {
            return AlignmentTracker.create(userId, actorId);
        }
        return tracker;
    }

    static #calculatePosition(levelValue) {
        return Math.trunc((levelValue + 2) / 5);
    }

    static #contrastColor(colorHex, highContrast) {
        if (colorHex.indexOf('#') === 0) {
            colorHex = colorHex.slice(1);
        }
        // convert 3-digit colorHex to 6-digits.
        if (colorHex.length === 3) {
            colorHex = colorHex[0] + colorHex[0] + colorHex[1] + colorHex[1] + colorHex[2] + colorHex[2];
        }
        if (colorHex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
        let red = parseInt(colorHex.slice(0, 2), 16);
        let green = parseInt(colorHex.slice(2, 4), 16);
        let blue = parseInt(colorHex.slice(4, 6), 16);
        if (highContrast) {
            return (red * 0.299 + green * 0.587 + blue * 0.114) > 186 ? '#000000' : '#FFFFFF';
        }
        // invert color components
        red = (255 - red).toString(16);
        green = (255 - green).toString(16);
        blue = (255 - blue).toString(16);
        // pad each with zeros and return
        return "#" + red.padStart(2, '0') + green.padStart(2, '0') + blue.padStart(2, '0');
    }
}