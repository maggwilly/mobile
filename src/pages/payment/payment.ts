import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  paymentdata:any;
  primarycolor:string='#065c79'
  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams) {
    this.paymentdata= this.navParams.get('paymentdata');
  }

  ionViewDidLoad() {}

  onFrameError($event){
   // this.dismiss($event.detail.error)
  }

  onPaymentComplete($event: any){
    this.dismiss($event.detail)
  }

  dismiss(data?: any) {
    this.viewCtrl.dismiss(data);
  }

  onPaymentCancel($event: any) {
    this.dismiss($event.detail)
  }
}
