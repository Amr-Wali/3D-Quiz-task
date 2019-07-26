import { QuizService } from './../shared/quiz.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './teacher-profile.component.html',
  styleUrls: ['./teacher-profile.component.css']
})
export class TeacherProfileComponent implements OnInit {
  quizTitle;
  published = [];
  unpublished = [];
  Error;
  constructor(private quizService: QuizService, private router: Router) { }

  handleError(err) {
    {
      if (err.status === 422) {
        console.log(err)
        this.Error = err.error.join('<br/>');
      }
      else if (err.status === 0) {
        this.Error = "Sorry, there is a problem with the server try again later"
      }
      else {
        console.log(err);
        this.Error = err.error.message || 'Sorry, Something went wrong. Try again later';
        console.log(this.Error);
      }
    }
  }

  ngOnInit() {
    this.quizService.getQuizzes().subscribe(
      (res: any) => {
        console.log(res);
        this.published = res.published;
        this.unpublished = res.unpublished;
      },
      err => {
        this.handleError(err);
      }
    )

  }

  createQuiz(form: NgForm) {
    this.quizService.addquiz(form.value).subscribe(
      res => {
        this.unpublished.push(res);
        form.resetForm();
      },
      err => {
        this.handleError(err);
      }
    )
  }

  delete(id) {
    this.quizService.delete(id).subscribe(
      res => {
        this.ngOnInit();
      },
      err => {
        this.handleError(err);
      }
    )
  }

  view(id) {
    this.router.navigateByUrl('/quiz/' + id);
  }

}
