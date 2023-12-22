import { ActivityIndicator, StyleSheet, View } from 'react-native';

export function Loading(props: Props) {
  return <View style={styles.wrapper}>
    <ActivityIndicator style={styles.loading} size={16} animating={true} color={props.color || 'black'} />
  </View>
}

interface Props {
  color?: string;
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    justifyContent: 'center'
  },
  loading: {
    padding: 0
  },
});
