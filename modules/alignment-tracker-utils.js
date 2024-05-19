import { AlignmentTracker } from "./alignment-tracker.js";

export class AlignmentTrackerUtils {
    static buildTrackerData() {
        const characterDataArray = this.#buildCharacterDataArray();
        return { 
            cells: this.#buildCells(characterDataArray),
            footer: this.#buildFooter(characterDataArray)
         };
    }

    static adjust() {
        
    }

    static #buildCharacterDataArray() {
        const currentUser = game.user;
        const allUsers = game.users._source;
        let characterData = [];
        /* Iterate ovar all the users and build an object that will be used
           to color the cells and build out the footer of the UI.
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
        console.log(characterData);
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

    static #buildFooter(characterDataArray) {
        let footer = "";
        const numberofCharacters = characterDataArray.length;
        if (numberofCharacters > 0) {
            footer +=  `<div style="display: grid;grid-template-columns: 25px 120px 25px 120px;grid-template-rows: repeat(${Math.ceil(numberofCharacters / 2)}, 1em);">\n`;
            for (let index = 0; index < numberofCharacters; index++) {
                footer += "<div></div>";
                footer += `<div style="color: ${characterDataArray[index].playerColor}">${characterDataArray[index].actorName}</div>`;
            }
            footer += "</div>";
        }
        return footer;
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
}