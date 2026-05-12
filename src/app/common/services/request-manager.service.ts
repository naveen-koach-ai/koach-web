import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment.test';

@Injectable({
  providedIn: 'root'
})
export class RequestManagerService {

  url: string = '';
  isTesting: boolean = environment.env === 'LIVE' ? false : true;

  constructor(
    private http: HttpClient,
  ) { }


  switchEnv(endpoint: string) {
    const version2Endpoints = ['auth/coachee/login'];

    if (version2Endpoints.includes(endpoint)) {
      this.url = environment.end_point_v2;
    } else {
      this.url = environment.end_point;
    }
  }

  get(endpoint: string, param?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = { params: new HttpParams() };
    };

    if (param) {
      reqOpts.param = new HttpParams();
      for (let k in param) {
        reqOpts.param = reqOpts.param.set(k, param[k]);
      }
    }

    return this.http.get(`${this.url}${endpoint}`, reqOpts).pipe(map(response => {
      const res: any = response;
      return res;
    }));
  }

  post(endpoint: string, data: any, reqOpts?: any) {
    try {
      if (typeof reqOpts == 'undefined') {
        reqOpts = {};
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        headers.append('timeout', '3000');
        reqOpts.headers = headers;
      }

      return this.http.post(`${this.url}${endpoint}`, data, reqOpts).pipe(map(response => {
        const res: any = response;
        return res;
      }));
    } catch (err) {
      console.log('POST http error: ', err);
      throw new Error(`POST http error: ${err}`);
    }
  }

  put(endpoint: string, data?: any, reqOpts?: any) {
    return this.http.put(`${this.url}${endpoint}`, data, reqOpts).pipe(map(response => {
      const res: any = response;
      return res;
    }));
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(`${this.url}${endpoint}`, reqOpts).pipe(map(response => {
      const res: any = response;
      return res;
    }));
  }

  patch(endpoint: string, data?: any, reqOpts?: any) {
    return this.http.patch(`${this.url}${endpoint}`, data, reqOpts).pipe(map(response => {
      const res: any = response;
      return res;
    }));
  }
}
