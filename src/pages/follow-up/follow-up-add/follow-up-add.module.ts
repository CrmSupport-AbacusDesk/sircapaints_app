import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { IonicSelectableModule } from 'ionic-selectable';
import { FollowUpAddPage } from './follow-up-add';

@NgModule({
  declarations: [
    FollowUpAddPage,
  ],
  imports: [
    IonicPageModule.forChild(FollowUpAddPage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class FollowUpAddPageModule {}
