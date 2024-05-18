import { AlignmentTrackerUI } from "./app/alignment-tracker-ui.js";
import { AlignmentTrackerUtils } from "./app/alignment-tracker-utils.js";

// Create a badge under the "Token Control" section of the Foundry UI.
Hooks.on("getSceneControlButtons", (controls) => {
    if (game.user.isGM) {
        const tokens = controls.find((c) => c.name === "token");
        if (tokens) {
            tokens.tools.push({
                name: "alignment-tracker",
                title: "Character Alignments",
                icon: "far fa-balance-scale",
                visible: true,
                onClick: () => AlignmentTrackerUI.activate(),
                button: true
            });
        }
    }
});

// To add setting entries in the "Configure Game Settings" dialog
Hooks.on("init", () => {
    game.settings.register("alignment-tracker", "show-gm-badge", {
        name: "alignment-tracker.setting-show-gm-badge",
        scope: "world",
        config: true,
        type: Boolean,
        default: true
    });
    game.settings.register("alignment-tracker", "show-user-badge", {
        name: "alignment-tracker.setting-show-user-badge",
        scope: "world",
        config: true,
        type: Boolean,
        default: false
    });
    game.settings.register("alignment-tracker", "individual-adjustment", {
        name: "alignment-tracker.setting-individual-adjustment",
        hint: "alignment-tracker.setting-individual-adjustment-hint",
        scope: "world",
        config: true,
        type: Boolean,
        default: true,
        onChange: value => {
            AlignmentTrackerUtils.adjust();
        }
    });
});

// The backend class to manipulate and store the individual character alignment values.
export class AlignmentTracker {
    static MAX_RANGE = 100;
    static ID = 'alignment-tracker';
    static LAWFUL = 0;
    static GOOD = 0;
    static CHAOTIC = this.MAX_RANGE;
    static EVIL = this.MAX_RANGE;
  
    static FLAGS = {
      ALIGNMENT_TRACKER: 'alignment-tracker'
    }

    // Private methods
    static #update(tracker, trackerData) {
        if (tracker == null || tracker == undefined ||
            trackerData.chaosLevel < this.LAWFUL || trackerData.chaosLevel > this.CHAOTIC ||
            trackerData.evilLevel < this.GOOD || trackerData.evilLevel > this.EVIL) {
            return;
        }
        const modifiedTracker = {
            [tracker.actorId]: {
                actorId: tracker.actorId,
                chaosLevel: trackerData.chaosLevel,
                evilLevel: trackerData.evilLevel,
                maxLevel: tracker.maxLevel,
                userId: tracker.userId,
                trackerId: tracker.trackerId,
            }
        }
        return game.users.get(tracker.userId)?.setFlag(AlignmentTracker.ID, AlignmentTracker.FLAGS.ALIGNMENT_TRACKER, modifiedTracker);
    }

    static #adjustChaotic(tracker, adjustment) {
        if (tracker == null || tracker == undefined) {
            return;
        }
        const chaosLevel = tracker.chaosLevel + adjustment;
        if (chaosLevel < this.LAWFUL) {
            return this.#update(tracker, { chaosLevel: this.LAWFUL });
        }
        if (chaosLevel > this.CHAOTIC) {
            return this.#update(tracker, { chaosLevel: this.CHAOTIC });
        }
        return this.#update(tracker, { chaosLevel: chaosLevel });
    }

    static #adjustEvil(tracker, adjustment) {
        if (tracker == null || tracker == undefined) {
            return;
        }
        const evilLevel = tracker.evilLevel + adjustment;
        if (evilLevel < this.GOOD) {
            return this.#update(tracker, { evilLevel: this.GOOD });
        }
        if (evilLevel > this.EVIL) {
            return this.#update(tracker, { evilLevel: this.EVIL });
        }
        return this.#update(tracker, { evilLevel: evilLevel });
    }

    static #delete(tracker) {
        if (tracker == null || tracker == undefined) {
            return;
        }
        const trackers = {
            [`-=${tracker.actorId}`]: null
        }
        return game.users.get(tracker.userId)?.setFlag(AlignmentTracker.ID, AlignmentTracker.FLAGS.ALIGNMENT_TRACKER, trackers);
    }

    // Public Methods
    // -- GETTER Methods
    // All the alignment trackers for all the users
    static getAllTrackers() {
        const allTrackers = game.users.reduce((accumulator, user) => {
            const userAlignmentTrackers = this.getTrackersForUser(user.id);
            return {
                ...accumulator,
                ...userAlignmentTrackers
            }
        }, {});
        return allTrackers;
    }

    // All the alignment trackers for a given user
    static getTrackersForUser(userId) {
        return game.users.get(userId)?.getFlag(AlignmentTracker.ID, AlignmentTracker.FLAGS.ALIGNMENT_TRACKER);
    }

    // Get the tracker based off of it's tracker id
    static getByTrackerId(trackerId) {
        const trackers = this.getAllTrackers();
        for (let key in trackers) {
            const tracker = trackers[key];
            if (tracker.trackerId == trackerId) {
                return tracker;
            }
        }
    }

    // -- CREATION Methods
    // Create an alignment tracker for a user and actor
    static create(userId, actorId) {
        // Generate a new alignment tracker for user id
        const newTracker = {
            actorId,
            chaosLevel: this.MAX_RANGE / 2,
            evilLevel: this.MAX_RANGE / 2,
            maxLevel: this.MAX_RANGE,
            userId,
            trackerId: foundry.utils.randomID(16),
        }
        // Add the new tracker, keyed off the actorId
        const alignmentTrackers = {
            [actorId]: newTracker
        }
        return game.users.get(userId)?.setFlag(AlignmentTracker.ID, AlignmentTracker.FLAGS.ALIGNMENT_TRACKER, alignmentTrackers);
    }

    // -- UPDATE Methods
    static updateByActorId(actorId, trackerData) {
        return this.#update(this.getAllTrackers()[actorId], trackerData);
    }

    static updateByTrackerId(trackerId, trackerData) {
        return this.#update(this.getByTrackerId(trackerId), trackerData);
    }

    static adjustChaoticByActorId(actorId, adjustment) {
        return this.#adjustChaotic(this.getAllTrackers()[actorId], adjustment);
    }

    static adjustChaoticByTrackerId(trackerId, adjustment) {
        return this.#adjustChaotic(this.getByTrackerId(trackerId), adjustment);
    }

    static adjustEvilByActorId(actorId, adjustment) {
        return this.#adjustEvil(this.getAllTrackers()[actorId], adjustment);
    }

    static adjustEvilByTrackerId(trackerId, adjustment) {
        return this.#adjustEvil(this.getByTrackerId(trackerId), adjustment);
    }

    // -- DELETE Methods
    static deleteByActorId(actorId) {
        return this.#delete(this.getAllTrackers()[actorId]);
    }

    static deleteByTrackerId(trackerId) {
        return this.#delete(this.getByTrackerId(trackerId));
    }

    static async deleteByUserId(userId) {
        const trackersToBeDeleted = this.getTrackersForUser(userId);
        for (let key in trackersToBeDeleted) {
            await this.#delete(trackersToBeDeleted[key]);
        }
    }
    
    static deleteAll() {
        // Retrieve the array of available users for the game
        // Note: this could be used to get actor and player color later.
        const users = game.users._source;
        for (let index = 0; index < users.length; index++) {
            this.deleteByUserId(users[index]._id);
        }
    }

    // -- DEBUGGING Methods
    static log(force, ...args) {  
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);
    
        if (shouldLog) {
          console.log(this.ID, '|', ...args);
        }
    }
}