import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient) { }

  getAllUsers(): Observable<any[]> {
    return this.httpClient.get<any[]>('https://getallusers-unjlibpzpq-uc.a.run.app')
  }
}
