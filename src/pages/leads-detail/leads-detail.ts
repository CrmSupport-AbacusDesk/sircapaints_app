import { Component, TestabilityRegistry } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ModalController, LoadingController, PopoverController, ToastController } from 'ionic-angular';
import moment from 'moment';
import { CheckinDetailPage } from '../sales-app/checkin-detail/checkin-detail';
import { ExecutiveOrderDetailPage } from '../executive-order-detail/executive-order-detail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { EditDetailsPage } from '../edit-details/edit-details';
import { Storage } from '@ionic/storage';
import { AddActivityPage } from '../add-activity/add-activity';
import { ActivitydetailPage } from '../activitydetail/activitydetail';





@IonicPage()
@Component({
    selector: 'page-leads-detail',
    templateUrl: 'leads-detail.html',
})
export class LeadsDetailPage {
    dr_id:any;
    distributor_detail:any=[];
    total_checkin:any = [];
    total_order:any = [];
    type:any
    search:any={}
    date:any
    showRelatedTab:any
    ID:any;
    distributor_detaill:any={}
    secondary:any=[];
    userStorageData:any={};

    assign_dealer : any = [];

    activity_list : any = [];

    btnTab : any = 'Assign Dealer';


    constructor( private app:App,
        public navCtrl: NavController,
        private alertCtrl: AlertController,
        public dbService:DbserviceProvider,
        public modalCtrl: ModalController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public popoverCtrl: PopoverController,
        public toastCtrl:ToastController,
        public storage: Storage) {

          this.storage.get('userStorageData').then((resp)=>{
            console.log(resp);

            this.userStorageData = resp
            console.log("User Session Storage: ",this.userStorageData);

            console.log("User Type: ",this.userStorageData.user_type);
          });

            this.date = moment(this.date).format('YYYY-MM-DD');

            if(this.navParams.get('dr_id'))
            {
                this.dr_id=this.navParams.get('dr_id');
                console.log(this.dr_id);
                this.lead_detail();
            }

            if(this.navParams.get('showRelatedTab') == 'false')
            {
                this.showRelatedTab = false
            }
            else
            {
                this.showRelatedTab = true
            }
            console.log("Get Show realated tab : ",this.navParams.get('showRelatedTab'));
            console.log(this.showRelatedTab);

            if(this.navParams.get('type'))
            {
                this.type=this.navParams.get('type');
                console.log(this.type);
                this.distributor_detaill.orderType='Primary'

                this.dr_detail('Primary');
            }


            console.log('GET NAV PARAMS DATA : ',this.navParams);

            this.activity_list_info();



        }

        ionViewDidLoad() {

        }

        loading:any;
        lodingPersent()
        {
            this.loading = this.loadingCtrl.create({
                spinner: 'hide',
                content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
            });
            this.loading.present();
        }


        lead_detail()
        {
            var loading = this.loadingCtrl.create({
                spinner: 'hide',
                content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
            });
            console.log(this.search);

            loading.present()
            this.dbService.onPostRequestDataFromApi({'dr_id':this.dr_id,search:this.search},'Distributor/lead_detailexec', this.dbService.rootUrlSfa).subscribe((result)=>{
                loading.dismiss();
                console.log(result);
                this.distributor_detail = result['result'];
                this.ID = result['result']['id'];
                console.log(this.ID);

                this.total_checkin = result['total_checkin'];
                console.log(this.distributor_detail);
            });
        }

        dr_detail(type)
        {
            var loading = this.loadingCtrl.create({
                spinner: 'hide',
                content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
            });
            this.distributor_detaill.orderType = type

            console.log(this.search);
            loading.present()
            this.dbService.onPostRequestDataFromApi({'dr_id':this.dr_id,search:this.search},'Distributor/dr_detail', this.dbService.rootUrlSfa).subscribe((result)=>{
                loading.dismiss();
                console.log(result);
                this.distributor_detail = result['result'];
                // this.total_checkin = result['total_checkin'];
                this.total_order = result['Primary'];
                this.secondary = result['Secondary'];
                this.assign_dealer = result['assignDealer'];
                console.log(this.distributor_detail);

            });

        }

        checkin_list:any = [];
        load_data:any = "0";
        order_list:any=[];



        ionViewDidLeave()
        {

        }
        checkin_detail(checkin_id)
        {

            console.log(checkin_id);

            this.dbService.onPostRequestDataFromApi({'checkin_id':checkin_id},'Checkin/checkin_detail', this.dbService.rootUrlSfa).subscribe((result)=>
            {
                console.log(result);
                if(result)
                {
                    this.navCtrl.push(CheckinDetailPage,{'data':result,checkin_id:checkin_id});
                }
            })

        }
        goOnEditDetail(distributor_detail)
        {
            console.log(distributor_detail);
            this.navCtrl.push(EditDetailsPage,{lead_detail:this.distributor_detail,'from':"lead detail"});
        }
        goOnOrderDetail(id){
            this.navCtrl.push(ExecutiveOrderDetailPage,{id:id , login:'Employee'})
        }
        convertdealer()
        {
            console.log("convertdealer");
            let alert=this.alertCtrl.create({
                title:'Are You Sure?',
                subTitle: 'You want To Convert This Lead To Dealers',
                cssClass:'action-close',

                buttons: [{
                    text: 'Cancel',
                    role: 'cancel',

                },
                {
                    text:'Confirm',
                    cssClass: 'close-action-sheet',
                    handler:()=>
                    {

                        this.navCtrl.pop();
                    }
                }]
            });
            alert.present();
            console.log(this.dr_id);
            this.dbService.onPostRequestDataFromApi({'id':this.dr_id},'Distributor/convert_lead', this.dbService.rootUrlSfa).subscribe((result)=>{
                console.log(result);

            })

        }
        edit_detail()
        {
            this.navCtrl.push(EditDetailsPage,{});
        }


        go_to_add_activity_page(dr_id, dr_type , network_type , company_name)
        {
          this.navCtrl.push(AddActivityPage,{'comes_from':'dr_detail_page','dr_id':dr_id, 'network_type':network_type, 'type':dr_type, 'company_name':company_name});
        }

        go_to_dealer_detail_page(dr_id,network_type,dr_type)
        {
          this.navCtrl.push(LeadsDetailPage,{'dr_id':dr_id,'type':network_type,'dr_type':dr_type})
        }

        activity_list_info()
        {
            var loading = this.loadingCtrl.create({
                spinner: 'hide',
                content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
            });
            console.log("activity_list_info method called:");

            loading.present()
            this.dbService.onPostRequestDataFromApi({'dr_id':this.dr_id},'Followup/last_fifteen_activity_of_inside_team', this.dbService.rootUrlSfa).subscribe((result)=>{
                loading.dismiss();
                console.log("activity_list_info API response :",result);

                this.activity_list = result;
                // this.distributor_detail = result['result'];
                // this.ID = result['result']['id'];
                // console.log(this.ID);

                // this.total_checkin = result['total_checkin'];
                // console.log(this.distributor_detail);
            });
        }
        go_to_activity_detail(id){
          console.log("go_to_activity_detail method call");
          console.log(id);
          this.navCtrl.push(ActivitydetailPage,{'activity_id':id , 'from':'activity_list_page'});

        }



    }
