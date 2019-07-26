import { Question } from './question.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  constructor(private http: HttpClient) { }

  addQuestion(question: Question) {
    return this.http.post(environment.apiBaseUrl + '/question', question);
  }

  editQuestion(id, question) {
    return this.http.put(environment.apiBaseUrl + '/question/' + id, question);
  }

  deleteQuestion(id) {
    return this.http.delete(environment.apiBaseUrl + '/question/' + id);
  }

}
