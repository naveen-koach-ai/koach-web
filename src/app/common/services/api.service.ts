import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { API_ENDPOINTS, COACHEE_ROLE_ID } from '../constants/constants';
import { RequestManagerService } from './request-manager.service';
import { UserService } from './user.service';
import { AppError } from './error-handler';


@Injectable({
  providedIn: 'root',
})
export class ApiService {

  errorMessages: any;

  constructor(
    private requestManager: RequestManagerService,
    private userService: UserService,
  ) {
  }

  private handleError = (httpError: HttpErrorResponse) => {
    console.log('HTTP Error:', httpError);
    this.errorMessages = new AppError(httpError.error, httpError.status);
    console.log('Parsed Error Message:', this.errorMessages);
    return throwError(() => this.errorMessages);
  }

  login(email: string, password: string): Promise<any> {
    this.requestManager.switchEnv(API_ENDPOINTS.LOGIN);
    return firstValueFrom(
      this.requestManager.post(API_ENDPOINTS.LOGIN, { email, password, role_id: COACHEE_ROLE_ID }).pipe(catchError(this.handleError))
    );
  }

  signup(payload: {
    name: string;
    email: string;
    exp: string;
    password: string;
    institution: string;
    ref_code: string;
    daily_goal: string;
    googleUser: boolean;
  }): Promise<any> {
    this.requestManager.switchEnv(API_ENDPOINTS.SIGNUP_FQUE);
    return firstValueFrom(
      this.requestManager
        .post(API_ENDPOINTS.SIGNUP_FQUE, payload)
        .pipe(catchError(this.handleError))
    ).then((res: any) => {
      this.userService.user$.next(res.user);
      localStorage.setItem('auth_token', res.token);
      localStorage.setItem('auth_user', JSON.stringify(res.user));
      return res;
    }).catch((err: any) => {
      throw err;
    });
  }

  forgotPassword(email: string): Promise<any> {
    this.requestManager.switchEnv(API_ENDPOINTS.FORGET_PASSWORD);
    return firstValueFrom(
      this.requestManager
        .post(API_ENDPOINTS.FORGET_PASSWORD, { email })
        .pipe(catchError(this.handleError))
    );
  }

  getOnboardingDropdowns(): Promise<any> {
    this.requestManager.switchEnv(API_ENDPOINTS.GET_DROPDOWNS_ONBOARDING);
    return firstValueFrom(
      this.requestManager
        .get(API_ENDPOINTS.GET_DROPDOWNS_ONBOARDING)
        .pipe(catchError(this.handleError))
    );
  }

  validateEmail(email: string): Promise<any> {
    this.requestManager.switchEnv(API_ENDPOINTS.VALIDATE_EMAIL);
    return firstValueFrom(
      this.requestManager
        .get(`${API_ENDPOINTS.VALIDATE_EMAIL}${email}`)
        .pipe(catchError(this.handleError))
    );
  }

  verifyReferralCode(ref_code: string, email: string): Promise<any> {
    this.requestManager.switchEnv(API_ENDPOINTS.VERIFY_REFERRAL_CODE);
    return firstValueFrom(
      this.requestManager
        .post(API_ENDPOINTS.VERIFY_REFERRAL_CODE, { referred_by: 'organization', ref_code, email })
        .pipe(catchError(this.handleError))
    );
  }

  

  logout(): void {
    this.requestManager.switchEnv(API_ENDPOINTS.LOGOUT);
    firstValueFrom(
      this.requestManager.put(API_ENDPOINTS.LOGOUT, {}).pipe(catchError(this.handleError))
    ).catch(() => {});
    this.userService.logout();
  }
}
