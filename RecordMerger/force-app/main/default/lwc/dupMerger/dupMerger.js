import { LightningElement, track} from 'lwc';
export default class DupMerger extends LightningElement {
    @track
    screen1 = true;
    @track
    screen2 = false;
    selectedrecords;
    handleDataSelect(event) {
        this.screen1 = false;
        this.screen2 = true;
        this.selectedrecords = event.detail;
    }

    handlePrevious() {
        this.screen1 = true;
        this.screen2 = false;
    }
}