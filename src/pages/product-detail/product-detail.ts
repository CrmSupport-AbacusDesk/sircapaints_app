import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App, Keyboard } from 'ionic-angular';
import { ProductSubdetailPage } from '../product-subdetail/product-subdetail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { OfflineDbProvider } from '../../providers/offline-db/offline-db';
import { SQLite } from '@ionic-native/sqlite';


@IonicPage()
@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {
  cat_id:any='';
  filter :any = {};
  prod_list:any=[];
  prod_cat:any={};
  prod_count:any='';
  loading:Loading;
  total_count:any='';
  flag:any='';
  no_rec:any=false;
  skelton:any={}
  src:any;
  categoryName: any;
  globalSearchData: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService:DbserviceProvider,
              public loadingCtrl:LoadingController,
              private app:App,
              public offlineService: OfflineDbProvider,
              private sqlite: SQLite,
              public keyboard : Keyboard) {

            this.skelton = new Array(10);
    }

    ionViewDidLoad() {

      console.log('ionViewDidLoad ProductDetailPage');

      this.cat_id = this.navParams.get('id');
      this.src = this.navParams.get('src');

      this.filter.src = this.src;
      this.filter.categoryName = this.navParams.get('categoryName');
      this.filter.globalSearchData = this.navParams.get('globalSearchData');
      if(this.filter.globalSearchData != '' )
      {
        this.filter.search = this.filter.globalSearchData
      }
      console.log(this.cat_id);
      console.log('src ' + this.src);

      console.log(this.cat_id);
      this.getProductList(this.cat_id,'');

    }

    goOnProductSubDetailPage(id){
      this.navCtrl.push(ProductSubdetailPage,{'id':id})
    }

    doRefresh(refresher) {

      console.log('Begin async operation', refresher);
      this.flag = '';
      this.getProductList(this.cat_id,'');
      refresher.complete();
    }


    getProductList(id, search) {

      this.keyboard.close()
      this.no_rec=false
      console.log(search);
      this.filter.search = search;
      this.filter.limit = 0;
      this.filter.id = id;

      const searchData = JSON.parse(JSON.stringify(this.filter));

      if(searchData.search) {
          searchData.search = '%'+ searchData.search + '%';
      }

      console.log(searchData);

      this.offlineService.onGetProductListHandler(searchData, 0).subscribe(productData => {

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

        let imageName = '';
        let categoryId = '';
        let imageFolderName = '';

        if(productData['category_name'] && productData['category_name'][0]) {

              if(this.src == 'mainCategory') {

                    imageName = productData['category_name'][0].image;
                    imageFolderName = 'mainCategoryImage';

              } else if(this.src == 'category') {

                    imageName = productData['category_name'][0].categoryImage;
                    imageFolderName = 'categoryImage';
              }
        }

        if(productData['category_name'] && productData['category_name'][0]) {
             categoryId = productData['category_name'][0].id;
        }

        console.log(this.src);
        console.log(imageFolderName);
        console.log(productData);

        this.offlineService.onReturnImagePathHandler(imageFolderName, imageName, categoryId).subscribe((imageResultData) => {
                console.log('11111');
                console.log(imageResultData);
                if(productData['category_name'] && productData['category_name'][0]) {

                        productData['category_name'][0].imageCompletePath = imageResultData['imagePath'];

                        this.prod_cat = productData['category_name'][0];

                } else {

                        this.prod_cat = productData['category_name'];
                }

        });

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
      this.presentLoading();
      this.dbService.onPostRequestDataFromApi({'filter':this.filter},'app_master/productList', this.dbService.rootUrl)
      .subscribe( (r) =>
      {
        console.log(r);
        setTimeout(() => {

          this.loading.dismiss();
        }, 2000);

        this.prod_list=r['products'];
        if(this.prod_list.length == 0)
        {
          this.no_rec = true;
        }
        else
        {
          this.no_rec = false;
        }
        for (let index = 0; index < this.prod_list.length; index++) {

          this.getImages(this.prod_list[index]['id'],index)


        }
        this.prod_cat=r['category_name'][0];
        this.prod_count=r['product_count']
        this.total_count=r['product_count_all']
        console.log(this.prod_cat);
      },(error: any) => {
        // this.loading.dismiss();
      })
    }

    getImages(category_id,index)
    {
          console.log(category_id + index)
          this.dbService.onPostRequestDataFromApi({'product_id' : category_id},'app_master/getproductimages', this.dbService.rootUrl).subscribe((res)=>{
            this.prod_list[index]['image']=res['image'][0]['image'];
          })
    }

    loadData(infiniteScroll)
    {
      console.log('loading');

      this.filter.limit=this.prod_list.length;
      this.dbService.onPostRequestDataFromApi({'filter' : this.filter},'app_master/productList', this.dbService.rootUrl).subscribe( r =>
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
              for (let index =(this.prod_list.length - r['products'].length); index < this.prod_list.length; index++) {

                this.getImages(this.prod_list[index]['id'],index)


              }
              infiniteScroll.complete();
            },1000);
          }
        });
      }
      presentLoading()
      {
        this.loading = this.loadingCtrl.create({
          spinner: 'hide',
          content: `<img src="./assets/imgs/gif.svg"/>`,
          dismissOnPageChange: true
        });
        this.loading.present();
      }
      ionViewDidLeave()
      {
        let nav = this.app.getActiveNav();
        if(nav && nav.getActive())
        {
          let activeView = nav.getActive().name;
          let previuosView = '';
          if(nav.getPrevious() && nav.getPrevious().name)
          {
            previuosView = nav.getPrevious().name;
          }
          console.log(previuosView);
          console.log(activeView);
          console.log('its leaving');
          if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage'))
          {

            console.log(previuosView);
            this.navCtrl.popToRoot();
          }
        }
      }
    }
