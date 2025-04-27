import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DialogComponent, MtDialogResultData } from 'src/app/modules/shared/components/dialog/dialog.component';
import {
  faPlus,
  faFolder,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { SpaceService } from 'src/app/services/space.service';
import { Space } from 'src/app/models/space.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-space-menu',
  templateUrl: './space-menu.component.html',
  styleUrls: ['./space-menu.component.css']
})
export class SpaceMenuComponent implements OnInit {

  @Output()
  onNavigateToClick = new EventEmitter();

  faPlus = faPlus;
  faFolder = faFolder;
  faSpinner = faSpinner;

  spaces$!: Observable<Space[]>;
  isLoading$ = this.service.loading$;
  error$ = this.service.error$;

  constructor(
    private dialog: Dialog,
    private service: SpaceService,
    private router: Router
  ) { 
    this.spaces$ = this.service.spaces$;
  }

  ngOnInit() {
    this.service.loadSpaces();
  }

  createNewSpace(){
    const _dialogRef = this.dialog.open(DialogComponent, {
      minWidth: '300px',
      maxWidth : '50%',
      data: {
      }
    });

    _dialogRef.closed.subscribe((result) => {
      const _result = result as MtDialogResultData;
      if (_result.isRefresh && _result.spaceName) {
        this.service.addSpace({
          name: _result.spaceName
        }).subscribe();
      }
    });
  }

  loadSpaces = () => this.service.loadSpaces();

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.onNavigateToClick.emit();
  }
}
