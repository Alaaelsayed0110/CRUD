import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeesService } from 'src/app/services/employees.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {
  constructor(private employee:EmployeesService){}

  @Output() updated = new EventEmitter<void>();
  @Output() closePopup = new EventEmitter<void>();

  AddForm = new FormGroup({
    empName : new FormControl('' , [Validators.required]),
    empEmail : new FormControl('' , [Validators.required , Validators.email]),
    empAddress :  new FormControl('' , [Validators.required]),
    empPhone :  new FormControl('' , [Validators.required , Validators.pattern(/^01[012][0-9]{8}$/)])
  });

  AddEmployee(data:any){
    if(data.valid){
      this.employee.AddEmployee(data.value).subscribe({
        next:(res)=>{
          console.log(res);
          this.updated.emit();
        },
        error:(err)=>{
          console.log(err);
        }
      })
    }
  }

  cancel() {
    this.closePopup.emit();
  }
}
