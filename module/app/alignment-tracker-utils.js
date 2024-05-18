import { AlignmentTracker } from "../alignment-tracker.js";

export class AlignmentTrackerUtils {
    static buildCells() {
        let alignment_tracker_cells = "";
        for (let cols = 0; cols < 21; cols++) {
            for (let rows = 0; rows < 21; rows++) {
                alignment_tracker_cells += "<div></div>"
            }
        }
        return alignment_tracker_cells;
    }

    static adjust() {
        
    }
}