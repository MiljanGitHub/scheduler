import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { Court } from '../model/court';
import { CourtInfo } from '../model/court-info';
import { ReservationOutcome } from '../model/reservation-outcome';
import { ReservationRequest } from '../model/reservation-request';
import { ReservationByCourtAndUser } from '../model/reservationByCourtAndUser';

@Injectable({
  providedIn: 'root'
})
export class CourtService {

  private readonly API = 'http://localhost:8080/api/scheduler-service';

  constructor(private http: HttpClient) { }

  public fetchCourtInfo() : Observable<Court[]> {
    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get(this.API + '/courts-info', { headers })
    .pipe(map((res: any) => {
      return res;
    }), catchError(error => {
      if (error.status === 400) {
        return null;
      }
      else {
        return null; //Observable.throw(error.json().error || 'Server error');
      }
    }));
  };

  public fetchCourtData(courtId : string) : Observable<Court> {

    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get(this.API + '/court-reservation-info/'+courtId, { headers })
    .pipe(map((res: any) => {
      return res;
    }), catchError(error => {
      if (error.status === 400) {
        return null;
      }
      else {
        return null;
      }
    }));
  };

  public fetchCourtsList() : Observable<CourtInfo[]> {

    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.get(this.API + '/courts-info', { headers })
    .pipe(map((res: any) => {
      return res;
    }), catchError(error => {
      if (error.status === 400) {
        return null;
      }
      else {
        return null;
      }
    }));
  };

  public makeReservations(request : ReservationRequest) : Observable<ReservationOutcome> {

    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(this.API + '/court-reservation/', request, { headers })
    .pipe(map((res: any) => {
      return res;
    }), catchError(error => {
      if (error.status === 400) {
        return null;
      }
      else {
        return null;
      }
    }));
  };

  public reservationByCourtAndUser(userId: number, courtId: number) : Observable<ReservationByCourtAndUser[]> {

    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(this.API + '/reservations-by-user-and-court', {userId : userId, courtId : courtId}, { headers })
    .pipe(map((res: any) => {
      return res;
    }), catchError(error => {
      if (error.status === 400) {
        return null;
      }
      else {
        return null;
      }
    }));
  }

  public deleteReservation(reservationId: number) : Observable<string> {

    var headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.delete(this.API + '/reservation/'+reservationId , { headers })
    .pipe(map((res: any) => {
      return res;
    }), catchError(error => {
      if (error.status === 400) {
        return null;
      }
      else {
        return null;
      }
    }));
  }
}
