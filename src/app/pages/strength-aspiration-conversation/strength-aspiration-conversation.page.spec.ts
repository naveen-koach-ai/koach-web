import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StrengthAspirationConversationPage } from './strength-aspiration-conversation.page';

describe('StrengthAspirationConversationPage', () => {
  let component: StrengthAspirationConversationPage;
  let fixture: ComponentFixture<StrengthAspirationConversationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StrengthAspirationConversationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
