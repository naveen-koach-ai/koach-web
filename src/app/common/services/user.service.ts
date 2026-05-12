import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { jwtDecode } from "jwt-decode";
import { CommonService } from "./common.service";
import { AlertTypeEnum } from "../constants/constants";



@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  user: BehaviorSubject<any> = new BehaviorSubject(null);
  tokenValue: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  jwtValue: BehaviorSubject<any> = new BehaviorSubject(null);

  isFeedback360Available: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private commonService: CommonService) {}

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }

  async decodingJWTValues(token: string): Promise<any> {

    try {
      const jwt: any = jwtDecode(token);
      this.tokenValue.next(token);
      this.jwtValue.next(jwt);
      this.isFeedback360Available.next(!!jwt.isFdbackConv);
    } catch (error) {
      this.commonService.showAlert(AlertTypeEnum.Error, '', 'Failed to decode token.', this.commonService.alertButtonList);
    }
  }
}