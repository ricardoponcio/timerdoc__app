import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageUtils {

    static storeData = async (key: string, value: string) => {
        try {
            await AsyncStorage.setItem(
                `@TimerDoc:${key}`,
                value,
            );
        } catch (error) {
            console.error(error);
        }
    };

    static retrieveData = (key: string): Promise<string | null> | null => {
        try {
            return AsyncStorage.getItem(`@TimerDoc:${key}`);
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    static removeData = async (key: string) => {
        try {
            await AsyncStorage.removeItem(
                `@TimerDoc:${key}`
            );
        } catch (error) {
            console.error(error);
        }
    };

}