import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenericPopupModalPage } from './generic-popup-modal.page';

describe('GenericPopupModalPage', () => {
  let component: GenericPopupModalPage;
  let fixture: ComponentFixture<GenericPopupModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericPopupModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
