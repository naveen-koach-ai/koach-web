import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileWithHaloComponent } from './profile-with-halo/profile-with-halo.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ProfileWithHaloComponent],
  exports: [ProfileWithHaloComponent],
})
export class SharedModule {}
