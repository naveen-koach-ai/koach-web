// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  end_point: `https://koach.ai:7002/api/v1/m/`,
  end_point_v2: `https://koach.ai:7002/api/v2/m/`,
  end_point_v3: `https://koach.ai:7002/api/v3/m/`,
  prompt_end_point: `https://ylwnik9966.execute-api.ap-south-1.amazonaws.com/Prod/ResponseValidation`,
  env: "LIVE"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
