import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/common/services/user.service';
import { AlertTypeEnum, StatusCodes } from '../../common/constants/constants';
import { ApiService } from '../../common/services/api.service';
import { CommonService } from '../../common/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit, OnDestroy {
  activeSegment: 'login' | 'signup' = 'login';
  showLoginPassword = false;
  showSignupPassword = false;
  showForgotPassword = false;

  organization = '';

  loginForm!: FormGroup;
  signupForm!: FormGroup;
  forgotPasswordForm!: FormGroup;

  experienceList: any[] = [
    {
      exp: '0',
    },
    {
      exp: '0-2',
    },
    {
      exp: '2-5',
    },
    {
      exp: '5-10',
    },
    {
      exp: '10-15',
    },
    {
      exp: '15+',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private commonService: CommonService,
    private userService: UserService,
    private route: ActivatedRoute,
  ) {}

  loginSource: string | null = null;
  slackUserId: string | null = null;
  teamId: string | null = null;

  // Track subscription to prevent leaks
  private paramSub!: Subscription;

  ngOnInit() {
    console.log('href>>', window.location.href);
    console.log('routee>>', this.route);
    // FIX: Listen to the active stream instead of a static snapshot
    this.paramSub = this.route.queryParamMap.subscribe((params) => {
      this.loginSource = params.get('source');
      this.slackUserId = params.get('slackUserId');
      this.teamId = params.get('teamId');

      console.log('Parsed Query Data:', {
        source: this.loginSource,
        user: this.slackUserId,
        team: this.teamId,
      });

      if (this.loginSource === 'slack' && this.slackUserId) {
        console.log('handle slack SSO.');
      }
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      exp: ['', Validators.required],
      institution: [''],
      ref_code: ['', Validators.required],
      codeVerified: [false, Validators.requiredTrue],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
        ],
      ],
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get lf() {
    return this.loginForm.controls;
  }
  get sf() {
    return this.signupForm.controls;
  }
  get ff() {
    return this.forgotPasswordForm.controls;
  }

  onSegmentChange(event: any) {
    this.activeSegment = event.detail.value;
    this.showForgotPassword = false;
    this.sf['codeVerified'].setValue(false);
    this.organization = '';
  }

  onRefCodeChange() {
    this.sf['codeVerified'].setValue(false);
    this.organization = '';
  }

  checkValidEmail(event: any) {
    if (this.signupForm.controls['email'].status === 'VALID') {
      this.apiService
        .validateEmail(event.target.value)
        .then((resp: any) => {
          if (resp.code === StatusCodes.PK_EMAIL_EXISTS) {
            this.commonService.showAlert(
              AlertTypeEnum.Error,
              '',
              'This email is already registered.',
              this.commonService.alertButtonList,
            );
          } else if (resp.code !== StatusCodes.PK_SUCCESS) {
            this.commonService.showAlert(
              AlertTypeEnum.Error,
              '',
              'Something went wrong! Try again.',
              this.commonService.alertButtonList,
            );
          }
        })
        .catch((error: any) => {
          this.commonService.showAlert(
            AlertTypeEnum.Error,
            '',
            error.message || 'Failed to validate email. Please try again.',
            this.commonService.alertButtonList,
          );
        });
    }
  }

  verifyCode() {
    const { ref_code, email } = this.signupForm.value;
    if (!ref_code) return;
    this.organization = '';
    this.apiService
      .verifyReferralCode(ref_code, email)
      .then((resp: any) => {
        if (resp.code === StatusCodes.PK_SUCCESS) {
          this.sf['codeVerified'].setValue(true);
          this.organization = resp.data?.org_name || '';
        } else {
          this.sf['codeVerified'].setValue(false);
          this.commonService.showAlert(
            AlertTypeEnum.Error,
            '',
            resp.message || 'Invalid referral code.',
            this.commonService.alertButtonList,
          );
        }
      })
      .catch(() => {
        this.sf['codeVerified'].setValue(false);
        this.commonService.showAlert(
          AlertTypeEnum.Error,
          '',
          'Failed to verify code. Please try again.',
          this.commonService.alertButtonList,
        );
      });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.loginForm.value;
    this.commonService.showLoader();
    this.apiService
      .login(email, password)
      .then(async (res) => {
        if (res.code === StatusCodes.PK_SUCCESS) {
          const loginResponse = res.data?.response;
          if (this.loginSource === 'slack') {
            // After successful login
            // res.redirect(
            //   `slack://app?team=${this.teamId}&id=${this.slackUserId}`,
            // );
            window.location.href = `slack://app?team=${this.teamId}&id=${this.slackUserId}`;
            return;
          }
          if (loginResponse && loginResponse.token) {
            const decodedToken: any = jwtDecode(loginResponse.token);
            if (
              decodedToken &&
              decodedToken.end_date &&
              new Date(decodedToken.end_date) < new Date()
            ) {
              this.commonService.showAlert(
                AlertTypeEnum.Warning,
                '',
                'Your Organization subscription has expired. Please contact your administrator.',
                this.commonService.alertButtonList,
              );
              return;
            }
            this.userService.user.next(loginResponse);
            window.sessionStorage.setItem(
              'user',
              JSON.stringify(loginResponse),
            );
            window.sessionStorage.setItem('token', loginResponse.token);
            this.userService.tokenValue.next(loginResponse.token);
            const decodedValues = await this.userService.decodingJWTValues(
              loginResponse.token,
            );
            this.userService.jwtValue.next(decodedValues);
          }

          this.commonService.showAlert(
            AlertTypeEnum.Success,
            '',
            res.message || 'Login successful!',
          );
          this.loginForm.reset();
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1000);
        } else if (res.code === StatusCodes.PK_LIMIT_EXCEEDED) {
          this.commonService.showAlert(
            AlertTypeEnum.Error,
            '',
            res.message || 'Too many login attempts. Please try again later.',
            this.commonService.alertButtonList,
          );
        } else if (
          res.code === StatusCodes.PK_INPUT_INCORRECT ||
          res.code === StatusCodes.PK_INVALID_CREDENTIALS
        ) {
          this.commonService.showAlert(
            AlertTypeEnum.Error,
            '',
            res.message || 'Incorrect email or password. Please try again.',
            this.commonService.alertButtonList,
          );
        } else {
          this.commonService.showAlert(
            AlertTypeEnum.Error,
            '',
            res.message,
            this.commonService.alertButtonList,
          );
          return;
        }
      })
      .catch((err: any) => {
        this.commonService.showAlert(
          AlertTypeEnum.Error,
          '',
          err.message || 'Please try again.',
          this.commonService.alertButtonList,
        );
      });
  }

  onForgotPassword() {
    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }
    const { email } = this.forgotPasswordForm.value;
    this.commonService.showLoader();
    this.apiService
      .forgotPassword(email)
      .then((resp: any) => {
        if (resp.code === StatusCodes.PK_SUCCESS) {
          this.forgotPasswordForm.reset();
          this.showForgotPassword = false;
          this.commonService.showAlert(
            AlertTypeEnum.Success,
            '',
            resp.message,
            this.commonService.alertButtonList,
          );
        } else {
          this.commonService.showAlert(
            AlertTypeEnum.Error,
            '',
            resp.message,
            this.commonService.alertButtonList,
          );
        }
      })
      .catch((err: any) => {
        this.commonService.showAlert(
          AlertTypeEnum.Error,
          '',
          err.message || 'Please try again.',
          this.commonService.alertButtonList,
        );
      });
  }

  onSignup() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      if (!this.sf['codeVerified'].value) {
        this.commonService.showAlert(
          AlertTypeEnum.Warning,
          '',
          'Please verify your referral code first.',
          this.commonService.alertButtonList,
        );
      }
      return;
    }
    const { name, email, exp, institution, ref_code, password } =
      this.signupForm.value;
    const payload = {
      name,
      email,
      exp,
      password,
      institution,
      ref_code,
      daily_goal: '',
      googleUser: false,
    };
    this.commonService.showLoader();
    this.apiService
      .signup(payload)
      .then((resp: any) => {
        if (resp.code === StatusCodes.PK_SUCCESS) {
          this.commonService.showAlert(
            AlertTypeEnum.Success,
            '',
            'Account Created Successfully',
          );
          this.signupForm.reset();
          this.organization = '';
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1000);
        } else {
          this.commonService.showAlert(
            AlertTypeEnum.Error,
            '',
            resp.message || 'Signup Failed',
          );
        }
      })
      .catch((err: any) => {
        console.error('Signup error:', err);
        this.commonService.showAlert(
          AlertTypeEnum.Error,
          '',
          err.message || 'Please try again.',
        );
      });
  }

  getMinExp(exp: any) {
    if (exp.includes('-')) return parseInt(exp.split('-')[0], 10);
    if (exp.includes('+')) return parseInt(exp, 10);
    return parseInt(exp, 10);
  }

  ngOnDestroy(): void {
    this.paramSub.unsubscribe(); // Unsubscribe to prevent memory leaks
  }
}
