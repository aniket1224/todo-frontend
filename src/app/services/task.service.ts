import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

export interface Task {
  _id: string;
  name: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = 'https://todo-backend-xnyx.onrender.com/tasks';
  private readonly refresh$ = new Subject<void>();

  constructor(private readonly http: HttpClient) {}

  get refreshNeeded$() {
    return this.refresh$;
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  addTask(name: string): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, { name });
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  triggerRefresh() {
    this.refresh$.next();
  }
}
