import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { StudentService } from '../../services/student';
import { Student } from '../../models/student';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-form.html',
  styleUrl: './student-form.css'
})
export class StudentFormComponent {

  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);

  @Output() cancelEdit = new EventEmitter<void>();

  private _studentToEdit: Student | null = null;
  isEditMode = false;

  @Input() set studentToEdit(student: Student | null) {
    this._studentToEdit = student;
    if (student) {
      this.isEditMode = true;
      this.studentForm.patchValue({
        name: student.name,
        course: student.course,
        rollNumber: student.rollNumber
      });
    } else {
      this.isEditMode = false;
      this.studentForm.reset({
        name: '',
        course: '',
        rollNumber: null as any
      });
    }
  }

  get studentToEdit(): Student | null {
    return this._studentToEdit;
  }

  studentForm = this.fb.group({
    name: ['', Validators.required],
    course: ['', Validators.required],
    rollNumber: [null as any as number, [Validators.required, Validators.min(1)]]
  });

  onSubmit() {
    if (this.studentForm.invalid) {
      return;
    }

    const studentData = this.studentForm.value as any;

    if (this.isEditMode && this._studentToEdit?._id) {
      this.studentService.updateStudent(this._studentToEdit._id, studentData).subscribe({
        next: (response) => {
          console.log("Student Updated Successfully", response);
          this.studentService.notifyStudentsChanged();
          this.resetForm();
        },
        error: (err) => {
          console.error("Failed to update student:", err);
        }
      });
    } else {
      this.studentService.addStudent(studentData).subscribe({
        next: (response) => {
          console.log("Student Added Successfully", response);
          this.studentService.notifyStudentsChanged();
          this.resetForm();
        },
        error: (err) => {
          console.error("Failed to add student:", err);
        }
      });
    }
  }

  resetForm() {
    this.studentForm.reset({
      name: '',
      course: '',
      rollNumber: null as any
    });
    this.isEditMode = false;
    this._studentToEdit = null;
    this.cancelEdit.emit();
  }
}
