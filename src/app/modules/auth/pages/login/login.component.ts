import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit {

  email: string = "";
  password: string = "";

  isBtnDisabled: boolean = false;

  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.loaderService.close();
  }

  onSubmit($evt: any){
    this.loaderService.show();
    this.isBtnDisabled = true;
    this.authService.login($evt.value.email, $evt.value.password).subscribe({
      next: (resp: any) => {
        this.loaderService.close();
        this.router.navigate(['/app']);
      },
      error: (err: any) => {
        this.loaderService.close();
        this.isBtnDisabled = false;
        console.error(err)
      }
    })
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
