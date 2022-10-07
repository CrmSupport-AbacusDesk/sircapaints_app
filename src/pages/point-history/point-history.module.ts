import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PointHistoryPage } from './point-history';

@NgModule({
  declarations: [
    PointHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(PointHistoryPage),

  ],
})
export class PointHistoryPageModule {}
