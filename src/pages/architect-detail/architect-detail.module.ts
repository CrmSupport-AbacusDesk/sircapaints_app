import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArchitectDetailPage } from './architect-detail';

@NgModule({
  declarations: [
    ArchitectDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ArchitectDetailPage),
  ],
})
export class ArchitectDetailPageModule {}
