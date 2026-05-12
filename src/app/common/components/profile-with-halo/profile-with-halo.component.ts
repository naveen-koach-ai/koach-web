import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-with-halo',
  templateUrl: './profile-with-halo.component.html',
  styleUrls: ['./profile-with-halo.component.scss'],
  standalone: false,
})
export class ProfileWithHaloComponent {
  @Input() props: any = {};
  @Input() user: any = {};
}
