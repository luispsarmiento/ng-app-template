import { Injectable } from '@angular/core';
import { OverlayService } from './overlay.service';
import { TopLoaderComponent } from '../modules/shared/components/top-loader/top-loader.component';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor(private overlayService: OverlayService) { }

  show(){
    this.overlayService.open(TopLoaderComponent, {}, 'top');
  }

  close(){
    this.overlayService.close(true);
  }
}
