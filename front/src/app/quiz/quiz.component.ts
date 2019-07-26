import { QuestionService } from './../shared/question.service';
import { Question } from './../shared/question.model';
import { Component, OnInit } from '@angular/core';
import { QuizService } from '../shared/quiz.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  questions: Question[] = [];
  quiz;
  question: Question;
  Error;
  id;

  constructor(private quizService: QuizService, private questionService: QuestionService, private activeRoute: ActivatedRoute, private router: Router) { }

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

  publish() {
    if (confirm("Once you publish this quiz, you can't edit it.\nAre you sure you want to publish?")) {
      this.quizService.publish(this.id).subscribe(
        res => {
          this.router.navigateByUrl('/profile');
        },
        err => {
          this.handleError(err);
        }
      )
    }

  }

  createQuestion(form: NgForm) {
    console.log(form.value);
    form.value.quiz = this.id;
    this.questionService.addQuestion(<Question>form.value).subscribe(
      res => {
        this.questions.push(<Question>res);
        form.resetForm();
      },
      err => {
        this.handleError(err);
      }
    )
  }

  delete(id) {
    this.questionService.deleteQuestion(id).subscribe(
      res => {
        this.ngOnInit();
      },
      err => {
        this.handleError(err);
      }
    )
  }

  ngOnInit() {
    this.id = this.activeRoute.snapshot.params['id'];
    this.quizService.getQuiz(this.id).subscribe(result => {
      let myQuiz: any = result;
      this.questions = myQuiz.questions;
      this.quiz = myQuiz.quiz;
    },
      err => {
        this.handleError(err);
      })
  }

}
