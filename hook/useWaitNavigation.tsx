import { NavigationContainerRef } from "@react-navigation/native";
import { useRootNavigation } from "expo-router";
import { useEffect, useState } from "react";

export function useWaitNavigation(): [boolean, NavigationContainerRef<any> | null] {
    const rootNavigation = useRootNavigation();

    const [isNavigationReady, setNavigationReady] = useState(false);

    useEffect(() => {
        const unsubscribe = rootNavigation?.addListener('state', (event) => {
            // console.log("INFO: rootNavigation?.addListener('state')", event);
            setNavigationReady(true);
        });
        return function cleanup() {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [rootNavigation]);

    return [isNavigationReady, rootNavigation];
}
