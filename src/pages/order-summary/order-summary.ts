import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
* Generated class for the OrderSummaryPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-order-summary',
  templateUrl: 'order-summary.html',
})

export class OrderSummaryPage {
  
  order_summary_array:any=[];
  pending:boolean=false;
  approved: boolean=false;
  r2d: boolean=false;
  partiallyDispatch: boolean=false;
  completelyDispatch: boolean=false;
  refferedBack: boolean=false;
  preClosed: boolean=false;
  hold: boolean=false;
  increment:boolean = false;
  increment2:boolean = false;
  increment3:boolean = false;
  increment4:boolean = false;
  increment5:boolean = false;


  
  
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    console.log(navParams);
   
    

   
    
    
    
    if(this.navParams.get('summary'))
    {
      this.order_summary_array = this.navParams.get('summary');
      
    }
    console.log(this.order_summary_array);
    for(let i = 0 ;i<this.order_summary_array.length;i++){
      
      if(this.order_summary_array[i].changed_status == 'Pending'){
        this.pending = true;
        setTimeout(() => {
      
          this.increment = true;
          
        }, 500);
    
        
      }
      else if (this.order_summary_array[i].changed_status == 'Approved'){
        this.approved = true;
        this.refferedBack = false;
        this.preClosed = false;
        setTimeout(() => {
        
          this.increment2 = true;
          this.increment = false;
          
        }, 3500);
        
      }
      else if (this.order_summary_array[i].changed_status == 'readyToDispatch'){
        this.r2d = true;
        setTimeout(() => {
        
          this.increment3 = true;
          this.increment2 = false;
          this.increment = false;
          
        }, 6000);
        
      }
      else if (this.order_summary_array[i].changed_status == 'PDispatch'){
        this.partiallyDispatch = true;
        
        setTimeout(() => {
        
          this.increment4 = true;
          this.increment3 = false;
          this.increment2 = false;
          this.increment = false;
          
          
        }, 9000);
        
      }
      else if (this.order_summary_array[i].changed_status == 'Dispatch'){
        this.completelyDispatch = true;

        setTimeout(() => {
        
         
          this.increment4 = true;
          this.increment3 = false;
          this.increment2 = false;
          this.increment = false;
          
          
        }, 9000);
        
      }
      else if (this.order_summary_array[i].changed_status == 'Reject'){
        this.refferedBack = true;
        this.preClosed = false;
        setTimeout(() => {
        
          this.increment2 = true;
          this.increment = false;
    
        }, 3500);
        
        
      }
      else if (this.order_summary_array[i].changed_status == 'Pre Close'){
        this.preClosed = true;
        this.refferedBack = false;
        setTimeout(() => {
        
          this.increment2 = true;
          this.increment = false;
          
        }, 3500);
        
        
      }
      else if (this.order_summary_array[i].changed_status == 'Hold'){
        this.hold = true;
        
        setTimeout(() => {
        
          this.increment3 = true;
          // this.increment5 = true;
          this.increment2 = false;
          this.increment = false;
          
        }, 6000);
        
      }
      
      
    }
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderSummaryPage');

    // if(this.increment == true){
    //   console.log('true');
    //   setTimeout(() => {
        
    //     this.increment2 = true;
        
    //   }, 500);

    // }

   

  }
  
  viewReamrk(status){
    
    for(let i = 0 ;i<this.order_summary_array.length;i++){
      
      if(status == this.order_summary_array[i].changed_status)
      return this.order_summary_array[i].reason
      
    }    
    
  }
  
  viewDate(status2){
    
    for(let i = 0 ;i<this.order_summary_array.length;i++){
      
      if(status2 == this.order_summary_array[i].changed_status)
      return this.order_summary_array[i].changed_time
      
    }  
    
  }
  viewHoldDays(status3){
    for(let x=0; x<this.order_summary_array.length;x++){
      if(status3==this.order_summary_array[x].changed_status){
        console.log("true");
        
        return this.order_summary_array[x].total_hold_days;
      }
    }
  }
  
}
