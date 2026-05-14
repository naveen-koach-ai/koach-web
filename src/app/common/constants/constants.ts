export enum AlertTypeEnum {
  Success,
  Information,
  Warning,
  Error,
}

export const RegExPatterns = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@(?=.*[a-zA-Z])[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
  PASSWORD: /^[A-Za-z\d~!@#$%^&*_./\-+=?]{6,20}$/,
  PASSWORD_STRICT: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#%^&*_./<>\-+=?])[A-Za-z\d~!@#%^&*_./\-+=?]{6,20}$/,
  DOB: /^(0?[1-9]|1[0-2])-(0?[1-9]|[12][0-9]|3[01])-\d{4}$/g,
  NAME: /^[a-zA-Z][0-9a-zA-Z-_ ]+$/,
};



export const COACHEE_ROLE_ID = 'ADIDP8';

export class StatusCodes {
  public static PK_SUCCESS = 'PK_SUCCESS';
  public static PK_NO_DATA = 'PK_NO_DATA';
  public static PK_UPDATED = 'PK_UPDATED';
  public static PK_NO_UPDATE = 'PK_NO_UPDATE';
  public static PK_NO_TEMPLATE = 'PK_NO_TEMPLATE';
  public static PK_WR_UR_ID = 'PK_WR_UR_ID';
  public static PK_INVALID_CREDENTIALS = 'PK_INVALID_CREDENTIALS';
  public static PK_INPUT_INCORRECT = 'PK_INPUT_INCORRECT';
  public static PK_NO_SESSION = 'PK_NO_SESSION';
  public static PK_NO_CONVERSATION = 'PK_NO_CONVERSATION';
  public static PK_NO_REPORT = 'PK_NO_REPORT';
  public static PK_BOOKED = 'PK_BOOKED';
  public static PK_NO_BOOKING = 'PK_NO_BOOKING';
  public static PK_BOOKING_NOT_CANCELLED = 'PK_BOOKING_NOT_CANCELLED';
  public static PK_LOGOUT = 'PK_LOGOUT';
  public static PK_CANCEL_NOT_AVAILABLE = 'PK_CANCEL_NOT_AVAILABLE';
  public static PK_USER_RECOMMENDATION = 'PK_USER_RECOMMENDATION';
  public static PK_EMAIL_EXISTS = 'PK_EMAIL_EXISTS';
  public static PK_LIMIT_EXCEEDED = 'PK_LIMIT_EXCEEDED';
  public static PK_DELETE = 'PK_DELETE';
  public static PK_NO_SIGNUP = 'PK_NO_SIGNUP';
  public static PK_CODE_NOT_VALID = 'PK_CODE_NOT_VALID';
  public static PK_UN_AUTHORIZED = 'PK_UN_AUTHORIZED';
  public static PK_SESSION_RESTART = 'PK_SESSION_RESTART';
  public static PK_CODE_UPDATED = 'PK_CODE_UPDATED';
  public static PK_NO_UPDATED = 'PK_NO_UPDATED';
  public static PK_PRIVELAGES_USED = 'PK_PRIVELAGES_USED';
  public static PK_PURCHASE_SUCCESSFUL = 'PK_PURCHASE_SUCCESSFUL';
  public static PK_PURCHASE_FAILED = 'PK_PURCHASE_FAILED';
  public static PK_JWT_UPDATED = 'PK_JWT_UPDATED';
  public static PK_ERROR = 'PK_ERROR';
}

export const API_ENDPOINTS = {
  //Auth
  LOGIN: 'auth/coachee/login',
  PHONE_LOGIN: 'auth/mobile/login',
  FORGET_PASSWORD: 'auth/forgot-password',
  RESET_PASSWORD: 'auth/reset-password',
  UPDATE_PASSWORD: 'auth/update_password',
  LOGOUT: 'auth/logout',

  //Signup
  SIGNUP_FQUE: 'signup/questions/',
  SIGNUP_ALL_QUES: 'signup/postbackQuestions',
  SIGNUP_COMPLETED: 'signup/completed',

  VERIFY_REFERRAL_CODE: 'verify-referral-code',
  GET_DROPDOWNS_ONBOARDING: 'get-dropdowns',
  VALIDATE_EMAIL: 'auth/validate-email/',

  MISCELLAENOUS_CONV : `miscellaenous-conversations`,

  PRE_ASSESSMENT: 'get-questions',
  PRE_ASSESSMENT_SESSION_CLOSE: 'onboard-close-session',

  SESSION_REPORT: 'view-report',
  GROW_MODEL: 'grow-model/',
  OVERALL_VALUES: `overall-comp-values`,
  ST_ASP_REPORT: 'st-asp-report',
  CONSOLIDATED_FEEDBACK_REPORT: '/consolidated-reports',
  SHARE_REPORT: 'share/add',
  SEND_REPORT_BY_EMAIL: 'share/send-report',
  
  MISCELLAENOUS_BULK_QUES: `bulk-questions`,
  MISCELLAENOUS_BULK_RESP: `misc-close-session`,
  GET_REPORT_BY_EMAIL: 'share-by-email',

  FEEDBACK_USERS: 'ask-feedback-users',
  ASK_FEEDBACK: `ask-feedback`
};

export const FALLBACK_ERROR_MESSAGES_FOR_INTERCEPTORS = {
  ERROR_MESSAGE_400: 'Invalid request. Please check your input and try again.',
  ERROR_MESSAGE_401_IN_LOGIN_PAGE: 'The credentials you entered are incorrect. Please verify and try again.',
  ERROR_MESSAGE_401: 'Your session has expired and you will be logged out.',
  ERROR_MESSAGE_403: 'You do not have permission to access this resource.',
  ERROR_MESSAGE_404: 'The requested resource was not found.',
  ERROR_MESSAGE_408: 'The request timed out after multiple attempts. Please try again later.',
  ERROR_MESSAGE_500: 'An unexpected server error occurred. Please try again later.',
  ERROR_MESSAGE_502: 'The server is currently unavailable. Please try again later.',
  DEFAULT_ERROR_MESSAGE: 'An unexpected error occurred. Please try again later.',
};

export const CONVERSATION_IDS = {
  Development_Dimensions: '60feca78-be99-41e9-a0c9-a9428a02ca09'
}

export const EZ_POPUP_EVENTS = {
    NONE: 'NONE',
    CANCEL: 'CANCEL',
    CLOSE_APP: 'CLOSE_APP',
    BACK: 'BACK',
    LOGOUT: 'LOGOUT',
    VALIDATE: 'VALIDATE',
    CANCEL_CHAT: 'CANCEL_CHAT',
    END_CHAT: 'END_CHAT',
    TRY_AGAIN: 'TRY_AGAIN',
    HOME: 'HOME',
    LOGIN: 'LOGIN',
    VALID: 'VALID',
    INVALID: 'INVALID',
    CHAT_VALID: 'CHAT_VALID',
    RETRY: 'RETRY',
    UPDATE: 'UPDATE',
    WANT_MENTOR_CHAT: 'WANT_MENTOR_CHAT',
    RESET_THEME: 'RESET_THEME',
    SIGNUP: 'SIGNUP',
  };