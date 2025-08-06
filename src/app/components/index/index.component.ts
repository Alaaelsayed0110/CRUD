import { Employee } from './../../interfaces/employee';
import { Component, OnInit } from '@angular/core';
import { EmployeesService } from 'src/app/services/employees.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  EmployeeNumber: number = 10;
  currentPage: number = 1;
  employees: Employee[] = [];
  isLoading: boolean = false;

  selectedEmployee: Employee | null = null;
  showEdit: boolean = false;
  showAdd: boolean = false;

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  selectedEmpIds: number[] = [];

  constructor(private employeeService: EmployeesService) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees() {
    this.isLoading = true;
    this.employeeService.GetAllEmplyees().subscribe({
      next: (res) => {
        this.employees = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        alert('Error loading employees');
      }
    });
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.employees.sort((a: any, b: any) => {
      let valueA = a[column]?.toLowerCase() || '';
      let valueB = b[column]?.toLowerCase() || '';

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getPagination() {
    const start = (this.currentPage - 1) * this.EmployeeNumber;
    const end = start + this.EmployeeNumber;
    return this.employees.slice(start, end);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage = page;
    }
  }

  get totalPages(): number[] {
    return Array(Math.ceil(this.employees.length / this.EmployeeNumber))
      .fill(0)
      .map((_, i) => i + 1);
  }

  openEdit(emp: Employee) {
    this.selectedEmployee = emp;
    this.showEdit = true;
  }

  closeEditPopup() {
    this.showEdit = false;
    this.selectedEmployee = null;
  }

  onEmployeeUpdated() {
    this.getEmployees();
    this.closeEditPopup();
  }

  openAddPopup() {
    this.showAdd = true;
  }

  closeAddPopup() {
    this.showAdd = false;
  }

  onEmployeeAdded() {
    this.getEmployees();
    this.closeAddPopup();
  }

  deleteEmp(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: (res) => {
          alert('Employee deleted successfully');
          this.getEmployees();
        },
        error: (err) => {
          console.error(err);
          alert('Failed to delete employee');
        }
      });
    }
  }

  isSelected(empId: number): boolean {
    return this.selectedEmpIds.includes(empId);
  }

  toggleSelection(empId: number) {
    if (this.isSelected(empId)) {
      this.selectedEmpIds = this.selectedEmpIds.filter(id => id !== empId);
    } else {
      this.selectedEmpIds.push(empId);
    }
  }

  toggle(event: any) {
    const checked = event.target.checked;
    const pageEmployees = this.getPagination();
    if (checked) {
      const newIds = pageEmployees.map(emp => emp.empId);
      this.selectedEmpIds = Array.from(new Set([...this.selectedEmpIds, ...newIds]));
    } else {
      const idsToRemove = pageEmployees.map(emp => emp.empId);
      this.selectedEmpIds = this.selectedEmpIds.filter(id => !idsToRemove.includes(id));
    }
  }

  isAllSelectedOnPage(): boolean {
    const pageEmployees = this.getPagination();
    return pageEmployees.every(emp => this.selectedEmpIds.includes(emp.empId));
  }
}
