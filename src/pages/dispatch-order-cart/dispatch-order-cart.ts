import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { Storage } from '@ionic/storage';


/**
* Generated class for the DispatchOrderCartPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-dispatch-order-cart',
  templateUrl: 'dispatch-order-cart.html',
})
export class DispatchOrderCartPage {
  
  @ViewChild('category') categorySelectable: IonicSelectableComponent;
  @ViewChild('subCategory') subcatSelectable: IonicSelectableComponent;
  @ViewChild('productCode') prod_codeSelectable: IonicSelectableComponent;
  @ViewChild('available_product_name') available_product_name_Selectable: IonicSelectableComponent;
  
  
  expand_order_detail = 0;
  expand_master_detail = 0;
  
  from:any='no_where'
  data:any={}
  categoryList:any=[];
  subCatList:any = [];
  booleanFlag : any;
  masterFlag :any = 'nothing';
  searchTrigger : boolean = true;
  form:any={};
  autocompleteItems:any=[];
  temp_product_array:any=[];
  tmpStrLen:any = 0;
  searchText:any;
  selected_product_data:any={}
  selected_product_qty:any;
  login_user_data : any = {}
  master_box_id:any='0';
  login_user_role:any='nothing'
  available_product_list_for_warehouse_user:any=[]
  
  
  
  constructor(public navCtrl: NavController,private alertCtrl: AlertController,public storage:Storage, public navParams: NavParams,public viewcontrol:ViewController,public dbService:DbserviceProvider) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad DispatchOrderCartPage');
  }
  
  
  ionViewWillEnter(){
    
    this.storage.get('userStorageData').then((storageData) => {
      this.dbService.userStorageData = storageData;
      console.log(this.dbService.userStorageData);
      this.login_user_data = this.dbService.userStorageData
      this.login_user_role = this.login_user_data.role
      
      console.log(this.navParams);
      
      console.log(this.navParams);
      console.log(this.navParams['data']['from']);
      this.from = this.navParams['data']['from'];
      
      if(this.from == "scanned_master_qr_code_detail" && this.navParams['data']['master_box_id'] && this.login_user_role =='Production Packing'){
        this.master_box_id = this.navParams['data']['master_box_id']
        this.getCategory();
      }
      
      if(this.from == "scanned_master_qr_code_detail" && this.navParams['data']['master_box_id'] && this.login_user_role =='Ware House'){
        this.master_box_id = this.navParams['data']['master_box_id']
        this.get_available_product();
      }
      
    });
    
    
  }
  
  getCategory()
  {
    this.dbService.show_loading()
    this.dbService.onPostRequestDataFromApi('','Distributor/getCategory3', this.dbService.rootUrlSfa)
    .subscribe((result)=>
    {
      this.dbService.dismiss_loading();
      console.log(result)
      this.categoryList = result['data'];
      
    },err=>
    {
      this.dbService.dismiss_loading();
      this.dbService.errToasr();
    });
  }
  
  
  get_available_product()
  {
    this.dbService.show_loading()
    this.dbService.onPostRequestDataFromApi('','BoxPackaging/manual_entry_product_available_in_ware_house', this.dbService.rootUrlSfa).subscribe((result)=>{
      this.dbService.dismiss_loading();
      console.log(result)
      this.available_product_list_for_warehouse_user = result['available_product_list'];
      
      for(let i=0;i<this.available_product_list_for_warehouse_user.length;i++){
        this.available_product_list_for_warehouse_user[i].product_name = this.available_product_list_for_warehouse_user[i].product_name +' | '+ this.available_product_list_for_warehouse_user[i].total_item_qty
      }
      
    },err=>
    {
      this.dbService.dismiss_loading();
      this.dbService.errToasr();
    });
  }
  
  getSubCategory(cat)
  {
    this.subCatList = {};
    console.log(cat)
    console.log(this.booleanFlag);
    console.log(this.data.cat_no);
    
    if((cat['product_name'].search(' | ') != -1) && this.masterFlag != 'product' ){
      console.log("in if condition");
      let avr = cat['product_name'].indexOf(' | ');
      cat['product_name'] = cat['product_name'].substring(0,avr);
    }
    console.log(cat)
    this.data.sub_category={};
    this.form.category = cat.category;
    // this.product.category = cat.category;
    this.dbService.onPostRequestDataFromApi({category:cat.category},'Distributor/getSubCategory', this.dbService.rootUrlSfa).subscribe((result)=>{
      
      console.log(result)
      this.subCatList = result['data'];
      if(this.booleanFlag == false && this.masterFlag != 'product'){
        console.log("in if condition");
        this.searchTrigger=true;
        this.data.sub_category= this.subCatList.filter(row=>row.sub_category == cat.subcategory);
        this.data.sub_category=this.data.sub_category[0];                        
        this.getProductCode(this.data.sub_category)
        this.data.cat_no=cat;
        // this.get_product_data();
        // this.loading.dismiss();
      } 
      
      
      
      else if(this.subCatList.length==1)
      {
        this.data.sub_category = this.subCatList[0]
        this.getProductCode(this.data.sub_category)
      }
      else
      {
        // this.subcatSelectable.open();
      }
    },err=>{
      
    })
  }
  
  getProductCode(sub_category)
  {
    console.log(sub_category);
    this.form.sub_category = sub_category.sub_category;
    this.dbService.onShowLoadingHandler()
    this.dbService.onPostRequestDataFromApi({categoryId:sub_category.id},"product/product_code", this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);
      this.autocompleteItems=result;
      this.temp_product_array = this.autocompleteItems;
      
      console.log(this.autocompleteItems);
      setTimeout(() => {
        this.dbService.onDismissLoadingHandler()
        // this.prod_codeSelectable.open();
      }, 1000);
    },err=>
    {
      this.dbService.onDismissLoadingHandler()
    });
  }
  
  master_search(event,type){
    
    console.log(type);
    console.log(event);
    console.log(this.searchTrigger);
    console.log(event.text);
    
    console.log(this.data.category);
    
    
    if (event.text == '') {
      
    }
    
    else if(type=='category')
    {
      this.masterFlag='nothing';
      
      let txtLength = (event.text).length;
      console.log(txtLength);
      
      console.log("in else");   
      if (event.text == '') {
        this.searchTrigger=true;
        this.getCategory();
        
      }
      
      else if((this.tmpStrLen != 0) && (this.tmpStrLen > txtLength)){
        this.searchTrigger=true;
        this.getCategory();
        this.tmpStrLen = txtLength;
        this.searchText='';
        this.data.category['category']='';
        this.data.category['cat_no']='';
        this.data.category['id']='';
        this.data.category['product_name']='';
        this.data.category['subcategory']='';
      }
      
      else {
        
        if(this.searchText == event.text){
          this.tmpStrLen = (this.searchText).length
          console.log(this.tmpStrLen);                        
          this.searchTrigger=true;
          this.getCategory();
        }
        else{ 
          if( this.data.category){
            
            this.data.category['category']='';
            this.data.category['cat_no']='';
            this.data.category['id']='';
            this.data.category['product_name']='';
            this.data.category['subcategory']='';
          }
          console.log(this.data.category);
          
          this.searchTrigger=false;
          this.searchText = event.text;
          this.dbService.onPostRequestDataFromApi({ masterSearch: event.text }, "product/product_code", this.dbService.rootUrlSfa)
          .subscribe((result) => {
            console.log(result);
            this.categoryList=result;
            console.log(this.categoryList);
            for(let i=0;i<this.categoryList.length;i++){
              this.categoryList[i].product_name = this.categoryList[i].product_name +' | '+ this.categoryList[i].subcategory
            }
            console.log(this.categoryList);
            setTimeout(() => {
              
            }, 1000);
          }, err => {
          });                    
        }   
      } 
    }
  }
  
  MobileNumber1(event: any) {
    console.log('Decimal Restrit');
    
    const charCode = (event.which) ? event.which : event.keyCode;
    console.log(charCode);
    
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
    
  }
  
  save_item_data(){
    console.log("save_item_data method calls");
    
    
    console.log("data = ");
    console.log(this.data);
    console.log('selected_product_qty = '+this.selected_product_qty);
    
    if(this.login_user_role == 'Ware House'){
      
      if((this.data.cat_no['product_name'].search(' | ') != -1)){
        console.log("in if condition");
        let avr = this.data.cat_no['product_name'].indexOf(' | ');
        this.data.cat_no['product_name'] = this.data.cat_no['product_name'].substring(0,avr);
        this.data.cat_no['id']=this.data.cat_no['product_id']
        console.log(this.data);
        
      }
      
    }
    
    this.dbService.onPostRequestDataFromApi({"product_id":this.data.cat_no.id,"product_name":this.data.cat_no.product_name,'item_qty':this.selected_product_qty,'master_box_id':this.master_box_id},"BoxPackaging/manual_mapping_of_product_with_master_box", this.dbService.rootUrlSfa).subscribe(resp=>{
      console.log(resp);
      if(resp['msg'] == 'Sync Successfully'){
        
        this.data = {};
        this.selected_product_qty = ''
        this.navCtrl.pop();
        
      }
      
    })
    
    
    
    
  }
  
  
  check_qty(){
    console.log("check_qty method calls");
    console.log(this.data.cat_no['total_item_qty']);
    console.log(this.selected_product_qty);
    
    console.log(typeof(this.data.cat_no['total_item_qty']));
    console.log(typeof(this.selected_product_qty));
    
    if( parseInt(this.selected_product_qty) <= parseInt(this.data.cat_no['total_item_qty'])){
      return true
    }
    else{
      
      const again_show_alert = this.alertCtrl.create({
        title: 'Error. . .',
        message: 'Enter Qty less than or equal to '+this.data.cat_no['total_item_qty'],
        buttons: [
          {
            text: 'OK',
            handler: () => {
              console.log('Cancel clicked');
              console.log("again_show_alert No Clicked");
              return 
            }
          },
        ]
      })
      again_show_alert.present();
      return false
      
    }
    
    
  }
  
  
  // only for testing purpose
  test(){
    console.log("in test");
    console.log(this.data);
    
    
  }
  
}
