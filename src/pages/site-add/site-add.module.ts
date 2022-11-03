import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { IonicSelectableModule } from 'ionic-selectable';
import { SiteAddPage } from './site-add';

@NgModule({
  declarations: [
    SiteAddPage,
  ],
  imports: [
    IonicPageModule.forChild(SiteAddPage),
    IonicSelectableModule,
    SelectSearchableModule
  ],
})
export class SiteAddPageModule {}
