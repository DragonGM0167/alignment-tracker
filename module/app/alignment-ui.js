import { AlignmentTracker } from "../alignment-tracker.js"

export class AlignmentUI extends FormApplication {
    static instance = null;

    static activate() {
        if (!this.instance) {
            this.instance = new AlignmentUI();
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
            height: 350,
            width: 310,
            resizable: false,
            editable: false,
            id: "alignment-tracker",
            template: `./modules/${AlignmentTracker.ID}/templates/${AlignmentTracker.ID}.hbs`,
            title: "alignment-tracker.title",
            userId: game.userId,
            closeOnSubmit: false,
            submitOnChange: false
        });
    }

/*
    async _updateObject(event, formData) {
        const data = foundry.utils.expandObject(formData);

        if (data.milestoneName && data.milestoneXp) {
            const reward = {
                type: "milestone",
                id: Tally.nextMilestoneId,
                name: data.milestoneName,
                xp: data.milestoneXp
            };

            Tally.addReward(reward);
        }
    }

    getData(options) {
        const rewards = Tally.rewards;

        return { rewards };
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find('a[data-action="delete-reward"]').click(function(event) {
            const rewardElem = this.closest('.reward');
            const index = rewardElem.dataset.index;
            Tally.removeByIndex(index);
        });
        html.find('button[data-action="award-rewards"]').click(function(event) {
            if (Tally.rewards.length) {
                AwardXp.activate();
            } else {
                ui.notifications.warn(game.i18n.localize("xp-tally.warn-no-rewards"));
            }
        })
    }

    _onDragStart(event) {
        event.dataTransfer.setData("text/plain", JSON.stringify({
            type: "Reward",
            index: event.target.dataset.index
        }));
    }

    _onDrop(event) {
        let data;
        try {
            data = JSON.parse(event.dataTransfer.getData("text/plain"));
        } catch(err) {
            return false;
        }
        
        if (data.type === "Actor") {
            const actor = fromUuidSync(data.uuid);
            if (!actor.pack) {
                const xp = actor.system.details.xp?.value;
                if (xp) {
                    const reward = {
                        type: "actor",
                        uuid: data.uuid,
                        img: actor.prototypeToken.texture.src,
                        name: actor.name,
                        xp: xp
                    };
                    Tally.addReward(reward);
                }
            }
        } else if (data.type === "Reward") {
            const rewards = Tally.rewards;
            const sourceIndex = data.index;
            const targetIndex = event.target.closest('.reward')?.dataset.index || rewards.length - 1;

            if (sourceIndex !== targetIndex) {
                const source = rewards[sourceIndex];
                const filteredRewards = rewards.filter((r, i) => i != sourceIndex);
                const newRewards = [...filteredRewards.slice(0, targetIndex), source, ...filteredRewards.slice(targetIndex)];
                Tally.setRewards(newRewards);
            }
        }
    }

    _getHeaderButtons() {
        return [
            {
                label: game.i18n.localize("xp-tally.history"),
                class: "history",
                icon: "fas fa-book",
                onclick: () => {
                    History.activate();
                }
            },
            ...super._getHeaderButtons()
        ];
    }
*/
}