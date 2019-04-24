import { LightningElement, api, track } from 'lwc';
import mergeRecords from '@salesforce/apex/RecordFetcher.mergeRecords';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class RecordMergerScreen2 extends NavigationMixin(LightningElement) {
    _selectedrecords;
    masterRecord = "record1";
    @track
    comparisondata;
    @api
    get selectedrecords() {
        return this.selectedrecords
    }
    set selectedrecords(value) {
        var keys = [];
        var tableRecords = [], i, record1, record2, key;
       keys = Object.keys(value[0]);
       keys = keys.concat(Object.keys(value[1]));
       console.log("keys in array : "+keys);
       console.log("keys in array unique: "+Array.from(new Set(keys)));
       keys = Array.from(new Set(keys));
        this._selectedrecords = value;
        for(i=0; i<keys.length; i++) {
            key = keys[i];
            record1 = this._selectedrecords[0];
            record2 = this._selectedrecords[1];
            tableRecords.push({"key" : key,
                "record1Field" : record1[key] === undefined ? "" : record1[key],
                "record2Field" : record2[key]  === undefined ? "" : record2[key],
                "isRecord1FieldSelected" : true,
                "isRecord2FieldSelected" : false,
                
            });
        }
        this.comparisondata = tableRecords;        
    }

    handleMasterChange(event) {
        var i, selectedRecord = event.target.value;
        this.masterRecord = selectedRecord;
        for(i=0; i<this.comparisondata.length; i++) {
            if(selectedRecord === "record1") {
                this.comparisondata[i].isRecord1FieldSelected = true;
                this.comparisondata[i].isRecord2FieldSelected = false;
            }
            if(selectedRecord === "record2") {
                this.comparisondata[i].isRecord1FieldSelected = false;
                this.comparisondata[i].isRecord2FieldSelected = true;
            }
        }
    }

    handleMerge() {
        var i, deleteRecord, masterRecordId;
        var radios = this.template.querySelectorAll('input[type=radio]:checked');
        var sobject = {};
        for (i = 0; i < radios.length; i++) {
            console.log("radios[i].value : "+radios[i].value);
            if(radios[i].value !== undefined) {
                sobject[radios[i].name] = radios[i].value;
            }
            console.log("JSON Sobject : "+JSON.stringify(sobject));
        }
        deleteRecord =  this.masterRecord === "record1" ? this._selectedrecords[1].Id : this._selectedrecords[0].Id;
        masterRecordId =  this.masterRecord === "record1" ? this._selectedrecords[0].Id : this._selectedrecords[1].Id;
        mergeRecords({obj : sobject, deleteRecordId : deleteRecord})
        .then(() => {
            const evt = new ShowToastEvent({
                title: "success",
                message: "Record merged successfully",
                variant: "success",
            });
            this.dispatchEvent(evt);
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: masterRecordId,
                    actionName: 'view'
                }
            });
        })
        .error(error => {
            const evt = new ShowToastEvent({
                title: "Error",
                message: error,
                variant: "error",
            });
            this.dispatchEvent(evt);
        })
    }

    handlePrevious() {
        this.dispatchEvent(
            new CustomEvent('prevoous')
        );
    }
}