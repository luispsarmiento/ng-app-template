import { Component, OnInit } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, map, switchMap } from 'rxjs';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {

  constructor(
    private updates: SwUpdate,
    private toast: ToastService) { }

  ngOnInit() {
    this.updates.versionUpdates.pipe(
      filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
      switchMap(() => this.toast.success('A new version is available!', 'Update now').afterDismissed()),
      filter((result: boolean) => result),
      map(() => this.updates.activateUpdate().then(() => location.reload()))
    ).subscribe();
  }

}
