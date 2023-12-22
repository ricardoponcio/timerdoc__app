import { TextInput, TextInputProps } from 'react-native';

export function CustomInput(props: TextInputProps) {
  return <TextInput
    style={{
      borderWidth: 2,  // size/width of the border
      borderColor: 'lightgrey',  // color of the border
      paddingVertical: 8,
      paddingHorizontal: 24,
      height: 55
    }}
    {...props}
  />;
}
