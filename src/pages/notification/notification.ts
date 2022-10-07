import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, LoadingController, Loading, ModalController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ActivitydetailPage } from '../activitydetail/activitydetail';
import { AddActivityPage } from '../add-activity/add-activity';
import { FiltersPage } from '../filters/filters';

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  filter: any = {};

  loading:Loading;

  activity_list :any = [];


  constructor(public navCtrl: NavController,private alertCtrl: AlertController,public loadingCtrl:LoadingController,public dbService:DbserviceProvider, public navParams: NavParams , public modal: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  ionViewWillEnter()
  {
    this.get_activity();
  }

  ionViewDidLeave()
  {
      // let nav = this.app.getActiveNav();
      // if(nav && nav.getActive())
      // {
      //     let activeView = nav.getActive().name;
      //     let previuosView = '';
      //     if(nav.getPrevious() && nav.getPrevious().name)
      //     {
      //         previuosView = nav.getPrevious().name;
      //     }
      //     console.log(previuosView);
      //     console.log(activeView);
      //     console.log('its leaving');
      //     if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage'))
      //     {

      //         console.log(previuosView);
      //         this.navCtrl.popToRoot();
      //     }
      // }
   }




   add_activity()
   {
     this.navCtrl.push(AddActivityPage);
   }

   get_activity(){

    console.log("get_activity method calls");
    // console.log(this.filter);

    this.show_loading();
    // this.dbService.onPostRequestDataFromApi({'filter':this.filter},"Followup/activity_listing", this.dbService.rootUrlSfa)
    this.dbService.onPostRequestDataFromApi({'filter':this.filter},"Followup/activity_listing", this.dbService.rootUrlSfa)
    .subscribe(resp=>{
      // this.loading.dismiss();
      console.log(resp);

      this.activity_list = resp['inside_sales_activity_list']
      this.dismiss_loading();
    },err=>
    {
      this.dismiss_loading();
    })

  }

  show_loading(){
    console.log("in show");
    if(!this.loading){
      this.loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<img src="./assets/imgs/gif.svg"/>`,
        // dismissOnPageChange: true
      });
      this.loading.present();
    }
  }

  dismiss_loading(){
    console.log("in dismiss");
    if(this.loading){
      this.loading.dismiss();
      this.loading = null;
    }
  }

  doRefresh (refresher){
    this.filter.master='';
    this.filter.date = '';
    this.get_activity()
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }


  open_filter_modal(){

    console.log("open_filter_modal method calls");

    let FiltersPageModal =  this.modal.create(FiltersPage,{'filter':this.filter,'from':'activity-notification-page'});
    FiltersPageModal.onDidDismiss(data =>{
      if(data == 'minimise'){

      }
      else{
        console.log(data);
        this.filter = data;
        this.get_activity();
      }
    });
    FiltersPageModal.present();
  }
  go_to_activity_detail(id){
    console.log("go_to_activity_detail method call");
    console.log(id);
    this.navCtrl.push(ActivitydetailPage,{'activity_id':id , 'from':'activity_list_page'});

  }


}
