import { AlignmentTracker } from "./alignment-tracker.js";

export class AlignmentTrackerAdjustmentUI extends FormApplication {
    static instance = null;
    static characterData;

    constructor(characterData) {
        super();
        this.characterData = characterData;
    }

    static activate(characterData) {
        if (!this.instance) {
            this.instance = new AlignmentTrackerAdjustmentUI(characterData);
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
            height: 260,
            width: 440,
            resizable: false,
            editable: true,
            id: "alignment-tracker-adj",
            template: `./modules/${AlignmentTracker.ID}/templates/${AlignmentTracker.ID}-adj.hbs`,
            title: "alignment-tracker.adjustment-title",
            userId: game.userId,
            closeOnSubmit: false,
            submitOnChange: false
        });
    }    

    // We don't need any data from the options (parameter) so just call the utility to build out the cell data
    // that is sent to the handlebars form
    getData(options) {
        return { actorName: this.characterData.actorName };
    }

    activateListeners(html) {
        super.activateListeners(html);
        const adjustmentValue = game.settings.get("alignment-tracker", "individual-adjustment");
        const actorId = this.characterData.actorId;
        html.find(`button[data-action="adjust-good"]`).click(function(event) {
            AlignmentTracker.adjustEvilByActorId(actorId, -adjustmentValue);
        });
        html.find(`button[data-action="adjust-lawful"]`).click(function(event) {
            AlignmentTracker.adjustChaoticByActorId(actorId, -adjustmentValue);
        });
        html.find(`button[data-action="adjust-chaotic"]`).click(function(event) {
            AlignmentTracker.adjustChaoticByActorId(actorId, adjustmentValue);
        });
        html.find(`button[data-action="adjust-evil"]`).click(function(event) {
            AlignmentTracker.adjustEvilByActorId(actorId, adjustmentValue);
        });
    }

    async _updateObject(event, formData) {}
}