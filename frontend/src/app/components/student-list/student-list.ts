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
  
  currentPage = 1;
  pageSize = 5;

  private _searchQuery = '';
  get searchQuery() { return this._searchQuery; }
  set searchQuery(value: string) {
    this._searchQuery = value;
    this.currentPage = 1;
  }

  private _selectedCourse = 'All';
  get selectedCourse() { return this._selectedCourse; }
  set selectedCourse(value: string) {
    this._selectedCourse = value;
    this.currentPage = 1;
  }

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

  get courseDistribution(): { course: string; count: number; percentage: number }[] {
    const total = this.students.length;
    if (total === 0) return [];

    const counts: { [key: string]: number } = {};
    this.students.forEach(s => {
      if (s.course) {
        counts[s.course] = (counts[s.course] || 0) + 1;
      }
    });

    return Object.keys(counts).map(course => ({
      course,
      count: counts[course],
      percentage: Math.round((counts[course] / total) * 100)
    })).sort((a, b) => b.count - a.count);
  }

  get totalCoursesCount(): number {
    const courses = this.students.map(s => s.course).filter(Boolean);
    return new Set(courses).size;
  }

  get totalDepartmentsCount(): number {
    const departments = new Set<string>();
    this.students.forEach(s => {
      if (s.course) {
        const c = s.course.toUpperCase().trim();
        if (c.includes('CS') || c.includes('COMP') || c.includes('IT') || c.includes('AI') || c.includes('SOFTWARE')) {
          departments.add('Computer Engineering');
        } else if (c.includes('ENTC') || c.includes('ELECT') || c.includes('ECE') || c.includes('TELE')) {
          departments.add('Electronics Engineering');
        } else if (c.includes('MECH')) {
          departments.add('Mechanical Engineering');
        } else if (c.includes('CIVIL')) {
          departments.add('Civil Engineering');
        } else {
          departments.add(s.course);
        }
      }
    });
    return departments.size;
  }

  getCourseColorClass(course: string): string {
    const c = course.toUpperCase().trim();
    if (c.includes('CS') || c.includes('COMP')) return 'success';
    if (c.includes('IT') || c.includes('INFO')) return 'primary';
    if (c.includes('AI') || c.includes('ML')) return 'info';
    if (c.includes('ENTC')) return 'warning';
    return 'secondary';
  }

  get mostPopularCourse(): string {
    if (this.students.length === 0) return 'None';
    const dist = this.courseDistribution;
    if (dist.length === 0) return 'None';
    return dist[0].course;
  }

  get averageStudentsPerCourse(): number {
    const totalStudents = this.students.length;
    if (totalStudents === 0) return 0;
    const totalCourses = this.totalCoursesCount;
    if (totalCourses === 0) return 0;
    return Math.round(totalStudents / totalCourses);
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

  get totalPages(): number {
    return Math.ceil(this.filteredStudents.length / this.pageSize);
  }

  get paginatedStudents(): Student[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredStudents.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
