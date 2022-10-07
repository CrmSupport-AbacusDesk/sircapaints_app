import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ActionSheetController, AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import moment from 'moment';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';

/**
* Generated class for the ExpenseAddPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-expense-add',
  templateUrl: 'expense-add.html',
})
export class ExpenseAddPage {
  
  expand_local: any = false;
  expand_travel: any = false;
  expand_food: any = false;
  expand_hotel: any = false;
  expand_misc: any = false;
  expense: any = {
    local_conveyance_expense_total_amount : 0,
    travelEntitlementAmt : 0,
    expense_total_amount : 0,
    hotel_expense_total_amount : 0,
    food_expense_total_amount : 0,
    misc_expense_total_amount : 0,
    food_amount:0
  };
  localConvForm: any = {};
  allowanceData: any = {};
  today_date = new Date().toISOString().slice(0, 10);
  local_conveyance_expense_data: any = [];
  image_data: any = [];
  image: any = '';
  travel_expense_data: any = {};
  travel_expense_data_list: any = [];
  hotel_expense_data: any = {};
  hotel_expense_data_list: any = [];
  food_expense_data: any = {};
  food_expense_data_list: any = [];
  misc_expense_data: any = {};
  misc_expense_data_list: any = [];
  
  
  
  
  
  
  
  
  constructor(public navCtrl: NavController,private alertCtrl: AlertController,private camera: Camera,public actionSheetController: ActionSheetController, public navParams: NavParams,public dbService:DbserviceProvider) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpenseAddPage');
  }
  
  ionViewWillEnter()
  {
    this.get_allowance_Data();
  }
  
  add_expense(type){                                                // add expense in list
    
    console.log("add_expense method calls");
    if(type == 'local'){
      console.log("type == "+type);
      console.log(this.localConvForm);
      this.localConvForm.distance = !this.localConvForm.distance || this.localConvForm.distance == '' ? '--' : this.localConvForm.distance;

      this.local_conveyance_expense_data.push(this.localConvForm);
      if(this.localConvForm.food_amount && this.localConvForm.food_amount!=''){
      this.expense.local_conveyance_expense_total_amount += parseInt(this.localConvForm.amount)+parseInt(this.localConvForm.food_amount);

      }else{
        this.expense.local_conveyance_expense_total_amount += parseInt(this.localConvForm.amount);

      }
      // this.expense.food_amount += parseInt(this.localConvForm.food_amount);
      this.localConvForm = {};
      setTimeout(() => {
        this.localConvForm.modeOfTravel = '';
        this.localConvForm.travelClass = '';
        this.localConvForm.date = '';
        this.localConvForm.distance = '';
        this.localConvForm.amount = '';
        this.localConvForm.food_amount = '';
        this.localConvForm.remark = '';
      }, 500);
      console.log(this.localConvForm);
      console.log(this.local_conveyance_expense_data);
      
    }
    
    else if(type == 'travel'){
      console.log("type == "+type);
      console.log(this.travel_expense_data);

      this.travel_expense_data.distance = !this.travel_expense_data.distance || this.travel_expense_data.distance == '' ? '--' : this.travel_expense_data.distance
      
      this.travel_expense_data_list.push(this.travel_expense_data);
      this.expense.travelEntitlementAmt += parseInt(this.travel_expense_data.ticket_amount);
      this.travel_expense_data = {};
      setTimeout(() => {
        this.travel_expense_data.depatureDate = '';
        this.travel_expense_data.depatureTime = '';
        this.travel_expense_data.depatureStation = '';
        this.travel_expense_data.arrivalDate = '';
        this.travel_expense_data.arrivalTime = '';
        this.travel_expense_data.arrivalStation = '';
        this.travel_expense_data.travelMode = '';
        this.travel_expense_data.travelClass = '';
        this.travel_expense_data.ticket = '';
        this.travel_expense_data.ticket_amount = '';
        this.travel_expense_data.distance = '';
      }, 500);
      
      console.log(this.travel_expense_data);
      console.log(this.travel_expense_data_list);
      
    }
    
    else if(type == 'hotel'){
      console.log("type == "+type);
      console.log(this.hotel_expense_data);
      
      this.hotel_expense_data_list.push(this.hotel_expense_data);
      this.expense.hotel_expense_total_amount += parseInt(this.hotel_expense_data.amount);
      this.hotel_expense_data = {};
      setTimeout(() => {
        this.hotel_expense_data.checkOutDate = '';
        this.hotel_expense_data.checkInDate = '';
        this.hotel_expense_data.remark = '';
        this.hotel_expense_data.city = '';
        this.hotel_expense_data.hotelName = '';
        this.hotel_expense_data.amount = '';
      }, 500);
      
      console.log(this.hotel_expense_data);
      console.log(this.hotel_expense_data_list);
    }
    
    else if(type == 'food'){
      console.log("type == "+type);
      console.log(this.food_expense_data);
      
      this.food_expense_data_list.push(this.food_expense_data);
      this.expense.food_expense_total_amount += parseInt(this.food_expense_data.amount);
      this.food_expense_data = {};
      setTimeout(() => {
        this.food_expense_data.city = '';
        this.food_expense_data.date = '';
        this.food_expense_data.amount = '';
        this.food_expense_data.remark = '';
      }, 500);
      
      console.log(this.food_expense_data);
      console.log(this.food_expense_data_list);
      
    }
    
    else if(type == 'misc'){
      console.log("type == "+type);
      console.log(this.misc_expense_data);
      
      this.misc_expense_data_list.push(this.misc_expense_data);
      this.expense.misc_expense_total_amount += parseInt(this.misc_expense_data.amount);
      this.misc_expense_data = {};
      setTimeout(() => {
        this.misc_expense_data.expName = '';
        this.misc_expense_data.date = '';
        this.misc_expense_data.expPlace = '';
        this.misc_expense_data.amount = '';
        this.misc_expense_data.remark = '';
      }, 500);
      
      console.log(this.misc_expense_data);
      console.log(this.misc_expense_data_list);
      
    }
    
    console.log(this.expense);
    
    
    
  }

  add_expensetravel(type){
    console.log('newww');
    
   if(type == 'travel'){
      console.log("type == "+type);
      console.log(this.travel_expense_data);

      this.travel_expense_data.distance = !this.travel_expense_data.distance || this.travel_expense_data.distance == '' ? '--' : this.travel_expense_data.distance
      
      this.travel_expense_data_list.push(this.travel_expense_data);
      this.expense.travelEntitlementAmt += parseInt(this.travel_expense_data.ticket_amount);
      this.travel_expense_data = {};
      setTimeout(() => {
        this.travel_expense_data.depatureDate = '';
        this.travel_expense_data.depatureTime = '';
        this.travel_expense_data.depatureStation = '';
        this.travel_expense_data.arrivalDate = '';
        this.travel_expense_data.arrivalTime = '';
        this.travel_expense_data.arrivalStation = '';
        this.travel_expense_data.travelMode = '';
        this.travel_expense_data.travelClass = '';
        this.travel_expense_data.ticket = '';
        this.travel_expense_data.ticket_amount = '';
        this.travel_expense_data.distance = '';
      }, 500);
      
      console.log(this.travel_expense_data);
      console.log(this.travel_expense_data_list);
      
    }

  }
  
  delete_expense_from_list(type,amount,food_amount ,index){
    
    console.log("delete_expense_from_list method calls");
    if(type == 'local'){
      console.log("type == "+type);
      console.log(this.local_conveyance_expense_data);
      console.log("index = "+index);

      if(food_amount!=''){
      this.expense.local_conveyance_expense_total_amount -= (parseInt(amount)+parseInt(food_amount));

      }else{
      this.expense.local_conveyance_expense_total_amount -= parseInt(amount);

      }

      this.expense.food_amount -= parseInt(food_amount);
      this.local_conveyance_expense_data.splice(index,1);
      
      console.log(this.expense);
      console.log(this.local_conveyance_expense_data);
      
    }
    
    else if(type == 'hotel'){
      console.log("type == "+type);
      console.log(this.hotel_expense_data_list);
      
      this.expense.hotel_expense_total_amount -= parseInt(amount);
      this.hotel_expense_data_list.splice(index, 1);
      
      console.log(this.hotel_expense_data_list);
      console.log(this.expense);
      
    }
    
    else if(type == 'food'){
      console.log("type == "+type);
      console.log(this.food_expense_data_list);
      
      this.expense.food_expense_total_amount -= parseInt(amount);
      this.food_expense_data_list.splice(index, 1);
      
      console.log(this.food_expense_data_list);
      console.log(this.expense);
      
    }
    
    else if(type == 'misc'){
      console.log("type == "+type);
      console.log(this.misc_expense_data_list);
      
      this.expense.misc_expense_total_amount -= parseInt(amount);
      this.misc_expense_data_list.splice(index, 1);
      
      console.log(this.misc_expense_data_list);
      console.log(this.expense);
      
    }
    
    else if(type == 'travel'){
      console.log("type == "+type);
      console.log(this.travel_expense_data_list);
      
      this.expense.travelEntitlementAmt -= parseInt(amount);
      this.travel_expense_data_list.splice(index, 1);
      
      console.log(this.travel_expense_data_list);
      console.log(this.expense);
      
    }
    
    
  }
  
  get_allowance_Data() {
    console.log("get_allowance_Data method calls");
    
    this.dbService.show_loading();
    this.dbService.onPostRequestDataFromApi({},"Expense/travel_mode", this.dbService.rootUrlSfa)
    .subscribe(resp=>{
      this.dbService.dismiss_loading();
      console.log(resp);
      this.allowanceData = resp;
      
    },err=>
    {
      this.dbService.dismiss_loading();
    })
    
  }
  
  calculate_travel_amount() {
    
    if (this.localConvForm.travelClass == 'Car') {
      this.localConvForm.amount = parseInt(this.localConvForm.distance) * parseInt(this.allowanceData.car);
    }
    
    if (this.localConvForm.travelClass == 'Bike') {
      this.localConvForm.amount = parseInt(this.localConvForm.distance) * parseInt(this.allowanceData.bike);
    }

  
  }
  
  
  convert_date(type){
    console.log("convert_date method calls");
    if(type == 'local_expense'){
      this.localConvForm.date = moment(this.localConvForm.date).format('YYYY-MM-DD');
      console.log(this.localConvForm.date);
      
    }
    else{
      console.log("in else");
      console.log("type == "+type);
      
    }
    
  }
  
  captureMedia() {
    let actionsheet = this.actionSheetController.create({
      title: "Upload Image",
      cssClass: 'cs-actionsheet',
      
      buttons: [{
        cssClass: 'sheet-m',
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          console.log("Camera Clicked");
          this.takePhoto();
        }
      },
      {
        cssClass: 'sheet-m1',
        text: 'Gallery',
        icon: 'image',
        handler: () => {
          console.log("Gallery Clicked");
          this.getImage();
        }
      },
      {
        cssClass: 'cs-cancel',
        text: 'Cancel',
        role: 'cancel',
        icon: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    actionsheet.present();
  }
  
  getImage() {
    const options: CameraOptions =
    {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    console.log(options);
    
    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      
      console.log(this.image);
      if (this.image) {
        this.fileChange(this.image);
      }
    }, (err) => {
    });
  }
  
  takePhoto() {
    console.log("i am in camera function");
    const options: CameraOptions =
    {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 500,
      targetHeight: 400,
      cameraDirection:1,
      correctOrientation : true,
    }
    
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      console.log(this.image);
      if (this.image) {
        this.fileChange(this.image);
      }
    },
    (err) => {
    });
  }
  
  fileChange(img) {
    this.image_data.push(img);
    console.log(this.image_data);
    this.image = '';
  }
  
  remove_image(i: any) {
    this.image_data.splice(i, 1);
  }
  
  save_expense(type) {
    
    console.log("save_expense method calls");
    if (this.local_conveyance_expense_data.length == 0 && this.travel_expense_data_list.length == 0) {
      
      this.presentAlert(type);
    }
    
    else {
      let alert = this.alertCtrl.create({
        title: 'Save Expense',
        message: 'Do you want to Save this Expense?',
        cssClass: 'alert-modal',
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              console.log('Yes clicked');
              this.expense.billImage = this.image_data;
              this.expense.local_conveyance_expense_data = this.local_conveyance_expense_data;
              this.expense.travel = this.travel_expense_data_list;
              this.expense.hotel = this.hotel_expense_data_list;
              this.expense.food = this.food_expense_data_list;
              this.expense.miscExp = this.misc_expense_data_list;
              
              
              this.expense.expense_total_amount = 0;
              this.expense.expense_total_amount += parseInt(this.expense.local_conveyance_expense_total_amount) + parseInt(this.expense.travelEntitlementAmt) + parseInt(this.expense.hotel_expense_total_amount) + parseInt(this.expense.food_expense_total_amount) + parseInt(this.expense.misc_expense_total_amount)  ;
              console.log(this.expense);
              
              this.dbService.onPostRequestDataFromApi({ 'expenseData': this.expense }, 'Expense/submit_expense', this.dbService.rootUrlSfa)
              .subscribe(resp=>{
                console.log(resp);
                
                this.expense.local_conveyance_expense_total_amount = 0;
                this.expense.travelEntitlementAmt = 0;
                this.expense.expense_total_amount = 0;
                this.expense = {};
                
                if(resp['msg'] == 'success'){
                  
                  let alert=this.alertCtrl.create({
                    title:'Successful',
                    subTitle: "Expense Add Successfully",
                    cssClass:'action-close',
                    
                    buttons: [{
                      text: 'Ok',
                      role: 'cancel',
                      handler: () => {
                        this.navCtrl.pop();
                      }
                    }]
                  });
                  alert.present();
                  
                }
                else{
                  let alert=this.alertCtrl.create({
                    title:'Error',
                    subTitle: "Something Went Wrong, Please Try Again !",
                    cssClass:'action-close',
                    
                    buttons: [{
                      text: 'Cancel',
                      role: 'cancel',
                      handler: () => {
                        
                      }
                    }]
                  });
                  alert.present();
                }
              })
            }
          },
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      alert.present();
    }
  }
  
  presentAlert(type) {
    console.log(type);
    console.log(this.travel_expense_data);
    


    if (type == 'Outstation Travel') {
      console.log('ssss');
      
      let alert = this.alertCtrl.create({
        title: 'Alert',
        subTitle: 'Add Travel Entitlement First',
        buttons: ['Dismiss']
      });
      alert.present();
    }
    if((this.travel_expense_data.travelMode=='Train'||this.travel_expense_data.travelMode=='Flight'||this.travel_expense_data.travelMode=='Bus') && (this.travel_expense_data.ticket==''||!this.travel_expense_data.ticket)){
      console.log('yyyyy');


    
   if(type == "ticket"){
    console.log('uuuuu');
    
      console.log(type);
      let alert = this.alertCtrl.create({
        title: 'Alert',
        subTitle: 'Ticket Number is Mandatory',
        buttons: ['Dismiss']
      });
      alert.present();
    }
  }
    else if(type == "amount"){
      console.log('ttttttt');
      
      console.log(type);
      let alert = this.alertCtrl.create({
        title: 'Alert',
        subTitle: 'Amount is Mandatory',
        buttons: ['Dismiss']
      });
      alert.present();
      
    }
    console.log('oooo');
    
    
    // else {
    //   let alert = this.alertCtrl.create({
    //     title: 'Alert',
    //     subTitle: 'Add Local Conveyance First',
    //     buttons: ['Dismiss']
    //   });
    //   alert.present();
    // }

     
    
    
   
  }
  
  
  
}