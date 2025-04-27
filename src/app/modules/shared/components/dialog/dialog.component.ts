import { Component, OnInit, Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { faClose } from '@fortawesome/free-solid-svg-icons';

interface MtDialogData {
  data: any;
}

export interface MtDialogResultData {
  isRefresh: boolean;
  spaceName?: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: []
})
export class DialogComponent implements OnInit {
  faClose = faClose;

  _data!: MtDialogData;
  spaceName: any;

  isSaveButtonDisabled = true;

  constructor(
    private dialogRef: DialogRef<MtDialogResultData>,
    @Inject(DIALOG_DATA) private data: MtDialogData
  ) {
    this._data = data;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close({
      isRefresh: false
    });
  }

  
  createSpace(){
    this.dialogRef.close({
      isRefresh: true,
      spaceName: this.spaceName
    });
  }
}
