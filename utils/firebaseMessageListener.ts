import { getMessaging, getToken, onMessage } from "firebase/messaging";
import app from "services/firebase";
import { VAPID_KEY } from "constants/config";
import profileService from "services/profile";
import { IPushNotification, NotificationData } from "interfaces";

type INotification = {
  notification?: IPushNotification;
  data?: NotificationData;
};

export const getNotification = (
  setNotification: (data?: IPushNotification) => void,
  setNotificationData?: (data?: NotificationData) => void
) => {
  const messaging = getMessaging(app);
  getToken(messaging, { vapidKey: VAPID_KEY })
    .then((currentToken) => {
      if (currentToken) {
        profileService
          .firebaseTokenUpdate({ firebase_token: currentToken })
          .then(() => {})
          .catch((error) => {
            console.log(error);
          });

        // @ts-expect-error
        onMessage(messaging, (payload: INotification) => {
          !!setNotificationData && setNotificationData(payload?.data);
          setNotification(payload?.notification);
        });
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};
