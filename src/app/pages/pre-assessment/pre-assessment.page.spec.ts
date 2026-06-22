import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PreAssessmentPage } from './pre-assessment.page';

describe('PreAssessmentPage', () => {
  let component: PreAssessmentPage;
  let fixture: ComponentFixture<PreAssessmentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PreAssessmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
