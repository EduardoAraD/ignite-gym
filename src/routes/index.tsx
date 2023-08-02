import { useEffect, useState } from 'react';
import { useTheme, Box } from 'native-base';
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import OneSignal, { NotificationReceivedEvent, OSNotification } from 'react-native-onesignal';

import { useAuth } from '@hooks/useAuth';

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from './app.routes';

import { Loading } from '@components/Loading';
import { Notification } from '@components/Notifications';

const linking= {
  prefixes: ['com.eduardoarad.ignitegym://', 'ignitegym://', 'exp+ignitegym://'],
  config: {
    screens: {
      signUp: {
        path: 'signUp',
      },
      exercise: {
        path: 'exercise/:exerciseId',
        parse: {
          exerciseId: (exerciseId: string) => exerciseId
        }
      },
      history: {
        path: 'history',
      },
      NotFound: '*',
    }
  }
}

export function Routes(){
  const { colors } = useTheme();
  const { user, isLoadingUserStorageData } = useAuth();

  const [notification, setNotification] = useState<OSNotification | null>(null);

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  useEffect(() => {
    const unsubscribe = OneSignal.setNotificationWillShowInForegroundHandler((notificationEvent: NotificationReceivedEvent) => {
      const osNotification = notificationEvent.getNotification();

      setNotification(osNotification);
    });

    return () => unsubscribe;
  }, [])

  if(isLoadingUserStorageData) {
    return <Loading />
  }

  return (
    <Box flex={1} bg='gray.700'>
      <NavigationContainer theme={theme} linking={linking}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
        {notification && (
          <Notification
            onClose={() => setNotification(null)}
            data={notification}
          />
        )}
      </NavigationContainer>
    </Box>
  )
}
