import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-phr',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './phr.component.html',
})
export class PhrComponent {
  private http = inject(HttpClient);

  // Hospital Registration Information
  regHealthCareNumber: string = '';
  healthCareNumberHN: string = '';
  regDate: string = new Date().toISOString().split('T')[0];
  regTime: string = new Date().toTimeString().split(' ')[0].substring(0, 5);

  // Profile Information
  firstName: string = 'Jane';
  lastName: string = 'Doe';
  dateOfBirth: string = '';
  sex: string = 'Select sex';
  bloodType: string = 'Select blood type';
  emergencyContact: string = '';
  healthInsurance: string = '';

  // Critical Health Data
  allergies: string = '';
  chronicDiseases: string = '';
  currentMedications: string = '';

  checkRegistration() {
    if (!this.regHealthCareNumber) {
      Swal.fire('Warning', 'Please enter Registration Health Care Number', 'warning');
      return;
    }

    this.http.get<any>(`http://localhost:8080/api/patient/${this.regHealthCareNumber}`).subscribe({
      next: (response) => {
        if (response) {
          Swal.fire('Success', 'Patient data found', 'success');
          // Fill Profile Information
          this.firstName = response.first_name_en || response.first_name_th || '';
          this.lastName = response.last_name_en || response.last_name_th || '';
          if (response.date_of_birth) {
            this.dateOfBirth = new Date(response.date_of_birth).toISOString().split('T')[0];
          }
          if (response.gender === 'M') {
            this.sex = 'Male';
          } else if (response.gender === 'F') {
            this.sex = 'Female';
          }
          this.healthCareNumberHN = response.patient_hn || '';
          
          this.bloodType = 'Select blood type';
          this.emergencyContact = '';
          this.healthInsurance = '';
          this.allergies = '';
          this.chronicDiseases = '';
          this.currentMedications = '';
        }
      },
      error: (err) => {
        Swal.fire('Error', 'Patient is not register', 'error');
      }
    });
  }
}

