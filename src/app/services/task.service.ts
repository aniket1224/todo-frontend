import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';

export interface Task {
  _id: string;
  name: string;
  createdAt: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = 'https://todo-backend-xnyx.onrender.com/tasks';
  private readonly refresh$ = new Subject<void>();

  constructor(
    private readonly http: HttpClient,
    private authService: AuthService
  ) {}

  get refreshNeeded$() {
    return this.refresh$;
  }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  addTask(name: string): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, { name }, {
      headers: this.getHeaders()
    });
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  triggerRefresh() {
    this.refresh$.next();
  }
}

