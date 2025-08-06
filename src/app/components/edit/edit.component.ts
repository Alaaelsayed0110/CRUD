import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeesService } from 'src/app/services/employees.service';
import { Employee } from 'src/app/interfaces/employee';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnChanges {
  @Input() employeeData: Employee | null = null;
  @Output() updated = new EventEmitter<void>();
  @Output() closePopup = new EventEmitter<void>();

  loading = false;

  employeeForm = new FormGroup({
    empId: new FormControl(),
    empName: new FormControl('', [Validators.required]),
    empEmail: new FormControl('', [Validators.required, Validators.email]),
    empAddress: new FormControl('', [Validators.required]),
    empPhone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^01[012][0-9]{8}$/)
    ])
  });

  constructor(private employeeService: EmployeesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employeeData'] && this.employeeData) {
      this.employeeForm.patchValue(this.employeeData);
    }
  }
updateEmployee() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.employeeService.updateEmployee(this.employeeForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.updated.emit();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  cancel() {
    this.closePopup.emit();
  }
}
