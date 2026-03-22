import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpMock: HttpTestingController;
  let routerMock: any;
  let navigateCalledWith: any[] | null;

  beforeEach(async () => {
    navigateCalledWith = null;
    routerMock = { 
        navigate: (args: any[]) => { navigateCalledWith = args; } 
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
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

  describe('login()', () => {
    it('should navigate to dashboard on successful login', async () => {
      component.username.set('admin');
      component.password.set('admintest');
      
      const loginPromise = component.login();
      
      const req = httpMock.expectOne('http://localhost:8080/api/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username: 'admin', password: 'admintest' });
      
      req.flush({ message: 'Login successful' });
      
      await loginPromise;
      
      expect(navigateCalledWith).toEqual(['/dashboard']);
    });

    it('should handle login error', async () => {
      component.username.set('wrong');
      component.password.set('wrong');
      
      let consoleErrorCalled = false;
      const originalConsoleError = console.error;
      console.error = () => { consoleErrorCalled = true; };
      
      const loginPromise = component.login();
      
      const req = httpMock.expectOne('http://localhost:8080/api/login');
      req.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
      
      await loginPromise;
      
      expect(consoleErrorCalled).toBe(true);
      expect(navigateCalledWith).toBeNull();
      
      console.error = originalConsoleError;
    });
  });
});
