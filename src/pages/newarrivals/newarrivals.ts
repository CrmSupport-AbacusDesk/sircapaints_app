import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { ProductSubdetailPage } from '../product-subdetail/product-subdetail';
import { OfflineDbProvider } from '../../providers/offline-db/offline-db';
import { SQLite } from '@ionic-native/sqlite';

/**
* Generated class for the NewarrivalsPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-newarrivals',
  templateUrl: 'newarrivals.html',
})
export class NewarrivalsPage {
  cat_id:any='';
  filter :any = {};
  prod_list:any=[];
  prod_cat:any={};
  prod_count:any='';
  // loading:Loading;
  total_count:any='';
  flag:any='';
  no_rec:any=false;
  skelton:any={}
  usertype:any
  
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public dbService:DbserviceProvider,
    public offlineService: OfflineDbProvider,
    private sqlite: SQLite) {
      this.usertype = this.dbService.userStorageData.type;
      
      
      this.skelton = new Array(10);
    }
    
    ionViewDidLoad() {
      
      this.getProductListWithLiveServer(this.cat_id,'');
    }
    
    goOnProductSubDetailPage(id){
      this.navCtrl.push(ProductSubdetailPage,{'id':id})
    }
    
    doRefresh(refresher)
    {
      console.log('Begin async operation', refresher);
      this.flag = '';
      // this.getProductList(this.cat_id,'');
      this.getProductListWithLiveServer(this.cat_id,'');

      refresher.complete();
    }
    loadData(infiniteScroll)
    {
      console.log('loading');
      
      this.filter.limit=this.prod_list.length;
      this.dbService.onPostRequestDataFromApi({'filter' : this.filter,'type':'New Arivals'},'app_master/newArrivals', this.dbService.rootUrl).subscribe( r =>
        {
          console.log(r);
          if(r['products']=='')
          {
            this.flag=1;
          }
          else
          {
            setTimeout(()=>{
              this.prod_list=this.prod_list.concat(r['products']);
              console.log('Asyn operation has stop')
              infiniteScroll.complete();
            },1000);
          }
        });
      }
      
      getProductList(id, search)  {
        
        console.log(search);
        this.filter.search = search;
        this.filter.limit = 0;
        this.filter.id = id;
        
        console.log(this.filter);
        
        const searchData = JSON.parse(JSON.stringify(this.filter));
        
        if(searchData.search) {
          searchData.search = '%'+ searchData.search +'%';
        }
        
        this.offlineService.onGetProductListHandler(searchData, 1).subscribe(productData => {
          
          console.log(productData);
          this.prod_list = productData['products'];
          
          for (let index = 0; index < this.prod_list.length; index++) {
            
            this.offlineService.onReturnImagePathHandler('productImage', this.prod_list[index].image, this.prod_list[index].id).subscribe((imageResultData) => {
              
              console.log(imageResultData);
              
              const productIndex = this.prod_list.findIndex(row => row.id == imageResultData.recordId);
              
              console.log(this.prod_list);
              console.log('ProductIndex ' + productIndex);
              
              this.prod_list[productIndex].imageCompletePath = imageResultData['imagePath'];
            });
          }
          
          if(this.prod_list.length == 0) {
            
            this.no_rec = true;
            
          } else {
            
            this.no_rec = false;
          }
          
          this.prod_count = productData['product_count']
          this.total_count = productData['product_count_all']
          console.log(this.prod_cat);
        });
      }
      
      
      getProductListWithLiveServer(id,search)
      {
        console.log(search);
        this.filter.search=search;
        this.filter.limit = 0;
        this.filter.id=id;
        // this.presentLoading();
        this.dbService.onPostRequestDataFromApi({'filter':this.filter},'app_master/newArrivals', this.dbService.rootUrl)
        .subscribe( (r) =>
        {
          console.log(r);
          // this.loading.dismiss();
          this.prod_list=r['products'];
          if(this.prod_list.length == 0)
          {
            this.no_rec = true;
          }
          else
          {
            this.no_rec = false;
          }
          // this.prod_cat=r['category_name'][0];
          this.prod_count=r['product_count']
          this.total_count=r['product_count_all']
          console.log(this.prod_cat);
        },(error: any) => {
          // this.loading.dismiss();
        })
      }
      
    }
    