import { AlignmentTracker } from "./alignment-tracker.js";

export class AlignmentTrackerUtils {
    static getUsers() {
        // Retrieve the array of available users for the game
        // Note: this could be used to get actor and player color later.
        return game.users._source;
    }

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
        const allUsers = this.getUsers();
        let characterData = [];
        /* Iterate ovar all the users and build an object that will be used
           to color the cells and build out the footer of the UI.
        */  
        for (let index = 0; index < allUsers.length; index++) {
            const actorName = allUsers[index].character?.name;
            if ((currentUser.isGM && true) ||
                (currentUser.isPlayer && true && 
                 allUsers[index]._id == currentUser._id) &&
                 actorName != undefined) {
                const tracker = this.#getTracker(allUsers[index]);
                let rowOfAlignment;
                let columnOfAlignment;
                if (tracker != undefined) {
                    rowOfAlignment = this.#calculatePosition(tracker.evilLevel);
                    columnOfAlignment = this.#calculatePosition(tracker.chaosLevel);
                }
                characterData.push(
                    {
                        actorId: allUsers[index].character?._id,
                        actorName: actorName,
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
        for (let cols = 0; cols < 21; cols++) {
            for (let rows = 0; rows < 21; rows++) {
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
        for (let index = 0; index < characterDataArray.length; index++) {
            footer += `<div style="${characterDataArray[index].playerColor}">${characterDataArray[index].actorName}</div>`;
        }
    }

    static async #getTracker(characterData) {
        let actorId = characterData.actorId;
        if (actorId == null || actorId == undefined) {
            return;
        }
        let tracker = AlignmentTracker.getByActorId(actorId);
        if (tracker == null || tracker == undefined) {
            await AlignmentTracker.create(characterData.userId, actorId);
            return this.#getTracker(actorId);
        }
        return tracker;
    }

    static #calculatePosition(levelValue) {
        return Math.trunc((levelValue + 2) / 5);
    }
}