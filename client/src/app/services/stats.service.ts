import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DailyRegistration {
  readonly date: string;
  readonly count: number;
}

export interface GenderStat {
  readonly gender: 'M' | 'F';
  readonly count: number;
}

@Injectable({ providedIn: 'root' })
export class StatsService {
  private readonly baseUrl = 'http://localhost:8080/api/stats';

  constructor(private readonly http: HttpClient) {}

  getDailyRegistrations(): Observable<DailyRegistration[]> {
    return this.http.get<DailyRegistration[]>(`${this.baseUrl}/registrations`);
  }

  getGenderStats(): Observable<GenderStat[]> {
    return this.http.get<GenderStat[]>(`${this.baseUrl}/gender`);
  }
}
