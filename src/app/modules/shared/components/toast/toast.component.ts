import { Component, Inject, Input, OnInit } from '@angular/core';
import { OVERLAY_DATA } from 'src/app/services/overlay.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: []
})
export class ToastComponent implements OnInit {

  @Input()
  public toastType: 'success' | 'error' = 'success';

  constructor(
    @Inject(OVERLAY_DATA) public data: any,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.toastType = this.data.toastType;
  }

  close() {
    this.toastService.close();
  }
}
