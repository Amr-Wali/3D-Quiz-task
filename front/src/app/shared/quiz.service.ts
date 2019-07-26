import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient) { }

  addquiz(quiz) {
    return this.http.post(environment.apiBaseUrl + '/quiz', quiz);
  }

  getQuizzes() {
    return this.http.get(environment.apiBaseUrl + '/quiz');
  }

  getQuiz(id) {
    return this.http.get(environment.apiBaseUrl + '/quiz/' + id);
  }

  publish(id) {
    return this.http.put(environment.apiBaseUrl + '/quiz/publish/' + id, null);
  }

  delete(id) {
    return this.http.delete(environment.apiBaseUrl + '/quiz/' + id);
  }

}
