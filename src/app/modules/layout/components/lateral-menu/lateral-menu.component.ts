import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { 
  faSun, 
  faCalendar,
  faCircleExclamation,
  faSquareCheck,
  faBars,
  faAngleUp,
  faAngleDown,
  faSignOut,
  faPlus,
  faFolder,
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-lateral-menu',
  templateUrl: './lateral-menu.component.html',
  styleUrls: ['./lateral-menu.component.css']
})
export class LateralMenuComponent implements OnInit {

  faSun = faSun;
  faCalendar = faCalendar;
  faCircleExclamation = faCircleExclamation;
  faSquareCheck = faSquareCheck;
  faBars = faBars;
  faAngleUp = faAngleUp;
  faAngleDown = faAngleDown;
  faSignOut = faSignOut;
  faPlus = faPlus;
  faFolder = faFolder;

  isOpen = false;
  isOpenUOverlay = false;
  constructor(
    private router: Router,
    private toast: ToastService,
    private loader: LoaderService,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  test(){
    //this.toast.error('Hi!');
    //this.loader.show();
  }

  logout(){
    this.authService.logout();
  }

  lateralNavigateTo(route: string){
    this.navigateTo(route);
    this.isOpen = !this.isOpen;
  }

  
}
