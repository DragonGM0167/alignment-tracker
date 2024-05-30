// The backend class to manipulate and store the individual character alignment values.
export class AlignmentTracker {
    static #MAX_RANGE = 100;
    static ID = 'alignment-tracker';
  
    static FLAGS = {
      ALIGNMENT_TRACKER: 'alignment-tracker'
    }

    // Private methods
    static #update(tracker, trackerData) {
        if (!game.user.isGM) {
            ui.notifications.error("You don't have permission to update unowned trackers.");
            return;
        }
        if (tracker == null || tracker == undefined ||
            trackerData.chaosLevel < 0 || trackerData.chaosLevel > this.#MAX_RANGE ||
            trackerData.evilLevel < 0 || trackerData.evilLevel > this.#MAX_RANGE) {
            return;
        }
        const updatedTracker = {
            actorId: tracker.actorId,
            chaosLevel: trackerData.chaosLevel,
            evilLevel: trackerData.evilLevel,
            maxLevel: tracker.maxLevel,
            userId: tracker.userId,
            trackerId: tracker.trackerId,
        };
        const modifiedTracker = {
            [tracker.actorId]: updatedTracker
        }
        game.users.get(tracker.userId)?.setFlag(AlignmentTracker.ID, AlignmentTracker.FLAGS.ALIGNMENT_TRACKER, modifiedTracker);
        return updatedTracker;
    }

    static #adjustChaotic(tracker, adjustment) {
        if (tracker == null || tracker == undefined) {
            return;
        }
        const chaosLevel = tracker.chaosLevel + adjustment;
        if (chaosLevel < this.LAWFUL) {
            return this.#update(tracker, { chaosLevel: 0 });
        }
        if (chaosLevel > this.CHAOTIC) {
            return this.#update(tracker, { chaosLevel: this.#MAX_RANGE });
        }
        return this.#update(tracker, { chaosLevel: chaosLevel });
    }

    static #adjustEvil(tracker, adjustment) {
        if (tracker == null || tracker == undefined) {
            return;
        }
        const evilLevel = tracker.evilLevel + adjustment;
        if (evilLevel < this.GOOD) {
            return this.#update(tracker, { evilLevel: 0 });
        }
        if (evilLevel > this.EVIL) {
            return this.#update(tracker, { evilLevel: this.#MAX_RANGE });
        }
        return this.#update(tracker, { evilLevel: evilLevel });
    }

    static #delete(tracker) {
        if (!game.user.isGM) {
            ui.notifications.error("You don't have permission to delete trackers.");
            return;
        }
        if (tracker == null || tracker == undefined) {
            return;
        }
        const trackers = {
            [`-=${tracker.actorId}`]: null
        }
        game.users.get(tracker.userId)?.setFlag(AlignmentTracker.ID, AlignmentTracker.FLAGS.ALIGNMENT_TRACKER, trackers);
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

    static getByActorId(actorId) {
        return this.getAllTrackers()[actorId];
    }

    // -- CREATION Methods
    // Create an alignment tracker for a user and actor
    static create(userId, actorId) {
        if (!game.user.isGM) {
            ui.notifications.error("You don't have permission to create trackers.");
            return;
        }
        // Generate a new alignment tracker for user id
        const newTracker = {
            actorId,
            chaosLevel: this.#MAX_RANGE / 2,
            evilLevel: this.#MAX_RANGE / 2,
            maxLevel: this.#MAX_RANGE,
            userId,
            trackerId: foundry.utils.randomID(16),
        }
        // Add the new tracker, keyed off the actorId
        const alignmentTrackers = {
            [actorId]: newTracker
        }
        game.users.get(userId)?.setFlag(AlignmentTracker.ID, AlignmentTracker.FLAGS.ALIGNMENT_TRACKER, alignmentTrackers);
        return newTracker;
    }

    // -- UPDATE Methods
    static updateByActorId(actorId, trackerData) {
        return this.#update(this.getByActorId(actorId), trackerData);
    }

    static updateByTrackerId(trackerId, trackerData) {
        return this.#update(this.getByTrackerId(trackerId), trackerData);
    }

    static adjustChaoticByActorId(actorId, adjustment) {
        return this.#adjustChaotic(this.getByActorId(actorId), adjustment);
    }

    static adjustChaoticByTrackerId(trackerId, adjustment) {
        return this.#adjustChaotic(this.getByTrackerId(trackerId), adjustment);
    }

    static adjustEvilByActorId(actorId, adjustment) {
        return this.#adjustEvil(this.getByActorId(actorId), adjustment);
    }

    static adjustEvilByTrackerId(trackerId, adjustment) {
        return this.#adjustEvil(this.getByTrackerId(trackerId), adjustment);
    }

    // -- DELETE Methods
    static deleteByActorId(actorId) {
        this.#delete(this.getByActorId(actorId));
    }

    static deleteByTrackerId(trackerId) {
        this.#delete(this.getByTrackerId(trackerId));
    }

    static deleteAllByUserId(userId) {
        const trackersToBeDeleted = this.getTrackersForUser(userId);
        for (let key in trackersToBeDeleted) {
            this.#delete(trackersToBeDeleted[key]);
        }
    }
    
    static deleteAll() {
        if (!game.user.isGM) {
            ui.notifications.error("You don't have permission to delete trackers.");
            return;
        }
        const users = game.users._source;
        // Iterate ovar all the users of the game and delete any alignment trackers
        // associated with them.
        for (let index = 0; index < users.length; index++) {
            this.deleteAllByUserId(users[index]._id);
        }
    }

    static removeOrphans() {
        if (!game.user.isGM) {
            ui.notifications.error("You don't have permission to delete trackers.");
            return;
        }
        const allTrackers = this.getAllTrackers();
        const userIds = [];
        const actorIds = [];
        const users = game.users._source;
        const actors = game.actors._source;

        for (let index = 0; index < users.length; index++) {
            userIds.push(users[index]._id);
        }
        for (let index = 0; index < actors.length; index++) {
            actorIds.push(actors[index]._id);
        }
        for (let key in allTrackers) {
            const tracker = allTrackers[key];
            // If the tracker has a orphaned user id, delete all the trackers for the orphaned user id
            if (!userIds.includes(tracker.userId)) {
                this.deleteAllByUserId(tracker.userId);
            }
        }
        for (let key in allTrackers) {
            const tracker = allTrackers[key];
            // If the tracker has a orphaned actor id, delete the tracker for the orphaned actor id
            if (!actorIds.includes(tracker.actorId)) {
                this.deleteByActorId(tracker.actorId);
            }
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