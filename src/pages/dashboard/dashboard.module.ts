import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import {ProgressBarModule} from "angular-progress-bar";

@NgModule({
  declarations: [
    DashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
    ProgressBarModule
  ],
})
export class DashboardPageModule {}
