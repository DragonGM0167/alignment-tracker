class AlignmentTracker {
    static MAX_RANGE = 100;
    static ID = 'alignment-tracker';
    static LAWFUL = 0;
    static GOOD = 0;
    static CHAOTIC = this.MAX_RANGE;
    static EVIL = this.MAX_RANGE;
  
    static FLAGS = {
      ALIGNMENT: 'alignment'
    }
    
    static TEMPLATES = {
      TRACKER: `modules/${this.ID}/templates/alignment-tracker.hbs`
    }

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

    // All the alignment trackers for a given users
    static getTrackersForUser(userId) {
        return game.users.get(userId)?.getFlag(AlignmentTracker.ID, AlignmentTracker.FLAGS.ALIGNMENT);
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

    // Create an alignment tracker for a user
    static create(userId, actorId) {
        // Generate a new alignment tracker for user id
        const alignmentTracker = {
            actorId,
            chaosLevel: this.MAX_RANGE / 2,
            evilLevel: this.MAX_RANGE / 2,
            maxLevel: this.MAX_RANGE,
            userId,
            trackerId: foundry.utils.randomID(16),
        }
        // Construct the update to insert the new alignment tracker
        const alignmentTrackers = {
            [actorId]: alignmentTracker
        }
        return game.users.get(userId)?.setFlag(AlignmentTracker.ID, AlignmentTracker.FLAGS.ALIGNMENT, alignmentTrackers);
    }

    // Private method
    // Update an alignment tracker with values
    static #update(tracker, trackerData) {
        // If the caller supplies invalid elements, ignore the request.
        if (trackerData.chaosLevel < this.LAWFUL || trackerData.chaosLevel > this.CHAOTIC ||
            trackerData.evilLevel < this.GOOD || trackerData.evilLevel > this.EVIL) {
            return game.users.get(tracker.userId)?.setFlag(AlignmentTracker.ID, AlignmentTracker.FLAGS.ALIGNMENT, tracker);
        }
        const trackers = {
            [tracker.actorId]: {
                actorId: tracker.actorId,
                chaosLevel: trackerData.chaosLevel,
                evilLevel: trackerData.evilLevel,
                maxLevel: tracker.maxLevel,
                userId: tracker.userId,
                trackerId: tracker.trackerId,
            }
        }
        return game.users.get(tracker.userId)?.setFlag(AlignmentTracker.ID, AlignmentTracker.FLAGS.ALIGNMENT, trackers);
    }

    static updateByActorId(actorId) {
        return this.#update(this.getAllTrackers()[actorId], trackerData);
    }

    static updateByTrackerId(trackerId) {
        return this.#update(this.getByTrackerId(trackerId), trackerData);
    }

    // Private method
    // Adjust the chaotic scale for tracker.
    static #adjustChaotic(tracker, adjustment) {
        const chaosLevel = tracker.chaosLevel + adjustment;
        if (chaosLevel < this.LAWFUL) {
            return this.update(tracker, { chaosLevel: this.LAWFUL });
        }
        if (chaosLevel > this.CHAOTIC) {
            return this.update(tracker, { chaosLevel: this.CHAOTIC });
        }
        return this.update(tracker, { chaosLevel: chaosLevel });
    }

    static adjustChaoticByActorId(actorId) {
        return this.#adjustChaotic(this.getAllTrackers()[actorId], trackerData);
    }

    static adjustChaoticByTrackerId(trackerId) {
        return this.#adjustChaotic(this.getByTrackerId(trackerId), trackerData);
    }

    // Private method
    // Adjust the evil scale for tracker.
    static #adjustEvil(tracker, adjustment) {
        const evilLevel = tracker.chaosLevel + adjustment;
        if (evilLevel < this.GOOD) {
            return this.update(tracker, { evilLevel: this.GOOD });
        }
        if (evilLevel > this.EVIL) {
            return this.update(tracker, { evilLevel: this.EVIL });
        }
        return this.update(tracker, { evilLevel: evilLevel });
    }

    static adjustEvilByActorId(actorId) {
        return this.#adjustEvil(this.getAllTrackers()[actorId], trackerData);
    }

    static adjustEvilByTrackerId(trackerId) {
        return this.#adjustEvil(this.getByTrackerId(trackerId), trackerData);
    }

    // Private method
    // Delete an alignment tracker
    static #delete(tracker) {
        const trackers = {
            [`-=${tracker.actorId}`]: null
        }
        return game.users.get(tracker.userId)?.setFlag(AlignmentTracker.ID, AlignmentTracker.FLAGS.ALIGNMENT, trackers);
    }
 
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
    
    // Delete all alignment trackers
    static deleteAll() {
        const userIds = game.users.reduce((accumulator, user) => { 
            return {...accumulator, ...user.userId}
        }, {});
        for (let userId in userIds) {
            this.deleteByUserId(userId);
        }
    }

    static log(force, ...args) {  
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);
    
        if (shouldLog) {
          console.log(this.ID, '|', ...args);
        }
    }
}