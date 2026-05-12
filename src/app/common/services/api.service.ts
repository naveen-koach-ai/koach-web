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
      sessionStorage.setItem('token', res.token);
      sessionStorage.setItem('user', JSON.stringify(res.user));
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

  getExploreThemes(): Promise<any> {
    this.requestManager.switchEnv(API_ENDPOINTS.MISCELLAENOUS_CONV);
    return firstValueFrom(
      this.requestManager
        .get(API_ENDPOINTS.MISCELLAENOUS_CONV)
        .pipe(catchError(this.handleError))
    );
  }

  getPreAssessmentQuestions(exp: number): Promise<any> {
    this.requestManager.switchEnv(API_ENDPOINTS.PRE_ASSESSMENT);
    return firstValueFrom(
      this.requestManager
        .get(`${API_ENDPOINTS.PRE_ASSESSMENT}/${exp}`)
        .pipe(catchError(this.handleError))
    );
  }

  closePreAssessmentSession(questions: any[]): Promise<any> {
    this.requestManager.switchEnv(API_ENDPOINTS.PRE_ASSESSMENT_SESSION_CLOSE);
    return firstValueFrom(
      this.requestManager
        .post(API_ENDPOINTS.PRE_ASSESSMENT_SESSION_CLOSE, { questions })
        .pipe(catchError(this.handleError))
    );
  }

  getSessionReport(conv_uuid: string, cur_uuid: string, act_id: string): Promise<any> {
    this.requestManager.switchEnv(API_ENDPOINTS.SESSION_REPORT);
    return firstValueFrom(
      this.requestManager
        .post(API_ENDPOINTS.SESSION_REPORT, { conv_uuid, cur_uuid, act_id })
        .pipe(catchError(this.handleError))
    );
  }

  getStrengthAspirationReport(ms_id: string): Promise<any> {
    this.requestManager.switchEnv(API_ENDPOINTS.ST_ASP_REPORT);
    return firstValueFrom(
      this.requestManager
        .get(`${API_ENDPOINTS.ST_ASP_REPORT}/${ms_id}`)
        .pipe(catchError(this.handleError))
    );
  }

  getConsolidatedFeedbackReport(payload: { conv_uuid: string; act_id: string; type: string }): Promise<any> {
    this.requestManager.switchEnv(API_ENDPOINTS.CONSOLIDATED_FEEDBACK_REPORT);
    return firstValueFrom(
      this.requestManager
        .post(API_ENDPOINTS.CONSOLIDATED_FEEDBACK_REPORT, payload)
        .pipe(catchError(this.handleError))
    );
  }

  getGrowModel(cur_uuid: string): Promise<any> {
    this.requestManager.switchEnv(API_ENDPOINTS.GROW_MODEL);
    return firstValueFrom(
      this.requestManager
        .get(`${API_ENDPOINTS.GROW_MODEL}/${cur_uuid}`)
        .pipe(catchError(this.handleError))
    );
  }

  getOverallValues(): Promise<any> {
    this.requestManager.switchEnv(API_ENDPOINTS.OVERALL_VALUES);
    return firstValueFrom(
      this.requestManager
        .get(API_ENDPOINTS.OVERALL_VALUES)
        .pipe(catchError(this.handleError))
    );
  }

  getBulkQuestions(payload: any): Promise<any> {
    this.requestManager.switchEnv(API_ENDPOINTS.MISCELLAENOUS_BULK_QUES);
    return firstValueFrom(
      this.requestManager
        .post(API_ENDPOINTS.MISCELLAENOUS_BULK_QUES, payload)
        .pipe(catchError(this.handleError))
    );
  }

  submitBulkResponses(payload: any): Promise<any> {
    this.requestManager.switchEnv(API_ENDPOINTS.MISCELLAENOUS_BULK_RESP);
    return firstValueFrom(
      this.requestManager
        .post(API_ENDPOINTS.MISCELLAENOUS_BULK_RESP, payload)
        .pipe(catchError(this.handleError))
    );
  }

  shareReport(payload: any): Promise<any> {
    this.requestManager.switchEnv(API_ENDPOINTS.SHARE_REPORT);
    return firstValueFrom(
      this.requestManager
        .post(API_ENDPOINTS.SHARE_REPORT, payload)
        .pipe(catchError(this.handleError))
    );
  }

  logout(): Promise<void> {
    this.requestManager.switchEnv(API_ENDPOINTS.LOGOUT);
    return firstValueFrom(
      this.requestManager.put(API_ENDPOINTS.LOGOUT, {}).pipe(catchError(this.handleError))
    )
  }
}
