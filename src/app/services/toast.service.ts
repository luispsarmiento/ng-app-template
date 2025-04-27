import { EventEmitter, Injectable } from '@angular/core';
import { OverlayService } from './overlay.service';
import { ToastComponent } from '../modules/shared/components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  

  public closeEvt: any = new EventEmitter<boolean>();

  constructor(private overlayService: OverlayService) { }

  success(message: string, closeMessage?: string) {
    this.overlayService.open(ToastComponent, { message: message, closeMessage: closeMessage, toastType: 'success' });
    return this;
  }

  error(message: string) {
    this.overlayService.open(ToastComponent, { message: message, toastType: 'error' });
    return this;
  }

  close(){
    this.overlayService.close(true);
  }

  afterDismissed() {
    return this.overlayService.afterDismissed()
  }
}
