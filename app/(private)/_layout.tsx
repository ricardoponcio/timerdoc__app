import { Stack } from 'expo-router';

export default function RootLayout() {
  return (<>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(companies)/listCompanies/index" />
      <Stack.Screen name="documents/detail/[id]" />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  </>);
}