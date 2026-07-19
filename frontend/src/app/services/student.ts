import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Student } from '../models/student';
import { environment } from '../../environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/students`;

  private studentsChangedSource = new Subject<void>();
  studentsChanged$ = this.studentsChangedSource.asObservable();

  notifyStudentsChanged() {
    this.studentsChangedSource.next();
  }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  addStudent(student: Student): Observable<any> {
    return this.http.post<any>(this.apiUrl, student);
  }

  updateStudent(id: string, student: Student): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, student);
  }

  deleteStudent(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
