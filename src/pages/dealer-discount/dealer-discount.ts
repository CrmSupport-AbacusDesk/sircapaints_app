import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

@IonicPage()
@Component({
    selector: 'page-dealer-discount',
    templateUrl: 'dealer-discount.html',
})
export class DealerDiscountPage {
    norec:any=false
    today_checkin:any=[];
    user_id:any=0;
    start:any=0;
    limit:any=10;
    flag:any='';
    filter:any={};
    discount_list:any=[];
    category_list: any = [];
    show_multiple_dealer_discunt_update_section : boolean = false
    selected_category_list : any = {};
    updated_discount = '0';
    discount_type = 'not_select_anything';
    loading:any;
    
    
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public storage:Storage,
        private alertCtrl: AlertController,
        public loadingCtrl: LoadingController,
        public dbService:DbserviceProvider) {
            
            this.user_id = this.dbService.userStorageData.id;
            console.log(this.user_id);
            this.get_all_checkin();
        }
        
        ionViewDidLoad() {
            
        }
        
        ionViewWillEnter()
        {
            this.get_category_list();
        }
        
        lodingPersent()
        {
            this.loading = this.loadingCtrl.create({
                spinner: 'hide',
                content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
            });
            this.loading.present();
        }
        
        get_all_checkin()
        {
            this.dbService.onShowLoadingHandler()
            this.norec=false
            this.dbService.onPostRequestDataFromApi({user_id:this.user_id,"start":this.start,"limit":this.limit,"search":this.filter},"dealerData/get_discount", this.dbService.rootUrlSfa)
            .subscribe(resp=>{
                console.log(resp);
                this.dbService.onDismissLoadingHandler()
                this.discount_list = resp['discount_list'];
                if(this.discount_list.length==0)
                {
                    this.norec=true
                }
            },err=>
            {
                this.dbService.onDismissLoadingHandler();
                this.dbService.errToasr()
            })
        }
        
        loadData(infiniteScroll)
        {
            console.log('loading');
            this.start = this.discount_list.length;
            this.dbService.onPostRequestDataFromApi({user_id:this.user_id,"start":this.start,"limit":this.limit,"search":this.filter},"dealerData/get_discount", this.dbService.rootUrlSfa)
            .subscribe((r) =>{
                console.log(r);
                if(r['discount_list']=='')
                {
                    this.flag=1;
                }
                else
                {
                    setTimeout(()=>{
                        this.discount_list=this.discount_list.concat(r['discount_list']);
                        console.log('Asyn operation has stop')
                        infiniteScroll.complete();
                    },1000);
                }
            });
        }
        
        update_multiple_discount(){
            console.log(" update_multiple_discount method calls");
            console.log(this.selected_category_list);
            console.log(this.updated_discount);
            console.log(this.discount_type);
            
            let string = 'str'
            let title = '123'
            
            
            
            if(this.updated_discount == '' || this.updated_discount == '0'){
                string =  (this.updated_discount == '0' ? " Discount Value Should be greater than 0 (ZERO) " : " You Enter Null Discount Value" );
                title =  'Error !';
                let alert=this.alertCtrl.create({
                    title:title,
                    subTitle: string,
                    cssClass:'action-close',
                    
                    buttons: [{
                        text: 'Okay',
                        role: 'Okay',
                        handler: () => {}
                    }]
                });
                alert.present();
                
                
            }
            else if(this.updated_discount != '' && this.updated_discount != '0'){
                
                
                
                this.lodingPersent();
                this.dbService.onPostRequestDataFromApi({"category_list":this.selected_category_list,"discount_percent":this.updated_discount,"discount_type":this.discount_type},"Distributor/update_discount_multiple", this.dbService.rootUrlSfa)
                .subscribe(resp=>{
                    console.log(resp);
                    if(resp['msg'] == "success")
                    {
                        string =  'Selected Category Discount is Updated';
                        title =  'Success';
                        this.selected_category_list = {};
                        this.updated_discount = '0';
                        this.discount_type = 'not_select_anything';
                        this.loading.dismiss();
                        this.show_multiple_dealer_discunt_update_section = !this.show_multiple_dealer_discunt_update_section ;
                        
                        let alert=this.alertCtrl.create({
                            title:title,
                            subTitle: string,
                            cssClass:'action-close',
                            
                            buttons: [{
                                text: 'Okay',
                                role: 'Okay',
                                handler: () => {}
                            }]
                        });
                        alert.present();
                        this.get_all_checkin();
                    }
                    else{
                        string =  resp['msg'];
                        title =  'Error !';
                        this.selected_category_list = {};
                        this.updated_discount = '0';
                        this.discount_type = 'not_select_anything';
                        let alert=this.alertCtrl.create({
                            title:title,
                            subTitle: string,
                            cssClass:'action-close',
                            
                            buttons: [{
                                text: 'Okay',
                                role: 'Okay',
                                handler: () => {}
                            }]
                        });
                        alert.present();
                        
                        this.loading.dismiss();
                        this.show_multiple_dealer_discunt_update_section = !this.show_multiple_dealer_discunt_update_section ;
                        
                        this.get_all_checkin();
                    }
                })
                
            }
            else{
                this.dbService.errToasr();
                
            }
            
            
            
            
            
            
        }
        
        get_category_list(){
            
            this.dbService.onPostRequestDataFromApi('', 'Distributor/getCategory', this.dbService.rootUrlSfa)
            .subscribe((result) => {
                console.log(result)
                this.category_list = result['data'];
                
            });
        }
        
        
        MobileNumber(event: any)
        {
            const pattern = /[0-9\+\-\ ]/;
            let inputChar = String.fromCharCode(event.charCode);
            if (event.keyCode != 8 && !pattern.test(inputChar))
            {event.preventDefault(); }
        }
        
        
    }
    