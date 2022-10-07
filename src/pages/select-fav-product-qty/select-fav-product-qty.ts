import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { DealerAddorderPage } from '../dealer-addorder/dealer-addorder';


/**
* Generated class for the SelectFavProductQtyPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-select-fav-product-qty',
  templateUrl: 'select-fav-product-qty.html',
})
export class SelectFavProductQtyPage {
  fav_product_data_array: any = [];
  filter:any = {};
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public dbService: DbserviceProvider,private alertCtrl: AlertController) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectFavProductQtyPage');
  }
  
  ionViewWillEnter(){
    console.log(this.navParams);
    if(this.navParams['data']['from'] == "fav_product_page"){
      this.get_fav_product_data();
    }
  }
  
  get_fav_product_data() {
    this.dbService.show_loading()
    console.log("get_fav_product_data method calls");
    this.dbService.onPostRequestDataFromApi({}, 'dealerData/fav_product_to_save_order', this.dbService.rootUrlSfa).subscribe((result) => {
      console.log(result);
      this.fav_product_data_array = result;
      this.dbService.dismiss_loading();
      
    })
    
    
  }
  
  remove_item(){
    console.log("remove_item method calls");
    
  }
  
  only_number_allowed_validation(event: any) {
    console.log('only_number_allowed_validation method calls');
    
    const charCode = (event.which) ? event.which : event.keyCode;
    console.log(charCode);
    
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
    
  }
  
  calculate_amt(type,index) {
    console.log(type);
    
    console.log(this.fav_product_data_array);
    console.log(this.fav_product_data_array[index]);
    
    
    if(type == 'carton_qty' && this.fav_product_data_array[index].selected_carton_qty!=''){
      this.fav_product_data_array[index].selected_qty= (parseInt(this.fav_product_data_array[index].selected_carton_qty) * parseInt(this.fav_product_data_array[index].cartoon_packing)  )
      console.log(this.fav_product_data_array[index].selected_qty);
    }
    
    this.fav_product_data_array[index].selected_carton_qty==''?this.fav_product_data_array[index].selected_qty = 0: '';
    
    console.log(this.fav_product_data_array);
    
    
    
  }
  
  go_to(where){
    console.log("go_to method calls");
    console.log("where = "+ where);
    let check_qty_secondary_flag = 0;
    
    if(this.select_at_least_one_qty_error_check()){
      let alert=this.alertCtrl.create({
        title:'Error !',
        subTitle: 'Fill Qty of at least 1 product',
        cssClass:'action-close',
        
        buttons: [{
          text: 'Okay',
          role: 'Okay',
          handler: () => {
          }
        },]
      });
      alert.present();
      
    }
    else{
      
      for(let index = 0;index<this.fav_product_data_array.length;index++){
        (this.check_qty(this.fav_product_data_array[index].std_packing,this.fav_product_data_array[index].selected_qty,this.fav_product_data_array[index].product_name,check_qty_secondary_flag)) ? (check_qty_secondary_flag = check_qty_secondary_flag+1) : '';
        console.log(check_qty_secondary_flag);
        if(check_qty_secondary_flag>0){
          break;
        }
        
      }
      
      if(where == 'add_order' && check_qty_secondary_flag == 0){
        
        let secondary_temporary_index = -1;
        
        do {
          secondary_temporary_index = this.fav_product_data_array.findIndex(row => !row.selected_qty || row.selected_qty=='' || row.selected_qty== 0 || row.selected_qty== null || row.selected_qty== undefined);
          (secondary_temporary_index != -1 ? this.fav_product_data_array.splice(secondary_temporary_index, 1) : '');
          
        } while(secondary_temporary_index>=0);
        
        console.log(this.fav_product_data_array);
        
        this.navCtrl.push(DealerAddorderPage,{'from':'select-fav-product-qty','fav_product_data_array':this.fav_product_data_array});
      }
      
      // else{
      //   let alert=this.alertCtrl.create({
      //     title:'Error !',
      //     subTitle: 'Somethong Went Wrong Please Try Again',
      //     cssClass:'action-close',
      
      //     buttons: [{
      //       text: 'Okay',
      //       role: 'Okay',
      //       handler: () => {
      //       }
      //     },]
      //   });
      //   alert.present();
      // }
      
    }
    
  }
  
  
  check_qty(box_packing,selected_qty,product_name,check_qty_secondary_flag){
    console.log('in check_qty');
    
    console.log('box_packing = '+box_packing);
    console.log('selected_qty = '+selected_qty);
    
    console.log('type of box_packing = '+typeof(box_packing));
    console.log('type of selected_qty = '+typeof(selected_qty));
    
    let check_qty_flag = true;
    console.log(check_qty_secondary_flag);
    
    if(box_packing != '' &&  selected_qty!= undefined && check_qty_secondary_flag == 0 && selected_qty!= '')
    { 
      console.log('in check_qty if');
      console.log( parseInt(selected_qty)% parseInt(box_packing));
      
      if(parseInt(selected_qty)% parseInt(box_packing) == 0 )
      {
        check_qty_flag = false
      }
      else{
        check_qty_flag = true
        if(selected_qty != ''){
          
          let alert=this.alertCtrl.create({
            title:'Error !',
            subTitle: product_name+' Qty should be in multiple of box packing -'+ box_packing,
            cssClass:'action-close',
            
            buttons: [{
              text: 'Okay',
              role: 'Okay',
              handler: () => {
                
              }
            },]
          });
          alert.present();
          
        }
        
      }
    }
    else{
      check_qty_flag = false
    }
    return check_qty_flag;
  }
  
  select_at_least_one_qty_error_check(){
    console.log("select_at_least_one_qty_error_check method calls");
    let temporary_index = this.fav_product_data_array.findIndex(row => row.selected_qty && row.selected_qty!='' && row.selected_qty!= 0);
    return (temporary_index == -1 ?true:false) ;
  }
  
  get_filter_order_item(){
    console.log("get_filter_order_item method calls");
    console.log(this.filter);

    

    
    
  }
  
}




