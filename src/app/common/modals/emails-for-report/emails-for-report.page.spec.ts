import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailsForReportPage } from './emails-for-report.page';

describe('EmailsForReportPage', () => {
  let component: EmailsForReportPage;
  let fixture: ComponentFixture<EmailsForReportPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmailsForReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
