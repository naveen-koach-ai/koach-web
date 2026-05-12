import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError, timer } from 'rxjs';
import { catchError, mergeMap, retryWhen } from 'rxjs/operators';

import { FALLBACK_ERROR_MESSAGES_FOR_INTERCEPTORS } from '../constants/constants';
import { Router } from '@angular/router';

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second delay between retries
const RETRYABLE_STATUS_CODES = [
  HttpStatusCode.RequestTimeout,      // 408 - Request Timeout
  HttpStatusCode.ServiceUnavailable,  // 503 - Service Unavailable
  HttpStatusCode.GatewayTimeout,      // 504 - Gateway Timeout
  HttpStatusCode.BadGateway,          // 502 - Bad Gateway
  0,                                  // 0 - Client Network Error
];

export const httpRequestInterceptor: HttpInterceptorFn = (request, next) => {
  const router = inject(Router);

  // Start with the timezone header for all requests
  let headers = request.headers.set('X-timezone', Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Add authorization header if token exists
  const token = window.sessionStorage.getItem('token');

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  // Create the modified request with all headers
  const modifiedRequest = request.clone({ headers });

  return next(modifiedRequest).pipe(
    retryWhen(errors =>
      errors.pipe(
        mergeMap((error, index) => {
          const shouldRetry = RETRYABLE_STATUS_CODES.includes(error.status);

          // Calculate exponential backoff delay
          const retryDelay = RETRY_DELAY * Math.pow(2, index);

          if (shouldRetry && index < MAX_RETRIES) {
            console.log(`Retry attempt ${index + 1} for ${error.status} error. Waiting ${retryDelay}ms...`);
            return timer(retryDelay); // Exponential backoff
          }
          return throwError(() => error);
        })
      )
    ),
    // In-case retryWhen is fully deprecated, this might help, but not tested yet
    // retry({
    //   count: MAX_RETRIES,
    //   delay: (error, retryCount) => {
    //     if (error instanceof HttpErrorResponse &&
    //         RETRYABLE_STATUS_CODES.includes(error.status)) {
    //       // Calculate exponential backoff delay
    //       const delay = INITIAL_DELAY * Math.pow(2, retryCount - 1);
    //       console.log(`Retry attempt ${retryCount} for ${error.status} error. Waiting ${delay}ms...`);
    //       return true;
    //     }
    //     return false;
    //   },
    //   resetOnSuccess: true
    // }),
    catchError((error: HttpErrorResponse) => {
      console.log('HTTP Error inside interceptor:', error);
      // return throwError(() => error);
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        console.error('Client-side error:', error.error.message);
        return throwError(() => (error));
      }

      // Server-side errors
      switch (error.status) {
        case HttpStatusCode.Unauthorized: // 401
          console.error('Unauthorized access:', error);
          

          error.error.message = error.error.message || FALLBACK_ERROR_MESSAGES_FOR_INTERCEPTORS.ERROR_MESSAGE_401;
          // Clear stored credentials
          sessionStorage.clear();
          router.navigate(['login']);
          return throwError(() => (error));

        case HttpStatusCode.Forbidden: // 403
          console.error('Forbidden access:', error);
          error.error.message = FALLBACK_ERROR_MESSAGES_FOR_INTERCEPTORS.ERROR_MESSAGE_403
          return throwError(() => (error));

        case HttpStatusCode.NotFound: // 404
          console.error('Resource not found:', error);
          error.error.message = FALLBACK_ERROR_MESSAGES_FOR_INTERCEPTORS.ERROR_MESSAGE_404
          return throwError(() => (error));

        case HttpStatusCode.RequestTimeout: // 408
          console.error('Request timeout:', error);
          error.error.message = FALLBACK_ERROR_MESSAGES_FOR_INTERCEPTORS.ERROR_MESSAGE_408
          return throwError(() => (error));

        case HttpStatusCode.BadRequest: // 400
          console.error('Bad request:', error);
          error.error.message = FALLBACK_ERROR_MESSAGES_FOR_INTERCEPTORS.ERROR_MESSAGE_400
          return throwError(() => (error));

        case HttpStatusCode.InternalServerError: // 500
          console.error('Server error:', error);
          error.error.message = FALLBACK_ERROR_MESSAGES_FOR_INTERCEPTORS.ERROR_MESSAGE_500
          return throwError(() => (error));

        case HttpStatusCode.BadGateway: // 502
        case HttpStatusCode.ServiceUnavailable: // 503
        case HttpStatusCode.GatewayTimeout: // 504
          console.error('Server unavailable:', error);
          error.error.message = FALLBACK_ERROR_MESSAGES_FOR_INTERCEPTORS.ERROR_MESSAGE_502
          return throwError(() => (error));

        case HttpStatusCode.UnprocessableEntity: //422
          console.error('An error occurred:', error);
          return throwError(() => (error));

        default:
          console.error('An error occurred:', error);
          error.error.message = error.error.message || FALLBACK_ERROR_MESSAGES_FOR_INTERCEPTORS.DEFAULT_ERROR_MESSAGE
          return throwError(() => (error));
      }
    })
  );
};

// Need intensive testing
// import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { throwError, TimeoutError, timer, race, Observable } from 'rxjs';
// import { catchError, retry, timeout, switchMap, take } from 'rxjs/operators';
// import { UserService } from './user.service';

