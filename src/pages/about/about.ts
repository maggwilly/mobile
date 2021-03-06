import { Component, NgZone } from '@angular/core';
import { App, NavController, AlertController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicPage } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook'
import firebase from 'firebase';
import { AppNotify } from '../../providers/app-notify';
import { DataService } from '../../providers/data-service';
export interface PageInterface {
  title: string;
  link: string;
  icon: string;
}
@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  load:boolean=false;
  appPages: PageInterface[] = [
    { title: 'A propos de centor', link: '#', icon: 'information-circle' },
    { title: "Obtenir de l'aide", link: '#', icon: 'help-circle' },
    { title: "Conditions d'utilisation", link: '#', icon: 'ios-clipboard' },
  ];
  authInfo
  ambassador: any
  expanded: any;
  contracted: any;
  showIcon = true;
  preload = true;
  zone: NgZone;
  constructor(
    private iab: InAppBrowser,
    private facebook: Facebook,
    public alertCtrl: AlertController,
    public appCtrl: App,
    public dataService: DataService,
    public notify: AppNotify,
    public navCtrl: NavController
  ) {
    this.zone = new NgZone({});
  }

  ionViewDidLoad() {
    this.observeAuth();
  }

  openHelp(link: PageInterface) {
    this.iab.create(link.link);
  }


  observeAuth() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.authInfo = user;
        this.checkAmbassador();
      } else
        this.authInfo = null;
    })
  }

  checkAmbassador() {
    this.dataService.getAmbassadorObservable(this.authInfo.uid).subscribe(data => {
      this.ambassador =data;
      this.load=true;
    }, error => {
      this.notify.onError({ message: 'Problème de connexion.' });
    });

  }
  openContact() {
    this.navCtrl.push('ContactPage');
  }
  signup() {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        if (user) {
          this.authInfo = user;
          this.notify.onSuccess({ message: "Vous êtes connecté à votre compte." });
          unsubscribe();
        } else {
          this.authInfo = undefined;
          unsubscribe();
        }
      });
    });
    this.appCtrl.getRootNav().push('LoginSliderPage', { redirectTo: true });
  }


  appInvite() {
    this.facebook.showDialog(
      {
        url: 'https://vsn5c.app.goo.gl/centor',
        picture: 'https://firebasestorage.googleapis.com/v0/b/trainings-fa73e.appspot.com/o/ressources%2Fapp-features2.png?alt=media&token=9a8a1c97-55cf-410a-af34-52ce9df3a8dc'
      }
    ).then((data) => {
      console.log('invited');
    })
  }

  setReference() {
    if (!this.load)
    return;
      this.alert()
  }

  alert() {
    let alert = this.alertCtrl.create({
      title: 'Code de reférence',
      message: "Si l'application vous a été recommandée par l'un de nos enseignants ou ambassadeurs, il vous a certainement remis un code de03 chiffres. Saisissez le puis vqlidez",
      inputs: [
        {
          name: 'ambassador',
          type: 'number',
          placeholder: '123',
        }]
      ,
      buttons: [
        {
          text: "Annuler",
          role: 'cancel'
        },
        {
          text: "Validé",
          handler: data => {
              this.dataService.editInfo( data).then(data=>{
              this.ambassador=data;
            },er=>{
                this.notify.onError({message:"Echec ! Celà peut être dû à une mauvaise connexion inernet ou alors le code de 03 chiffre nùest pas le bon."})
            })
          }

        }
      ]
    });
    alert.present()
  }
}
