import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlumberMeetListPage } from './plumber-meet-list';

@NgModule({
  declarations: [
    PlumberMeetListPage,
  ],
  imports: [
    IonicPageModule.forChild(PlumberMeetListPage),
  ],
})
export class PlumberMeetListPageModule {}
