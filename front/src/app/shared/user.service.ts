import { User } from './user.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User = {
    fullName: '',
    email: '',
    password: ''
  }
  noAuthHeader = { headers: new HttpHeaders({ "noauth": "true" }) };
  constructor(private http: HttpClient) { }

  addUser(user: User) {
    return this.http.post(environment.apiBaseUrl + '/teacher/signup', user, this.noAuthHeader);
  }

  login(user) {
    return this.http.post(environment.apiBaseUrl + '/teacher/signin', user, this.noAuthHeader);
  }

  getUserProfile() {
    return this.http.get(environment.apiBaseUrl + '/teacher');
  }

  // ===============================
  // helpers
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  getUserPayload() {
    let token = this.getToken();
    if (token) {
      let userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }

  isLoggedIn() {
    let userPayload = this.getUserPayload();
    if (userPayload)
      return userPayload.exp > Date.now() / 1000;
    else
      return false;
  }

}
