import { AlignmentTrackerUI } from "./alignment-tracker-ui.js";
import { AlignmentTrackerUtils } from "./alignment-tracker-utils.js";

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