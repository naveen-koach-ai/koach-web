import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AskForFeedbackPage } from './ask-for-feedback.page';

describe('AskForFeedbackPage', () => {
  let component: AskForFeedbackPage;
  let fixture: ComponentFixture<AskForFeedbackPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AskForFeedbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
