import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App } from 'ionic-angular';
import { ProductDetailPage } from '../product-detail/product-detail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { OfflineDbProvider } from '../../providers/offline-db/offline-db';
import { SQLite } from '@ionic-native/sqlite';


@IonicPage()
@Component({
    selector: 'page-products',
    templateUrl: 'products.html',
})
export class ProductsPage {
    prod_cat_list:any=[];
    filter :any = {};
    flag:any='';
    loading:Loading;
    cat_images:any=[];
    category_count:any='';
    no_rec:any=false;
    name:any='';
    skelton:any={}

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public dbService:DbserviceProvider,
                public loadingCtrl:LoadingController,
                private app:App,
                public offlineService: OfflineDbProvider,
                private sqlite: SQLite) {

            this.skelton = new Array(10);

        }

        ionViewDidLoad() {
            console.log('ionViewDidLoad ProductsPage');
            this.filter.name  = this.navParams.get('name');
        }
        ionViewWillEnter()
        {
            this.getProductCategoryListWithLiveServer();
            this.presentLoading();
        }

        doRefresh(refresher)
        {
            console.log('Begin async operation', refresher);
            this.getProductCategoryListWithLiveServer();
            refresher.complete();
        }

        goOnProductDetailPage(id, image) {

            this.offlineService.onProductSelectedImage = image;
            this.navCtrl.push(ProductDetailPage,{'id':id, src: 'category'})
        }


        getProductCategoryList() {
            this.filter.limit = 0;
            this.no_rec=false
            const searchData = JSON.parse(JSON.stringify(this.filter));

            if(searchData.category_name) {
                searchData.category_name = '%' + searchData.category_name + '%';
            }

            this.offlineService.onGetCategoryListHandler(searchData).subscribe((categoryData) => {

                console.log(categoryData);

                this.prod_cat_list = JSON.parse(JSON.stringify(categoryData));

                for (let index = 0; index < this.prod_cat_list.length; index++) {

                        let imageName = '';
                        if(this.prod_cat_list[index].image && this.prod_cat_list[index].image.length > 0) {
                            imageName = this.prod_cat_list[index].image[0].image;
                        }

                        this.offlineService.onReturnImagePathHandler('categoryImage', imageName, this.prod_cat_list[index].id).subscribe((imageResultData) => {

                                  console.log(imageResultData);

                                  const categoryIndex = this.prod_cat_list.findIndex(row => row.id == imageResultData.recordId);

                                  console.log(this.prod_cat_list);
                                  console.log('categoryIndex ' + categoryIndex);

                                  this.prod_cat_list[categoryIndex].imageCompletePath = imageResultData['imagePath'];
                        });
                }

                if(this.prod_cat_list.length == 0) {

                    this.no_rec = true;

                } else {

                    this.no_rec = false;
                }
            });
        }



        getProductCategoryListWithLiveServer()
        {
            this.filter.limit = 0;
            this.dbService.onPostRequestDataFromApi({'filter' : this.filter},'app_master/categoryList', this.dbService.rootUrl)
            .subscribe((r)=>
            {
                // this.loading.dismiss();
                this.prod_cat_list=r['categories'];
                if(this.prod_cat_list.length == 0)
                {
                    this.no_rec = true;
                }
                else
                {
                    this.no_rec = false;
                }
                for (let index = 0; index < this.prod_cat_list.length; index++) {

                    this.getImages(this.prod_cat_list[index]['id'],index)


                }
                // if(this.prod_cat_list.length == 1)
                // {
                //   console.log('list length is one');
                //   console.log(this.prod_cat_list[0].id);
                //   this.goOnProductDetailPage(this.prod_cat_list[0].id)
                // }
            },(error: any) => {
                // this.loading.dismiss();
            })
        }


        getImages(category_id,index)
        {
            this.dbService.onPostRequestDataFromApi({'category_id' : category_id},'app_master/getSubCatImages', this.dbService.rootUrl).subscribe((res)=>{
                this.prod_cat_list[index]['image']=res['image'];
            })
        }

        loadData(infiniteScroll)
        {
            console.log('loading');

            this.filter.limit=this.prod_cat_list.length;
            this.dbService.onPostRequestDataFromApi({'filter' : this.filter},'app_master/categoryList', this.dbService.rootUrl)
            .subscribe( r =>
                {
                    console.log(r);
                    if(r['categories']=='')
                    {
                        this.flag=1;
                    }
                    else
                    {
                        setTimeout(()=>{
                            this.prod_cat_list=this.prod_cat_list.concat(r['categories']);
                            console.log(this.prod_cat_list.length +' '+ r['categories'].length)
                            for (let index =(this.prod_cat_list.length - r['categories'].length); index < this.prod_cat_list.length; index++) {
                                console.log(index)
                                this.getImages(this.prod_cat_list[index]['id'],index)


                            }
                            infiniteScroll.complete();
                        },1000);
                    }
                });
            }

            presentLoading()
            {
                // this.loading = this.loadingCtrl.create({
                //   content: "Please wait...",
                //   dismissOnPageChange: true
                // });
                // this.loading.present();
            }


                    //master search start
            goToProductsWithSearch(globalSearchData)
            {
                this.navCtrl.push(ProductDetailPage, {'id':'', categoryName: this.filter.name, globalSearchData: globalSearchData, src: 'category'})
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
