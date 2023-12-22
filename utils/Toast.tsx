import { Toast } from 'react-native-toast-message/lib/src/Toast';

export class ToastUtils {

    static show(type: string, title: string, subtitle: string) {
        Toast.show({
            type,
            text1: title,
            text2: subtitle,
            position: 'bottom'
        });
    }

}