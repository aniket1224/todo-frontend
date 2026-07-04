import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-task-form',
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatIconModule
    ],
    templateUrl: './task-form.component.html',
    styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  taskName = '';
  isLoading = false;

  constructor(private readonly taskService: TaskService, private readonly router: Router) {}

  addTask() {
    if (!this.taskName.trim()) return;
    this.isLoading = true;

    this.taskService.addTask(this.taskName).subscribe({
      next: () => {
        this.isLoading = false;
        this.taskName = '';
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        console.error('Add task failed', err);
        this.isLoading = false;
      }
    });
  }
}
