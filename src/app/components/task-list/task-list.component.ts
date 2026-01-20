import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, Task } from '../../services/task.service';
import { Subscription } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule,MatCardModule,MatListModule,MatIconModule,MatButtonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  private subscription!: Subscription;

  constructor(private readonly taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
    this.subscription = this.taskService.refreshNeeded$
    .subscribe(() => {
      this.loadTasks();
    });
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
      console.log('Tasks loaded:', this.tasks);
    });
  }

  deleteTask(id: string) {
    console.log(`Deleting task with id: ${id}`);
    this.taskService.deleteTask(id).subscribe(() => {
      this.loadTasks();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