// const MAX_RETRIES = 2;
// const INITIAL_DELAY = 1000; // 1 second
// const REQUEST_TIMEOUT = 30000; // 30 seconds
// const PENDING_REQUEST_TIMEOUT = 10000; // 10 seconds for pending requests

// // Status codes that should trigger a retry
// const RETRYABLE_STATUS_CODES = [
//   HttpStatusCode.RequestTimeout,      // 408
//   HttpStatusCode.TooManyRequests,     // 429
//   HttpStatusCode.ServiceUnavailable,  // 503
//   HttpStatusCode.GatewayTimeout,      // 504
//   HttpStatusCode.BadGateway,          // 502
//   0,                                  // Client Network Error
// ];

// export const httpRequestInterceptor: HttpInterceptorFn = (request, next) => {
//   const userService = inject(UserService);
//   const router = inject(Router);

//   // Start with the timezone header for all requests
//   let headers = request.headers.set(
//     'X-timezone',
//     Intl.DateTimeFormat().resolvedOptions().timeZone
//   );

//   // Add authorization header if token exists
//   const token = window.sessionStorage.getItem('token');
//   if (token) {
//     headers = headers.set('Authorization', `Bearer ${token}`);
//   }

//   // Create the modified request with all headers
//   const modifiedRequest = request.clone({ headers });

//   // Function to create a request with timeout
//   const executeRequest = (): Observable<any> => {
//     return race(
//       next(modifiedRequest),
//       timer(PENDING_REQUEST_TIMEOUT).pipe(
//         switchMap(() => throwError(() => new TimeoutError('Request cancelled due to no response')))
//       )
//     ).pipe(
//       timeout({
//         first: REQUEST_TIMEOUT,
//         with: () => throwError(() => new TimeoutError('Request timed out')),
//       })
//     );
//   };

//   // Execute request with one retry for pending requests
//   return executeRequest().pipe(
//     retry({
//       count: 1,
//       delay: (error, retryCount) => {
//         if (error instanceof TimeoutError) {
//           console.log(`Request cancelled due to pending state. Attempting retry ${retryCount}...`);
//           return true;
//         } else if (error instanceof HttpErrorResponse &&
//                   RETRYABLE_STATUS_CODES.includes(error.status)) {
//           const delay = INITIAL_DELAY * Math.pow(2, retryCount - 1);
//           console.log(`Retry attempt ${retryCount} for ${error.status} error. Waiting ${delay}ms...`);
//           return true;
//         }
//         return false;
//       },
//       resetOnSuccess: true
//     }),
//     catchError((error: HttpErrorResponse | TimeoutError) => {
//       // Handle TimeoutError separately
//       if (error instanceof TimeoutError) {
//         console.error('Request cancelled after retry attempt');
//         return throwError(() => ({
//           message: 'The request was cancelled due to slow response. Please try again.',
//           error: error
//         }));
//       }

//       // Handle other errors
//       if (error instanceof HttpErrorResponse) {
//         if (error.error instanceof ErrorEvent) {
//           console.error('Client-side error:', error.error.message);
//           return throwError(() => ({
//             message: 'Something went wrong with your connection. Please check your internet and try again.',
//             error: error.error.message
//           }));
//         }

//         // Server-side errors
//         switch (error.status) {
//           case HttpStatusCode.Unauthorized: // 401
//             console.error('Unauthorized access:', error);
//             window.sessionStorage.removeItem('token');
//             router.navigate(['/login'], {
//               queryParams: { returnUrl: router.url }
//             });
//             return throwError(() => ({
//               message: 'Your session has expired. Please log in again.',
//               error: error
//             }));

//           case HttpStatusCode.Forbidden: // 403
//             console.error('Forbidden access:', error);
//             return throwError(() => ({
//               message: 'You do not have permission to access this resource.',
//               error: error
//             }));

//           case HttpStatusCode.NotFound: // 404
//             console.error('Resource not found:', error);
//             return throwError(() => ({
//               message: 'The requested resource was not found.',
//               error: error
//             }));

//           case HttpStatusCode.RequestTimeout: // 408
//           case HttpStatusCode.GatewayTimeout: // 504
//             console.error('Request timeout after retry:', error);
//             return throwError(() => ({
//               message: 'The request timed out. Please try again later.',
//               error: error
//             }));

//           case HttpStatusCode.TooManyRequests: // 429
//             console.error('Rate limit exceeded:', error);
//             return throwError(() => ({
//               message: 'Too many requests. Please try again in a few moments.',
//               error: error
//             }));

//           case HttpStatusCode.BadRequest: // 400
//             console.error('Bad request:', error);
//             return throwError(() => ({
//               message: 'Invalid request. Please check your input and try again.',
//               error: error
//             }));

//           case HttpStatusCode.InternalServerError: // 500
//             console.error('Server error:', error);
//             return throwError(() => ({
//               message: 'An unexpected server error occurred. Please try again later.',
//               error: error
//             }));

//           case HttpStatusCode.BadGateway: // 502
//           case HttpStatusCode.ServiceUnavailable: // 503
//             console.error('Server unavailable:', error);
//             return throwError(() => ({
//               message: 'The server is currently unavailable. Please try again later.',
//               error: error
//             }));

//           default:
//             console.error('An error occurred:', error);
//             return throwError(() => ({
//               message: 'An unexpected error occurred. Please try again later.',
//               error: error
//             }));
//         }
//       }

//       return throwError(() => error);
//     })
//   );
// };
