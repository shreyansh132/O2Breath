import { Component } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  text: string = '';

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.requestLocationPermission();
    this.notificationService.getNotificationDataFromServer();
    this.notificationService.sendTestMessage();

  }

  async requestLocationPermission() {
    const result = await Geolocation.requestPermissions();
    if (result.location === 'granted') {
      // Permission granted, proceed to get location
      this.getLocation();
    } else {
      // Handle permission denied
    }
  }

  async getLocation() {
    try {  
      const position = await Geolocation.getCurrentPosition();
      console.log('Current location:', position.coords.latitude, position.coords.longitude);
  
      const watchId = Geolocation.watchPosition({}, (position, err) => {
        if (err) {
          console.error('Error getting location', err);
          return;
        }
        this.text = '' + position!.coords.latitude, position!.coords.longitude;
        console.log('Live location:', position?.coords.latitude, position?.coords.longitude);
        // You can use the obtained live coordinates as needed
      });   

  } catch (error) {
  console.error('Error getting location', error);
  }
}
}
