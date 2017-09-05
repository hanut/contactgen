import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import * as chance from 'chance';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	public isDone : boolean = false;
	private count : number = 0;

	constructor(public navCtrl: NavController,private contacts: Contacts,private androidPermissions: AndroidPermissions) {

	}

	ionViewDidLoad(){
		console.log("Started entry");
		this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_CONTACTS).then(
			success => this.startEntry(),
			err => this.requestPermissions()
		);
		// this.startEntry();
	}

	startEntry(){
		let ch = new chance();
		this.count = 5000;
		let promise = new Promise((resolve,reject)=>{
			for (var i = this.count; i > 0; i--) {
				let contact : Contact = this.contacts.create();
				console.log(contact);
				debugger;
				contact.name = new ContactName(null, null, ch.name());
				contact.phoneNumbers = [new ContactField('mobile', ch.phone())];
				contact.save().then(
					() => {
						console.log('Contact saved!', contact);
						this.count--;
						if(this.count==0){
							resolve();
						}
					},
					(error: any) => console.error('Error saving contact.', error)
				);
			}
		});

		promise.then(this.insertDone).catch((reason)=>{this.insertFailed(reason)});
		
	}

	requestPermissions(){
		let permissions = [
			this.androidPermissions.PERMISSION.WRITE_CONTACTS,
			this.androidPermissions.PERMISSION.READ_CONTACTS
		];
		this.androidPermissions.requestPermissions(permissions)
			.then((response)=>{console.log(response);})
			.catch((reason)=>{console.log(reason);})
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
