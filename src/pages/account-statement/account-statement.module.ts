import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountStatementPage } from './account-statement';

@NgModule({
  declarations: [
    AccountStatementPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountStatementPage),
  ],
})
export class AccountStatementPageModule {}
