import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ActivityIndicator, StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { Text } from './Themed';

export function CustomButton(props: (TouchableOpacityProps & {
  title?: string,
  iconName?: React.ComponentProps<typeof FontAwesome>['name'],
  iconSize?: number,
  isLoading?: boolean,
  disabled?: boolean,
  transparent?: boolean,
})) {
  return <View>
    <TouchableOpacity {...props} style={[styles.wrapper, ...(props.transparent ? [styles.transparent] : [])]} disabled={props.isLoading || props.disabled}>
      {!props.isLoading && (
        (props.iconName && <FontAwesome size={props.iconSize || 16} color={'white'} name={props.iconName} />) ||
        (!props.isLoading && props.title && <Text style={styles.title}>{props.title}</Text>)
      )}
      {props.isLoading && <ActivityIndicator style={styles.loading} size={16} animating={props.isLoading} color={'white'} />}
    </TouchableOpacity>
    {(props.disabled || props.isLoading) && <View style={styles.overlay} />}
  </View>;
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'lightcoral',
  },
  transparent: {
    backgroundColor: 'transparent'
  },
  title: {
    color: 'white'
  },
  icon: {
  },
  loading: {
    padding: 0
  },
  // Flex to fill, position absolute, 
  // Fixed left/top, and the width set to the window width
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    width: '100%',
    height: '100%'
  }
});
