import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { QuotationDistributorPage } from '../quotation-distributor/quotation-distributor';

/**
 * Generated class for the AddQuotationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-quotation',
  templateUrl: 'add-quotation.html',
})
export class AddQuotationPage {
  @ViewChild('category') categorySelectable: IonicSelectableComponent;
  @ViewChild('selectComponent') dealerSelectable: IonicSelectableComponent;
  
  user_data: any = {};
  dealerListArray: any = [];
  categoryList: any = [];
  subCategoryList: any = [];
  itemNameList: any = [];
  forms: any = {};
  paymentStatusArray:any=[];
  product: any = {};
  dr_id: any = '';
  dr_name:any='';
  master_packing:any;
  std_packing:any;
  totalQty:any=0;
  check_qty_flag:boolean=false;
  type:any='';
  cart_array:any=[];
  grand_amt:any={};
  sub_total:any=0;
  dis_amt:any=0;
  gst_amount:any=0;
  net_total:any=0;
  spcl_dis_amt:any=0
  grand_total:any=0;
  special_discount:any=0;
  show_price:any = false;
  order_lock:any = false;
  edit_terms:boolean=false;
  from:any='';
  className:string='';
  className2:string='';
  className3:string='';
  className4:string='';
  loginType:any='';
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dbService: DbserviceProvider,
    public storage: Storage,
    public alertCtrl:AlertController,
    public toastCtrl:ToastController,
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddQuotationPage');
    console.log(this.dbService.userStorageData);
    this.dr_id=this.dbService.userStorageData.id;
    this.dr_name=this.dbService.userStorageData.displayName;
    this.loginType=this.dbService.userStorageData.user_type;
    console.log(this.dr_name);
      console.log(this.navParams.data);
      this.from=this.navParams.data.from;
      console.log(this.from);

    if(this.from=='quotation_details'){
      this.user_data=this.navParams.data['quotation_details'];
      console.log(this.user_data);
      this.totalQty=this.user_data.total_quantity;
      this.sub_total=this.user_data.sub_total;
      this.dis_amt=this.user_data.dis_amt;
      this.net_total=this.user_data.net_total;
      this.grand_total=this.user_data.grand_total;

      this.cart_array=this.navParams.data['quotation_summary'];
      console.log(this.cart_array);
      
    }

    // this.dealerList();
    this.categoryListFunction();
    this.paymentStatusArray=[
      {id:'1', value:'Advance Payment',payment_type:'Advance Payment'},
      {id:'2', value:'After 10 days of dispatch',payment_type:'After dispatch'},
      {id:'3', value:'After 30 days of dispatch at the time of add order',payment_type:'After 30 days of dispatch at the time of add order'}        
];
  if(this.from != 'quotation_details'){
  // this.openDealer();
   this.termCondition();
   this.get_details();
  }
  }

  openDealer(){
    this.dealerSelectable.open();
  }

  categoryListFunction() {
    console.log("category List method Called");
    this.categoryList = [];
    this.dbService.onShowLoadingHandler()

    this.dbService.onPostRequestDataFromApi({}, 'Distributor/getCategory3', this.dbService.rootUrlSfa).subscribe((r) => {
      console.log(r);
      this.categoryList = r['data'];
      setTimeout(() => {
      this.dbService.onDismissLoadingHandler();
        
      }, 1000);
    })
  }

  // dealerList() {
  //   this.dbService.onShowLoadingHandler();
  //   console.log("dealer list function called");
  //   this.dbService.onPostRequestDataFromApi({ 'dr_id': this.dr_id }, 'dealerData/get_assign_dealer', this.dbService.rootUrlSfa).subscribe((res) => {
  //     console.log(res);
  //     this.dealerListArray = res['dr_list'];
  //     setTimeout(() => {
  //       this.dbService.onDismissLoadingHandler();
  //     }, 1000);
  //   });
  // };

  getSubCategoryListFunction(categoryarray) {
    console.log("sub Category list method called");
    console.log(categoryarray.category);
    this.subCategoryList = [];
    this.dbService.onShowLoadingHandler();
    this.dbService.onPostRequestDataFromApi({ 'category': categoryarray.category }, 'Distributor/getSubCategory', this.dbService.rootUrlSfa).subscribe((res) => {
      console.log(res);
      this.subCategoryList = res['data'];

    });
    setTimeout(() => {
      this.dbService.onDismissLoadingHandler();
    }, 1000);
  }

  getProductCode(subCategory) {
    console.log("product Code methods Called");
    console.log(subCategory);
    this.dbService.onShowLoadingHandler();

    this.itemNameList = [];
    this.dbService.onPostRequestDataFromApi({ 'categoryId': subCategory.id }, 'product/product_code', this.dbService.rootUrlSfa).subscribe((test) => {
      console.log(test);
      this.itemNameList = test;
      setTimeout(() => {
        this.dbService.onDismissLoadingHandler();
      }, 1000);
    })
  }

  get_product_data(catNo) {
    console.log("Get Product Data Methods Called");
    console.log(catNo);
    // console.log(this.user_data.dealer.id);
    console.log(this.user_data);
    // this.form.user_state = this.user_data.state;
    // this.form.user_district = this.user_data.district;
    // this.form.user_id = this.user_data.id
    // this.form.user_type = this.user_data.type
    this.forms = {
        'cat_no': catNo.cat_no,
        'category': catNo.category,
        'product_id': catNo.id,
        'product_name': catNo.product_name,
        // 'selected_dr_id': this.user_data.dealer.id,
        'sub_category': catNo.subcategory,
        // 'user_id': this.user_data.dealer.id,
        'user_type':"3",
    }
    this.dbService.onShowLoadingHandler();
    this.dbService.onPostRequestDataFromApi({'form':this.forms}, 'dealerData/get_product_data_for_quotaion', this.dbService.rootUrlSfa).subscribe((result) => {
      console.log(result);
      if(result['prod_price'])
      {
        this.show_price = true;

          this.product = result['prod_price'];
          console.log(this.product);
          
          // this.user_data.category= {'category':this.product['brand']};
          // this.user_data.sub_category= {'product_name':this.product['product_name']};
          
          this.master_packing =result['prod_price']['master_packing'];
          console.log( this.master_packing);
          this.std_packing =result['prod_price']['std_packing'];

          this.product.sub_category = this.forms.sub_category;
          this.product.cat_no=this.forms.cat_no;
          this.product.product_name=this.forms.product_name;
      }
      setTimeout(() => {
        this.dbService.onDismissLoadingHandler();
      }, 1000);
      
    });
  }

  mobileNumber(event:any){
    if(!/[0-9]/.test(event.key)){
      return false;
    }
    return true;
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
  calculate_amt(type){
    console.log(type);
    console.log(typeof(this.product.qty));
    console.log(this.product.cartoon_packing);
    console.log(this.product.cartoon_qty);
    if(type=='cartoon_qty'){
      this.product.qty= (this.product.cartoon_packing*this.product.cartoon_qty);
      console.log(this.product.qty);

    }
    console.log(this.product);
    this.product.discount_amount = 0;
    this.product.subTotal = 0;
    this.product.discountedAmount = 0;
    console.log(this.product.qty);

    if(this.product.qty==null){
      this.product.qty=0;
    }
    this.product.subTotal=(this.product.price)*(this.product.qty);

    if(this.product.discount){
      this.product.discount_amount = (this.product.price * this.product.discount)/100;
    }
    this.product.discountedAmount = parseFloat(this.product.price) - parseFloat(this.product.discount_amount);
    

    this.product.subtotal_discount = this.product.discount_amount * this.product.qty;

    this.product.subtotal_discounted = this.product.discountedAmount * this.product.qty;
    console.log(this.product.subtotal_discounted);

    this.product.subtotal_discounted  = this.product.subtotal_discounted.toFixed(2)


  }
  calculate_amt1(type){

    console.log(type);

    console.log(typeof(this.product.qty));
    console.log(this.product.cartoon_packing);
    console.log(this.product.cartoon_qty);
    if(type == 'cartoon_qty'){
        this.product.qty= (this.product.cartoon_packing*this.product.cartoon_qty  )
        console.log(this.product.qty);
    }
    console.log(this.product);
    this.product.discount_amount=0;
    this.product.subTotal=0;
    this.product.discountedAmount= 0;
    console.log(this.product.qty);
    // if(this.product.qty){
    //     if((this.product.qty).contains('.'))
    //     {
    //         this.product.subtotal_discounted=''
    //         this.product.qty = ''
    //         this.dbService.presentToast('Fraction values not allowed !!');
    //         console.log(this.product.qty  + 'Int Quantity');
    //         return ;
    //     }
    //     else{

    //     }
    // }

    if(this.product.qty == null)
    {
        this.product.qty = 0;
    }


    this.product.subTotal = (this.product.price)*(this.product.qty);

    if(this.product.discount)
    {
        this.product.discount_amount = (this.product.price * this.product.discount)/100;
    }

    this.product.discountedAmount = parseFloat(this.product.price) - parseFloat(this.product.discount_amount)
    console.log(this.product.discountedAmount);

    this.product.subtotal_discount = this.product.discount_amount * this.product.qty;

    this.product.subtotal_discounted = this.product.discountedAmount * this.product.qty;
    console.log(this.product.subtotal_discounted);

    this.product.subtotal_discounted  = this.product.subtotal_discounted.toFixed(2);





  }

  addToCart(qty){
    console.log("in add to cart if condition");
    console.log(this.product);
    console.log(this.cart_array);

    if(this.cart_array.length == 0)
    {
        this.cart_array.push(this.product);
    }
    else
    {
        var flag = true;
        this.cart_array.forEach(element => {

            if(this.product.category == element.category && this.product.sub_category == element.sub_category && (this.product.cat_no == element.cat_no || this.product.material_code == element.material_code ))
            {
                // element.discount_amount= parseFloat(element.discount_amount) + parseFloat(this.product.discount_amount);
                element.subTotal=parseFloat(element.subTotal) + parseFloat(this.product.subTotal);
                // element.discountedAmount= parseFloat(element.discountedAmount) + parseFloat(this.product.discountedAmount);
                element.subtotal_discount= parseFloat(element.subtotal_discount) + parseFloat(this.product.subtotal_discount);
                element.subtotal_discount= parseFloat(element.subtotal_discount) + parseFloat(this.product.subtotal_discount);
                element.subtotal_discounted= parseFloat(element.subtotal_discounted) + parseFloat(this.product.subtotal_discounted);
                element.qty= parseFloat(element.qty) + parseFloat(this.product.qty);
                flag = false;
            }
        });

        if(flag)
        {
            this.cart_array.push(this.product);
        }
    }
    this.user_data.cat_no = {};
    this.show_price = false;

    console.log(this.cart_array);
    
    this.cal_grand_total();
    this.totalQty=parseInt(this.totalQty)+parseInt(qty);
    console.log(this.totalQty);

    // if(this.check_qty() == false){
    
    // }

    // else{
    //     console.log("in add to cart else condition");

    // }
    


    }

    check_qty(){
      console.log(this.product);
      console.log(this.product.qty);
      console.log('in check_qty');
      if(this.std_packing != ''){
          console.log('in check_qty if');
          console.log( parseInt(this.product.qty)% parseInt(this.std_packing));

          if(parseInt(this.product.qty)% parseInt(this.std_packing) == 0 )
          {
              this.check_qty_flag = false
          }
          else{
              this.check_qty_flag = true
              if(this.product.qty != ''){
                  // this.dbService.presentToast(" Qty should be in multiple of "+ this.std_packing);

                  let alert=this.alertCtrl.create({
                      title:'Error !',
                      subTitle: 'Qty should be in multiple of box packing - '+ this.std_packing,
                      cssClass:'action-close',

                      buttons: [{
                          text: 'Okay',
                          role: 'Okay',
                          handler: () => {

                          }},
                      ]
                  });
                  alert.present();
                  return

              }

          }

      }
      else{
          this.check_qty_flag = false
      }

      return this.check_qty_flag;

  }

  cal_grand_total()
  {
      console.log(this.type);

      this.sub_total = parseFloat(this.sub_total) + parseFloat(this.product.subTotal);
      this.dis_amt = parseFloat(this.dis_amt) + (parseFloat(this.product.subtotal_discount));
      this.net_total = parseFloat(this.net_total) + parseFloat(this.product.subtotal_discounted);
      console.log(this.special_discount);

      this.spcl_dis_amt = (this.net_total * this.special_discount)/100;
      console.log(this.spcl_dis_amt);

      if(this.type=='Discount')
      {
          this.grand_total = Math.round(this.net_total - this.spcl_dis_amt);
      }else
      {
          this.grand_total = Math.round(this.net_total + this.spcl_dis_amt);
      }
      console.log(this.sub_total);
      console.log(this.dis_amt);
      console.log(this.gst_amount);
      console.log(this.grand_total);
      console.log(this.net_total - this.spcl_dis_amt);
  } 

  deleteItemFromCartAlertMessage(index,delQty)
  {
      let alert=this.alertCtrl.create({
          title:'Are You Sure?',
          subTitle: 'You want to remove this item ??',
          cssClass:'action-close',

          buttons: [{
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                  this.dbService.presentToast('Action Cancelled')
              }
          },
          {
              text:'Confirm',
              cssClass: 'close-action-sheet',
              handler:()=>
              { this.totalQty=this.totalQty-delQty;
                  this.deleteItemFromCart(index)
              }
          }]
      });
      alert.present();
  }

  deleteItemFromCart(index)
  {
      this.sub_total = parseFloat(this.sub_total) -  parseFloat(this.cart_array[index].subTotal) ;
   
      this.dis_amt = parseFloat(this.dis_amt) -  parseFloat(this.cart_array[index].subtotal_discount) ;

      this.net_total = parseFloat(this.net_total) -  parseFloat(this.cart_array[index].subtotal_discounted) ;

      this.spcl_dis_amt = (this.net_total * this.special_discount)/100;

      if(this.type=='Discount')
      {
          this.grand_total = Math.round(this.net_total - this.spcl_dis_amt);
      }else
      {
          this.grand_total = Math.round(this.net_total + this.spcl_dis_amt);
      }

      this.cart_array.splice(index,1);
      
      this.dbService.presentToast('Item removed !!')
  }

  openCategory2(){
    this.categorySelectable.open();
  }

  save_orderalert(type)
  {
      var str
      console.log(this.grand_total);

      if(this.grand_total > 20000000)
      {
          let alert=this.alertCtrl.create({
              title:'Max Quotation Order value reached',
              subTitle: 'Maximum Quotation Order value is 2 Cr. !',
              cssClass:'action-close',

              buttons: [{
                  text: 'Okay',
                  role: 'Okay',
                  handler: () => {

                  }
              },
          ]
      });
      alert.present();
      return
  }
  if(type=='save')
  {
      str = 'You want to save this order as draft ?'
  }
  else
  {
      str = 'You want to submit Quotation ?'
  }
  if(this.from!='quotation_details'){
    let alert=this.alertCtrl.create({
      title:'Are You Sure?',
      subTitle: str,
      cssClass:'action-close',

      buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
      },
      {
          text:'Confirm',
          cssClass: 'close-action-sheet',
          handler:()=>
          {
              this.order_lock = true;
              this.save_order(type)
          }
      }]
  });
  alert.present();
  }
  if(this.from=='quotation_details'){
    let alert=this.alertCtrl.create({
      title:'Are You Sure?',
      subTitle: str,
      cssClass:'action-close',

      buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
      },
      {
          text:'Confirm',
          cssClass: 'close-action-sheet',
          handler:()=>
          {
              this.order_lock = true;
              this.save_quotation_from_details(type)
          }
      }]
  });
  alert.present();
  }


}

save_quotation_from_details(type){
  console.log(type);
  console.log(this.user_data);
  console.log(this.cart_array);
 
  this.dbService.onShowLoadingHandler();

  // if(!this.user_data.dealer.id){
  //   let toast = this.toastCtrl.create({
  //     message:'Please Select Dealer !',
  //     duration:3000
  //   });
  //   toast.present();
  //   return;
  // }
  var orderData = {
    'sub_total':this.sub_total,
    'dis_amt':this.dis_amt,
    'grand_total':this.grand_total,
    'net_total':this.net_total,
    'totalQty':this.totalQty,
    
  };
  this.dbService.onPostRequestDataFromApi({"cart_data":this.cart_array,"user_data":this.user_data,'orderData':orderData,'login_id':this.dr_id, 'login_name':this.dr_name },'dealerData/quotationEdit',this.dbService.rootUrlSfa).subscribe((res)=>{
    console.log(res);

      if(res['message'] == "Quotation updated sucessfully"){
        var toastString=''
        toastString='Quotation Updated Successfully !'
        // this.navCtrl.pop();
        this.navCtrl.push(QuotationDistributorPage);
        this.dbService.presentToast(toastString);

      }
      setTimeout(() => {
        this.dbService.onDismissLoadingHandler();
      }, 1000);
  });

}

      save_order(type){
          console.log(type);
          console.log(this.user_data);
          console.log(this.cart_array);
          // if(!this.user_data.name && !this.user_data.company_name && !this.user_data.contact_no && !this.user_data.email_id && !this.user_data.customer_billing_address){
          //   let toast = this.toastCtrl.create({
          //     message:'Please Fill * Required Fields',
          //     duration:6000
          //   });
          //   toast.present();
          //   return ;
          // }
          this.dbService.onShowLoadingHandler();
        
       
          var orderData = {
            'sub_total':this.sub_total,
            'dis_amt':this.dis_amt,
            'grand_total':this.grand_total,
            'net_total':this.net_total,
            'totalQty':this.totalQty,
            
          };
          this.dbService.onPostRequestDataFromApi({"cart_data":this.cart_array,"user_data":this.user_data,'orderData':orderData,'login_id':this.dr_id, 'login_name':this.dr_name },'dealerData/quotationAdd',this.dbService.rootUrlSfa).subscribe((res)=>{
            console.log(res);

              if(res['message'] == "Quotation added sucessfully"){
                var toastString=''
                toastString='Quotation Added Successfully !'
                this.navCtrl.pop();
                // this.navCtrl.push(QuotationDistributorPage);
                this.dbService.presentToast(toastString);

              }
              setTimeout(() => {
                this.dbService.onDismissLoadingHandler();
              }, 1000);
          });

      }

        termCondition(){
          console.log("Term and Conditions Called");
          this.dbService.onPostRequestDataFromApi({},'dealerData/get_policy',this.dbService.rootUrlSfa).subscribe((resp)=>{
            console.log(resp);
            if(resp){
              this.user_data.term_condition=resp['policy_data'].term_condition;
              console.log(this.user_data.term_condition);
              
            }
          });
        }
        changeTermAndCondtion(event){
          console.log(event.checked);
          this.edit_terms=true

          // if(event.checked==true){
          //   this.edit_terms=true
          // }else{
          //   this.edit_terms=false;
          // }
        }

        presentAlert(discount){
          console.log(discount);
            if(discount > 100){
              let alert= this.alertCtrl.create({
                title: 'Alert',
                subTitle:'Discount Cannot be Greater Than 100.',
                buttons:['dismiss']
              });
              alert.present();
             return (
              this.product.discount=0,
              this.calculate_amt1('qty')
             )
            }
        }

        errorShowEmail(data){
          let regex=/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
          if(!regex.test(data)){
            let alert= this.alertCtrl.create({
              title:'Oops.. Wrong Email Format..',
              subTitle:'Please Enter Email Again..',
              buttons:['dismiss']
            });
            alert.present();
          }
        }
       
        focusError(data){
          if(!data){
            this.order_lock = true;

            this.className='cs-error'
          }else{
            this.order_lock = false;

            this.className='';
          }
        }
        focusError2(data){
          if(!data){
            this.order_lock = true;

            this.className2='cs-error'
          }else{
            this.order_lock = false;

            this.className2='';
          }
        }
        focusError3(data){
          console.log(data.length);
          
          if(!data || data.length!=10){
            this.order_lock = true;
            this.className3='cs-error'
          }else{
            this.order_lock = false;
            this.className3='';
          }
        }

        focusError4(data){
          if(!data){
            
            this.className4='cs-error'
          }else{
            this.className4='';
          }
        }

        get_details()
        {
            this.dbService.onShowLoadingHandler();
            this.dbService.onPostRequestDataFromApi({"dr_id":this.dr_id,"type":this.loginType},"dealerData/getdetails", this.dbService.rootUrlSfa)
            .subscribe(resp=>{
                console.log(resp);
                this.user_data.customer_billing_address=resp.address_data;
                console.log(this.user_data.customer_billing_address);
                
    
            },err=>
            {
                this.dbService.onDismissLoadingHandler();
    
            });
    
        }

}
