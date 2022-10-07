import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FollowUpListPage } from './follow-up-list';

@NgModule({
  declarations: [
    FollowUpListPage,
  ],
  imports: [
    IonicPageModule.forChild(FollowUpListPage),
  ],
})
export class FollowUpListPageModule {}
