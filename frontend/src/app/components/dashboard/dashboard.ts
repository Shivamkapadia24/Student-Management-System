import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentFormComponent } from '../student-form/student-form';
import { StudentListComponent } from '../student-list/student-list';
import { Student } from '../../models/student';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StudentFormComponent, StudentListComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {
  selectedStudent: Student | null = null;
  showForm = false;

  openAddForm() {
    this.selectedStudent = null;
    this.showForm = true;
  }

  onEditStudent(student: Student) {
    this.selectedStudent = student;
    this.showForm = true;
  }

  onCancelEdit() {
    this.showForm = false;
    this.selectedStudent = null;
  }
}
