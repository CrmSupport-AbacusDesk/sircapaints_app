import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DealerHomePage } from './dealer-home';
import {ProgressBarModule} from "angular-progress-bar";


@NgModule({
  declarations: [
    DealerHomePage,
  ],
  imports: [
    IonicPageModule.forChild(DealerHomePage),
    ProgressBarModule
  ],
})
export class DealerHomePageModule {}
