import { Center, Heading, Icon, VStack } from "native-base";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

import { useAuth } from "@hooks/useAuth";

import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

import { Button } from "@components/Button";

export function NotFound() {
  const { user } = useAuth();
  const navigationApp = useNavigation<AppNavigatorRoutesProps>();
  const navigationAuth = useNavigation<AuthNavigatorRoutesProps>();

  function handleOnPressGoBack () {
    if(!!user) {
      navigationApp.navigate('home');
    } else {
      navigationAuth.navigate('signIn');
    }
  }

  return (
    <VStack flex={1}>
      <Center flex={1} p={10}>
        <Icon
          as={Feather}
          name='alert-triangle'
          color="gray.200"
          size={20}
          mb={5}
        />
        <Heading color="gray.100" fontSize="lg" flexShrink={1} fontFamily='heading'>
          Página não encontrada.
        </Heading>

        <Button title="Voltar" mt={12} onPress={handleOnPressGoBack} />
      </Center>
    </VStack>
  )
}