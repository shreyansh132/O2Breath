import { Injectable } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  getNotificationDataFromServer() {
    const eventSource = new EventSource('http://localhost:8080/sse');

    eventSource.onmessage = (event) => {
      console.log('Received SSE:', event.data);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };
  }

  sendTestMessage() {
    this.http.get('http://localhost:8080/sse/send').subscribe(
      (data) => console.log('Message sent successfully:', data),
      (error) => console.error('Error sending message:', error)
    );
  }

  async scheduleNotificationWithAction() {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Notification with Action',
          body: 'Click the button for an action!',
          id: 1,
          schedule: { at: new Date(Date.now()) },
         // sound: null,
          actionTypeId: 'notification-action',
          //attachments: null,
          extra: null,
        },
      ],
    });

    // Define the action for the button click
    await LocalNotifications.registerActionTypes({
      types: [
        {
          id: 'notification-action',
          actions: [
            {
              id: 'button-press',
              title: 'Press me!',
            },
          ],
        },
      ],
    });
  }
}
