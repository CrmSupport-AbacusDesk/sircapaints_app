import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { LeadsDetailPage } from '../../leads-detail/leads-detail';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { Storage } from '@ionic/storage';
import { AddActivityPage } from '../../add-activity/add-activity';


@IonicPage()
@Component({
  selector: 'page-main-distributor-list',
  templateUrl: 'main-distributor-list.html',
})
export class MainDistributorListPage {

  user_right:any=[];
  DrType:any;

  distributor_list:any = [];
  load_data:any = "0";
  limit=0;
  flag:any='';
  search:any;

  distributor_details:any = [];
  distributor_checkin:any = [];
  distributor_order:any=[];
  userStorageData:any={};


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService: DbserviceProvider,
              public loadingCtrl: LoadingController,
              public storage: Storage) {

        console.log(this.navParams);
        console.log("Nav Params Data: ",this.navParams['data']['tabIndex']);

        console.log(this.navParams.get('type'));
        this.DrType = this.navParams.get('type')

        if(this.navParams['data']['tabIndex'] == 15){

          this.DrType = 1;

        }

        if(this.navParams['data']['tabIndex'] == 13){

          this.DrType = 7;

        }

        if(this.navParams['data']['tabIndex'] == 12){

          this.DrType = 3;

        }

        this.get_distributor_list();

        this.storage.get('userStorageData').then((resp)=>{
          console.log(resp);

          this.userStorageData = resp
          console.log("User Session Storage: ",this.userStorageData);

          console.log("User Type: ",this.userStorageData.user_type);
        });
  }


  get_distributor_list()
  {
    console.log(this.DrType);
    this.dbService.onShowLoadingHandler()
    this.dbService.onPostRequestDataFromApi({'limit':this.limit,'company_name':this.search,type:this.DrType},'Distributor/distributor_lists', this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);
      this.distributor_list = result;

      if(this.distributor_list.length == 0)
      {
        this.load_data = "1";
      }
      this.dbService.onDismissLoadingHandler();
    },
    er=>
    {
      this.dbService.onDismissLoadingHandler()
      this.dbService.errToasr()
    });
  }


  loadData(infiniteScroll)
  {
    console.log('loading');

    this.dbService.onPostRequestDataFromApi({'limit':this.distributor_list.length,type:this.DrType},'Distributor/distributor_lists', this.dbService.rootUrlSfa).subscribe( result=>
      {
        console.log(result);
        if(result=='')
        {
          this.flag=1;
        }
        else
        {
          setTimeout(()=>{
            this.distributor_list=this.distributor_list.concat(result);
            console.log('Asyn operation has stop')
            infiniteScroll.complete();
          },1000);
        }
      });
    }



    distributor_detail(dr_id,network_type,dr_type)
    {
      // this.navCtrl.push(LeadsDetailPage,{'dr_id':dr_id,'type':dr_type,'network_type':network_type})
      this.navCtrl.push(LeadsDetailPage,{'dr_id':dr_id,'type':network_type,'dr_type':dr_type})
    }

    go_to_add_activity_page(dr_id, dr_type , network_type , company_name)
    {
      this.navCtrl.push(AddActivityPage,{'comes_from':'dr_detail_page','dr_id':dr_id, 'network_type':network_type, 'type':dr_type, 'company_name':company_name});
    }

  doRefresh (refresher)
  {
    this.search=''
    this.limit=0

      this.get_distributor_list()
      setTimeout(() => {
          refresher.complete();
      }, 1000);
  }

  }
