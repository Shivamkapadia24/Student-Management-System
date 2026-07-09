import { Component, OnInit, OnDestroy, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { StudentService } from '../../services/student';
import { Student } from '../../models/student';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentListComponent implements OnInit, OnDestroy {

  students: Student[] = [];
  searchQuery = '';
  selectedCourse = 'All';

  private subscription: Subscription = new Subscription();

  @Output() editStudent = new EventEmitter<Student>();
  @Output() addStudentClicked = new EventEmitter<void>();

  private studentService = inject(StudentService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadStudents();

    this.subscription.add(
      this.studentService.studentsChanged$.subscribe(() => {
        this.loadStudents();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadStudents() {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Failed to load students:", err);
      }
    });
  }

  get uniqueCourses(): string[] {
    const courses = this.students.map(s => s.course).filter(Boolean);
    return ['All', ...new Set(courses)];
  }

  get filteredStudents(): Student[] {
    let result = this.students;

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase().trim();
      result = result.filter(student =>
        student.name?.toLowerCase().includes(query) ||
        student.course?.toLowerCase().includes(query)
      );
    }

    if (this.selectedCourse && this.selectedCourse !== 'All') {
      result = result.filter(student => student.course === this.selectedCourse);
    }

    return result;
  }

  onEdit(student: Student) {
    this.editStudent.emit(student);
  }

  onDelete(id: string | undefined) {
    if (!id) return;
    if (confirm("Are you sure you want to delete this student?")) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.studentService.notifyStudentsChanged();
        },
        error: (err) => {
          console.error("Failed to delete student:", err);
        }
      });
    }
  }
}
