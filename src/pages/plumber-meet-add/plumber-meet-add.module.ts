import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlumberMeetAddPage } from './plumber-meet-add';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  declarations: [
    PlumberMeetAddPage,
  ],
  imports: [
    IonicPageModule.forChild(PlumberMeetAddPage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class PlumberMeetAddPageModule {}
