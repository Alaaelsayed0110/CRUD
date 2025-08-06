import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../interfaces/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  constructor(private _Http: HttpClient) {}

  AddEmployee(user: Employee): Observable<any> {
    return this._Http.post("http://task.soft-zone.net/api/Employees/addEmployee", user);
  }

  GetAllEmplyees(): Observable<any> {
    return this._Http.get("http://task.soft-zone.net/api/Employees/getAllEmployees");
  }

  getEmployeeById(id: number): Observable<any> {
    return this._Http.get(`http://task.soft-zone.net/api/Employees/getEmpByID/${id}`);
  }

  updateEmployee(employee: any): Observable<any> {
    return  this._Http.post("http://task.soft-zone.net/api/Employees/editEmployee", employee)
  }
deleteEmployee(id: number): Observable<any> {
  return this._Http.get(`http://task.soft-zone.net/api/Employees/deleteEmpByID/${id}`);
}

}
