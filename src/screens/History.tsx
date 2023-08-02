import { useCallback, useState } from 'react';
import { Heading, VStack, SectionList, Text, useToast } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';

import { HistoryCard } from '@components/HistoryCard';
import { Loading } from '@components/Loading';
import { ScreenHeader } from '@components/ScreenHeader';

import { api } from '@services/api';

import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO';

import { AppError } from '@utils/AppError';

import { tagNumberExerciseHistoryInWeek } from '../notifications/tags';

export function History() {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

  function getLast7Days() {
    const numberLast7Day = new Date().setDate(new Date().getDate() - 7);
    const date7Day = new Date(numberLast7Day);
    const day = date7Day.getDate();
    const month = date7Day.getMonth() + 1;
    return `${day <= 9 ? `0${day}` : day}.${month <= 9 ? `0${month}` : month}.${date7Day.getFullYear()}`;
  }

  function dateInNumberComparate(date: string) {
    const [day, month, year] = date.split('.');
    return Number(`${year}${month}${day}`);
  }

  async function fetchHistory() {
    try {
      setIsLoading(true);

      const response = await api.get('/history');

      const historyDate: HistoryByDayDTO[] = response.data;

      const numberDateLastWeek = dateInNumberComparate(getLast7Days());
      let numberExercicesInWeek = 0;
      historyDate.forEach(history => {
        const numberDateExercise = dateInNumberComparate(history.title);
        if(numberDateExercise > numberDateLastWeek) {
          numberExercicesInWeek += history.data.length;
        }
      })
      tagNumberExerciseHistoryInWeek(numberExercicesInWeek)

      setExercises(historyDate);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar o histórico.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  )

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />

      {isLoading ? (
        <Loading />
      ) : (
        <SectionList
          sections={exercises}
          keyExtractor={item => item.id}
          renderItem={({item }) => (
            <HistoryCard data={item} />
          )}
          renderSectionHeader={({ section }) => (
            <Heading color="gray.100" fontSize="md" mt={10} mb={3} fontFamily='heading'>
              {section.title}
            </Heading>
          )}
          px={8}
          contentContainerStyle={exercises.length === 0 && {flex: 1, justifyContent: 'center'}}
          ListEmptyComponent={() => (
            <Text color="gray.100" textAlign="center">
              Não há exercícios registrados ainda. {'\n'}
              Vamos fazer exercícios hoje?
            </Text>
          )}
        />
      )}
    </VStack>
  )
}
