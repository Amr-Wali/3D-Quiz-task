import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  user = {
    email: '',
    password: '',
  };
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  serverErrorMessages: string;

  onSubmit(form: NgForm) {
    this.userService.login(form.value).subscribe(
      res => {
        console.log("hi")
        this.userService.setToken(res['token']);
        this.router.navigateByUrl('/profile');
      },
      err => {
        console.log("hierr")
        this.serverErrorMessages = err.error.message;
      }
    );
  }

  ngOnInit() {
    if (this.userService.isLoggedIn())
      this.router.navigateByUrl('/profile');
  }
}
