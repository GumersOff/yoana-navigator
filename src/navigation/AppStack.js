import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import MapScreen from '../screens/MapScreen/MapScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {

    return (
        <Stack.Navigator
            initialRouteName={"Map"}
            screenOptions={() => ({
                headerShown: false,
            })}>
            <Stack.Screen name="Map" component={MapScreen} />
        </Stack.Navigator >
    )
}

export default AuthStack;