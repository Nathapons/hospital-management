import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PhrComponent } from './phr.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

describe('PhrComponent', () => {
  let component: PhrComponent;
  let fixture: ComponentFixture<PhrComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhrComponent, FormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PhrComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('checkRegistration()', () => {
    it('should show warning if regHealthCareNumber is empty', () => {
      let swalFiredWithWarning = false;
      const originalFire = Swal.fire;
      (Swal as any).fire = (title: string, msg: string, icon: string) => { 
        if (icon === 'warning') swalFiredWithWarning = true; 
        return Promise.resolve(null as any); 
      };

      component.regHealthCareNumber = '';
      component.checkRegistration();
      
      expect(swalFiredWithWarning).toBe(true);

      Swal.fire = originalFire;
    });

    it('should fill profile data on successful response', () => {
      let swalFiredWithSuccess = false;
      const originalFire = Swal.fire;
      (Swal as any).fire = (title: string, msg: string, icon: string) => { 
        if (icon === 'success') swalFiredWithSuccess = true; 
        return Promise.resolve(null as any); 
      };

      component.regHealthCareNumber = '12345';
      
      component.checkRegistration();

      const mockResponse = {
        first_name_en: 'John',
        last_name_en: 'Doe',
        date_of_birth: '1990-01-01',
        gender: 'M',
        patient_hn: 'HN123'
      };

      const req = httpMock.expectOne('http://localhost:8080/api/patient/12345');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      expect(swalFiredWithSuccess).toBe(true);
      expect(component.firstName).toBe('John');
      expect(component.lastName).toBe('Doe');
      expect(component.sex).toBe('Male');
      expect(component.healthCareNumberHN).toBe('HN123');
      expect(component.dateOfBirth).toBe('1990-01-01');

      Swal.fire = originalFire;
    });

    it('should show error on failure response', () => {
      let swalFiredWithError = false;
      const originalFire = Swal.fire;
      (Swal as any).fire = (title: string, msg: string, icon: string) => { 
        if (icon === 'error') swalFiredWithError = true; 
        return Promise.resolve(null as any); 
      };

      component.regHealthCareNumber = '12345';
      
      component.checkRegistration();

      const req = httpMock.expectOne('http://localhost:8080/api/patient/12345');
      req.flush(null, { status: 404, statusText: 'Not Found' });

      expect(swalFiredWithError).toBe(true);
      Swal.fire = originalFire;
    });
  });
});
