import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeService } from '../../services/employee-service';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent implements OnInit {

  employeeId = 0;
  loading = false;

  form: FormGroup | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      id: 0,
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      salary: [0, [Validators.required, Validators.min(1)]]
    })
  }

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.employeeId > 0) {
      this.loadEmployee();
    }
  }

  loadEmployee(): void {
    this.loading = true;

    this.employeeService.getEmployee(this.employeeId).subscribe({
      next: employee => {
        this.form?.patchValue(employee);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  save(): void {
    if (this.form?.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const employee = this.form?.getRawValue() as Employee;

    if (this.employeeId === 0) {
      this.employeeService.addEmployee(employee).subscribe({
        next: () => {
          this.snackBar.open('Employee added successfully.', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/employees']);
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.employeeService.updateEmployee(employee).subscribe({
        next: () => {
          this.snackBar.open('Employee updated successfully.', 'Close', {
            duration: 3000
          });
          this.router.navigate(['/employees']);
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }

}