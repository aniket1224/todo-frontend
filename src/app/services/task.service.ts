import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment.dev';

export interface Task {
  _id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = `${environment.apiUrl}/tasks`;
  private readonly refresh$ = new Subject<void>();

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
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

addTask(name: string): Observable<{ message: string; task: Task }> {
  return this.http.post<{ message: string; task: Task }>(
    this.apiUrl,
    { name },
    {
      headers: this.getHeaders()
    }
  );
}

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // UPDATE task
  updateTask(id: string, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task, {
      headers: this.getHeaders()
    });
  }

  triggerRefresh() {
    this.refresh$.next();
  }
}

