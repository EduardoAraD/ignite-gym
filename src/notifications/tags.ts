import OneSignal from "react-native-onesignal";

export function createTagsUser(name: string) {
  OneSignal.sendTag("user_name", name)
}

export function removeTagUser() {
  OneSignal.deleteTag("user_name")
}

export function tagLastDayExercise() {
  const date = new Date().toLocaleString().slice(0, 10).split('/').join('.');
  OneSignal.sendTag('last_exercise', date);
}

export function tagNumberExerciseHistoryInWeek(valor: number) {
  OneSignal.sendTag('exercicies_week', valor.toString());
}
