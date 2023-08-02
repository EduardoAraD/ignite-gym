import { StatusBar } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { NativeBaseProvider } from "native-base";
import OneSignal from 'react-native-onesignal';

import { AuthContextProvider } from '@contexts/AuthContext';

import { Routes } from '@routes/index';

import { Loading } from '@components/Loading';

import { THEME } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  OneSignal.setAppId("c369e813-3942-4762-b2e6-1e511083ba2b");

  OneSignal.promptForPushNotificationsWithUserResponse();

  return (
    <NativeBaseProvider theme={THEME} >
      <StatusBar
        barStyle={"light-content"}
        backgroundColor='transparent'
        translucent
      />
      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
