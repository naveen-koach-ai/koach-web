import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-callout',
  templateUrl: './callout.component.html',
  styleUrls: ['./callout.component.scss'],
  standalone: true,
  imports: [NgClass, IonicModule],
})
export class CalloutComponent {
  @Input() question: string = '';
  @Input() fsize: string = '';
  @Input() fweight: string = '';
  @Input() pos: string = '';
  @Input() showButton: boolean = false;
  @Input() button: { label: string; color: string; shape: string; icon_name: string; icon_slot: string; icon_font: string } = {
    label: '',
    color: '',
    shape: '',
    icon_name: '',
    icon_slot: '',
    icon_font: '',
  };

  @Output() triggerEvent: EventEmitter<any> = new EventEmitter();

  emitEvent() {
    this.triggerEvent.emit();
  }
}
