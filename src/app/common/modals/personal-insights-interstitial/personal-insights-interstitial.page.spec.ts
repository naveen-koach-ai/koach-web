import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalInsightsInterstitialPage } from './personal-insights-interstitial.page';

describe('PersonalInsightsInterstitialPage', () => {
  let component: PersonalInsightsInterstitialPage;
  let fixture: ComponentFixture<PersonalInsightsInterstitialPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PersonalInsightsInterstitialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
