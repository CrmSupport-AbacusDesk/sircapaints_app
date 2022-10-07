import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App } from 'ionic-angular';
import { OffersPage } from '../offers/offers';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-offer-list',
  templateUrl: 'offer-list.html',
})
export class OfferListPage {
  offer_list:any=[];
  loading:Loading;
  filter:any={};
  flag:any='';
  uploadURL:any;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dbService:DbserviceProvider,
    public loadingCtrl:LoadingController,
    private app:App) {
      this.uploadURL = this.dbService.uploadURL;
      this.presentLoading();
      this.getofferList();
      
 
    }
    
    
    
    doRefresh(refresher)
    {
      console.log('Begin async operation', refresher);
      this.getofferList();
      refresher.complete();
    }
    
    goOnOffersPage(id)
    {
      this.navCtrl.push(OffersPage,{'id':id});
    }

    presentLoading()
    {
      this.loading = this.loadingCtrl.create({
        content: "Please wait...",
        dismissOnPageChange: true
      });
      this.loading.present();
    }

    getofferList()
    {
      this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id},'app_karigar/offerList', this.dbService.rootUrl).subscribe(r=>
        {
          console.log(r);
          this.loading.dismiss();
          this.offer_list=r['offer'];
          console.log(this.offer_list);
        });
      }
      
     
      ionViewDidLeave()
      {
        if(this.dbService.connection!='offline')
        {
          let nav = this.app.getActiveNav();
          if(nav && nav.getActive())
          {
            let activeView = nav.getActive().name;
            let previuosView = '';
            if(nav.getPrevious() && nav.getPrevious().name)
            {
              previuosView = nav.getPrevious().name;
            }
            console.log(previuosView);
            console.log(activeView);
            console.log('its leaving');
            if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage'))
            {
              
              console.log(previuosView);
              this.navCtrl.popToRoot();
            }
          }
        }
      }
    }
    