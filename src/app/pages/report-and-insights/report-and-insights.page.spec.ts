import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportAndInsightsPage } from './report-and-insights.page';

describe('ReportAndInsightsPage', () => {
  let component: ReportAndInsightsPage;
  let fixture: ComponentFixture<ReportAndInsightsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReportAndInsightsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
