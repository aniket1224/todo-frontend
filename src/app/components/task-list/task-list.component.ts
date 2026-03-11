import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, Task } from '../../services/task.service';
import { Subscription } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';


@Component({
  selector: 'app-task-list',
  imports: [CommonModule, MatCardModule, MatListModule, MatIconModule, MatButtonModule, MatCheckboxModule, FormsModule, MatFormField],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  private subscription!: Subscription;
  editTaskId: string | null = null;
  editedTaskName = '';

  constructor(private readonly taskService: TaskService) { }

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

  startEdit(task: any) {
    this.editTaskId = task._id;
    this.editedTaskName = task.name;
  }

  cancelEdit() {
    this.editTaskId = null;
    this.editedTaskName = '';
  }

updateTask(id: string) {

  const task = this.tasks.find(t => t._id === id);

  const updatedTask = {
    name: this.editedTaskName,
    completed: task?.completed ?? false
  };

  this.taskService.updateTask(id, updatedTask)
    .subscribe(() => {

      const index = this.tasks.findIndex(t => t._id === id);

      if (index !== -1) {
        this.tasks[index].name = updatedTask.name;
        this.tasks = [...this.tasks];
      }

      this.cancelEdit();

    });

}

toggleComplete(task: Task) {

  const updatedTask = {
    name: task.name,
    completed: !task.completed
  };

  this.taskService.updateTask(task._id, updatedTask)
    .subscribe(() => {

      const index = this.tasks.findIndex(t => t._id === task._id);

      if (index !== -1) {
        this.tasks[index].completed = updatedTask.completed;
        this.tasks = [...this.tasks];
      }

    });

}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
