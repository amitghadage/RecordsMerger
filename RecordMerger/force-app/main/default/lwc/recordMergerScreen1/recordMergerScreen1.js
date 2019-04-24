import { LightningElement, wire, track } from 'lwc';
import getSobjectList from '@salesforce/apex/SchemaController.getSobjectList';
import getRecords from '@salesforce/apex/RecordFetcher.getRecords';
import {ShowToastEvent } from 'lightning/platformShowToastEvent'

export default class RecordMergerScreen1 extends LightningElement {
    @wire(getSobjectList) objectsList;
    @track recordsList;
    @track error;
    @track objectName;
    fetchRecords(){
        var selectedObject = this.template.querySelector('[data-id="objectList"]').value;
        var searchWord = this.template.querySelector('[data-id="searchBox"]').value;
        this.objectName = selectedObject;
        getRecords({ searchFor : searchWord, objectName : selectedObject})
        .then(result => {
            this.recordsList = result;
            this.error = undefined;
            console.log("spinner stopped result : "+JSON.stringify(result));
        })
        .catch(error => {
            this.recordsList = undefined;
            this.error = error;
        })
    }

    handleClick() {
        var selectedRecordsSet = new Set();
        var selectedRecords = [], i;

        var checkboxes = this.template.querySelectorAll('input[type=checkbox]:checked');
        if(checkboxes.length != 2) {
            const evt = new ShowToastEvent({
                title: "Error",
                message: "Please select only two records",
                variant: "error",
            });
            this.dispatchEvent(evt);
            return;
        }
        for (i = 0; i < checkboxes.length; i++) {
            selectedRecordsSet.add(checkboxes[i].value);
        }
        for(i=0 ; i<this.recordsList.length; i++) {
            if(selectedRecordsSet.has(this.recordsList[i].Id)) {
                selectedRecords.push(this.recordsList[i]);
            }
        }
        this.dispatchEvent(
            new CustomEvent('dataselect', {detail : selectedRecords})
        );
    }
}