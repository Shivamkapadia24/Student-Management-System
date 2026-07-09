import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentListComponent } from './components/student-list/student-list';
import { StudentFormComponent } from './components/student-form/student-form';
import { AuthComponent } from './components/auth/auth';
import { AuthService } from './services/auth';
import { Student } from './models/student';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, StudentFormComponent, StudentListComponent, AuthComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('frontend');
  private authService = inject(AuthService);
  
  isLoggedIn = false;
  collegeName = '';
  selectedStudent: Student | null = null;
  showForm = false;

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.collegeName = this.authService.getCollegeName() || '';
    });
  }

  logout() {
    this.authService.logout();
    this.showForm = false;
  }

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
