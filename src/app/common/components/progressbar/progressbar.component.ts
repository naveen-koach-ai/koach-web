import { Component, Input, OnChanges } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss'],
  imports: [IonicModule],
})
export class ProgressbarComponent implements OnChanges {

  @Input() session: any = {};
  @Input() currentQuestionIndex: number = 0;

  constructor() { }

  ngOnChanges() {}

}
