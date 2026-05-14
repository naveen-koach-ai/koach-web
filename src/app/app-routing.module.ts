import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth-guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [authGuard]
  },
  {
    path: 'report-and-insights',
    loadChildren: () => import('./pages/report-and-insights/report-and-insights.module').then(m => m.ReportAndInsightsPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'pre-assessment',
    loadChildren: () => import('./pages/pre-assessment/pre-assessment.module').then(m => m.PreAssessmentPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'strength-aspiration-conversation',
    loadChildren: () => import('./pages/strength-aspiration-conversation/strength-aspiration-conversation.module').then(m => m.StrengthAspirationConversationPageModule),
    canActivate: [authGuard]
  },
  {
    path: 'generic-popup-modal',
    loadChildren: () => import('./common/modals/generic-popup-modal/generic-popup-modal.module').then(m => m.GenericPopupModalPageModule)
  },
  {
    path: 'ask-for-feedback',
    loadChildren: () => import('./pages/ask-for-feedback/ask-for-feedback.module').then((m) => m.AskForFeedbackPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
