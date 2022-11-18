import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { IonicSelectableModule } from 'ionic-selectable';
import { SiteSelectPage } from './site-select';

@NgModule({
  declarations: [
    SiteSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteSelectPage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class SiteSelectPageModule {}
