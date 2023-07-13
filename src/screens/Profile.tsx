import { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup';

import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';

const PHOTO_SIZE = 33;

type FormDataProps = {
  name: string;
  password_old: string;
  password: string;
  password_confirm: string;
}

const signUpSchema = Yup.object({
  name: Yup.string().required('Informe o nome.'),
  password_old: Yup.string().required('Informe a senha antiga').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
  password: Yup.string().required('Informe a senha').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
  password_confirm: Yup.string().required('Confirme a nova senha.').
    oneOf([Yup.ref('password')], 'A confirmação da senha não confere.')
})

export function Profile() {
  const toast = useToast();

  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState('https://github.com/eduardoarad.png')

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    defaultValues: { // valores iniciais do formulario
      name: '',
      password_old: '',
      password: '',
      password_confirm: ''
    },
    resolver: yupResolver(signUpSchema)
  });

  async function handleUserPhotoSelect(){
    setPhotoIsLoading(true);
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
        
      });

      if(photoSelected.canceled) {
        return;
      }

      if(photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri, { size: true });
        
        if(photoInfo.exists && (photoInfo.size / 1024 / 1024) > 5) {
          return toast.show({
            title: 'Esssa imagem é muito grande. Escolha uma de até 5MB.',
            placement: 'top',
            bgColor: 'red.500',
          });
        }
          
        setUserPhoto(photoSelected.assets[0].uri);
      }
    } catch(err) {
      console.log('Error Photo', err);
    } finally {
      setPhotoIsLoading(false);
    }
  }

  function handleSubmitProfile(data: FormDataProps) {
    console.log(data);
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title='Perfil' />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto
              source={{ uri: userPhoto }}
              alt='Foto do usuário'
              size={PHOTO_SIZE}
            />
          )}

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color="green.500" fontWeight='bold' fontSize='md' mt={2} mb={8}>
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name='name'
            render={({ field: { onChange, value }}) => (
              <Input
                bg="gray.600"
                placeholder='Nome'
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />
          

          <Input
            bg="gray.600"
            placeholder='E-mail'
            // value='araujocarlos893@gmail.com'
            isDisabled
          />


          <Heading
            color="gray.200"
            fontSize="md"
            mb={2}
            mt={12}
            alignSelf='flex-start'
            fontFamily='heading'
          >
            Alterar senha
          </Heading>
          <Controller
            control={control}
            name='password_old'
            render={({ field: { onChange, value }}) => (
              <Input
                bg="gray.600"
                placeholder='Senha antiga'
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password_old?.message}
              />
            )}
          />

          <Controller
            control={control}
            name='password'
            render={({ field: { onChange, value }}) => (
              <Input
                bg="gray.600"
                placeholder='Informe a nova senha'
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name='password_confirm'
            render={({ field: { onChange, value }}) => (
              <Input
                bg="gray.600"
                placeholder='Confirme nova senha'
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password_confirm?.message}
              />
            )}
          />

          <Button
            title='Atualizar'
            mt={4}
            onPress={handleSubmit(handleSubmitProfile)}
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}
