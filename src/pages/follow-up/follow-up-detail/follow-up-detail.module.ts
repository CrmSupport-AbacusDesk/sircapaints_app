import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FollowUpDetailPage } from './follow-up-detail';

@NgModule({
  declarations: [
    FollowUpDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(FollowUpDetailPage),
  ],
})
export class FollowUpDetailPageModule {}
