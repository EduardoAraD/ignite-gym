import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup';

import { useAuth } from '@hooks/useAuth';

import { AuthNavigatorRoutesProps } from '@routes/auth.routes';

import { Button } from '@components/Button';
import { Input } from '@components/Input';

import { AppError } from '@utils/AppError';

import BackgroundImg from '@assets/background.png';
import LogoSVG from '@assets/logo.svg';
import { useState } from 'react';

type FormDataProps = {
  email: string;
  password: string;
}

const signUpSchema = Yup.object({
  email: Yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
  password: Yup.string().required('Informe a senha.').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
})

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const { signIn } = useAuth();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  });

  function handleNewAccount() {
    navigation.navigate('signUp');
  }

  async function handleSubmitSignIn(data: FormDataProps) {
    try {
      setIsLoading(true);
      await signIn(data.email, data.password);

    } catch(error) {
      const isAppError = error instanceof AppError;
      
      const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde.'
      
      setIsLoading(false);
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
    
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}>
      <VStack flex={1} px={10} pb={16}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt='Pessoas treinando'
          resizeMode='contain'
          position='absolute'
        />

        <Center my={24}>
          <LogoSVG />
          <Text color='gray.100' fontSize='sm' >Treine sua mente e o seu corpo</Text>
        </Center>

        <Center>
          <Heading
            color='gray.100'
            fontSize='xl'
            mb={6}
            fontFamily='heading'
          >
            Acesse sua conta
          </Heading>

          <Controller
            name='email'
            control={control}
            render={({ field: { onChange, value }}) => (
              <Input
                placeholder='E-mail'
                keyboardType='email-address'
                autoCapitalize='none'
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />
          
          <Controller
            name='password'
            control={control}
            render={({ field: { onChange, value }}) => (
              <Input
                placeholder='Senha'
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />
          

          <Button
            title='Acessar'
            onPress={handleSubmit(handleSubmitSignIn)}
            isLoading={isLoading}
          />
        </Center>
      
      <Center mt={24}>
        <Text
          color="gray.100"
          fontSize='sm'
          mb={3}
          fontFamily='body'
        >Ainda não tem acesso</Text>
        <Button
          title='Criar conta'
          variant="outline"
          onPress={handleNewAccount}
        />
      </Center>
      </VStack>
    </ScrollView>
  )
}
