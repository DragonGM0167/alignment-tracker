import { AlignmentTracker } from "./alignment-tracker.js";
import { AlignmentTrackerUtils } from "./alignment-tracker-utils.js";
import { AlignmentTrackerAdjustmentUI } from "./alignment-tracker-adjustment-ui.js";

export class AlignmentTrackerUI extends FormApplication {
    static instance = null;

    static activate() {
        if (!this.instance) {
            this.instance = new AlignmentTrackerUI();
        }
        if (!this.instance.rendered) {
            this.instance.render(true);
        }
        else {
            this.instance.bringToTop();
        }
    }

    static async refresh() {
        this.instance?.render();
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["sheet"],
            height: 360,
            width: 450,
            resizable: false,
            editable: true,
            id: "alignment-tracker",
            template: `./modules/${AlignmentTracker.ID}/templates/${AlignmentTracker.ID}.hbs`,
            title: "alignment-tracker.title",
            userId: game.userId,
            closeOnSubmit: false,
            submitOnChange: false
        });
    }

    // We don't need any data from the options (parameter) so just call the utility to build out the cell data
    // that is sent to the handlebars form
    getData(options) {
        const alignment_tracker_data = AlignmentTrackerUtils.buildTrackerData();
        return { alignment_tracker_data };
    }

    activateListeners(html) {
        super.activateListeners(html);
        
        const characterDataArray = AlignmentTrackerUtils.buildCharacterDataArray();
        for (let index = 0; index < characterDataArray.length; index++) {
            html.find(`button[data-action="${characterDataArray[index].actorId}"]`).click(function(event) {
                AlignmentTrackerAdjustmentUI.activate(characterDataArray[index]);
            });
        }
    }

    async _updateObject(event, formData) {}
}