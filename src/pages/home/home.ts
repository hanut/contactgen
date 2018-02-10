import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import * as chance from 'chance';
import { SimpleTimer } from 'ng2-simple-timer';


@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	public isDone : boolean = false;
	public isStarted : boolean = false;
	private count : number = 0;
	private ch: any;
	private ticks: number = 0;

	constructor(public navCtrl: NavController,private contacts: Contacts,private androidPermissions: AndroidPermissions,
		private st: SimpleTimer) {

		this.ch = new chance();

	}

	ionViewDidLoad () {
		console.log("Started entry");
		this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_CONTACTS).then((success) => {
			// this.deferedCG()
		}, (error) => {
			this.requestPermissions()
		});
	}

	deferedCG () {
		if ( !this.isStarted ) {
			this.isStarted = true
		}
		this.st.newTimer('dcg', 0.01);
		this.st.subscribe('dcg', () => {
			if (this.ticks == 1) {
				this.ticks = 0
				this.st.unsubscribe('dcg');
				this.st.delTimer('dcg');
				this.generateContact().then((contact) => {
					console.log(contact)
					this.count++
					this.deferedCG()
				}, (error) => {
					console.log(error)
				})
			} else {
				this.ticks++
			}
		});
	}

	stopCG () {
		this.st.unsubscribe('dcg');
		this.st.delTimer('dcg');
		this.isStarted = false
	}

	generateContact (): Promise<any> {
		return new Promise((resolve, reject) => {
			let contact: Contact = this.contacts.create();
			contact.name = new ContactName(null, null, this.ch.name());
			contact.phoneNumbers = [new ContactField('mobile', this.ch.phone())];
			resolve(contact)
			contact.save().then(() => {
				resolve(contact);
			}, (error: any) => {
				console.error('Error saving contact.', error);
				reject(error);
			});
		});
	}

	requestPermissions(){
		let permissions = [
		this.androidPermissions.PERMISSION.WRITE_CONTACTS,
		this.androidPermissions.PERMISSION.READ_CONTACTS
		];
		this.androidPermissions.requestPermissions(permissions).then((response)=>{
			console.log(response);
		}).catch((reason)=>{
			console.log(reason);
		})
	}

	insertDone(){
		console.log("Done");
		this.isDone = true;
	}

	insertFailed(error){
		console.log(error);
		this.isDone = true;
	}

}
