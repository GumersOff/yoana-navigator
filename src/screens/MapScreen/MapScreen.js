import { StatusBar, StyleSheet, Text, View, Image, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView, PinchGestureHandler } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Snackbar from 'react-native-snackbar';

import styles from './MapStyle';
import images from './images';

const SPEED = 1.5;

interface AnimatedPosition {
    x: Animated.SharedValue<number>;
    y: Animated.SharedValue<number>;
    scale: Animated.SharedValue<number>;
}

const useFollowAnimatedPosition = ({ x, y, scale }: AnimatedPosition) => {

    const followX = useDerivedValue(() => {
        return withSpring(x.value, { mass: 0.2, stiffness: 50, });
    });

    const followY = useDerivedValue(() => {
        return withSpring(y.value, { mass: 0.2, stiffness: 50, });
    });


    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: followX.value },
                { translateY: followY.value },
                { scale: scale.value },
            ],
        }
    });

    return { followX, followY, rStyle };
}

const AnimatedImage = Animated.createAnimatedComponent(Image);

const MapScreen = () => {

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(0.2);

    const minScale = useSharedValue(0.2);
    const maxScale = useSharedValue(0.5);

    const saveScale = useSharedValue(0.5);
    const context = useSharedValue({ x: 0, y: 0 });

    const isPinching = useSharedValue(false);

    const { followX, followY, rStyle } = useFollowAnimatedPosition({ x: translateX, y: translateY, scale: scale });

    // States
    const [room, setRoom] = useState(0);
    const [floor, setFloor] = useState(0);
    const [map, setMap] = useState(images.floor0[0]); // ROOM-FLOOR

    const panGesture = Gesture.Pan()
        .onStart(() => {
            context.value = { x: translateX.value, y: translateY.value };
        })
        .onUpdate((event) => {
            if (event.numberOfPointers === 1 && !isPinching.value) {
                translateX.value = event.translationX * SPEED + context.value.x;
                translateY.value = event.translationY * SPEED + context.value.y;
            }
        });


    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            isPinching.value = true;

            // scale.value = saveScale.value * event.scale;

            if (saveScale.value * event.scale < maxScale.value)
                scale.value = Math.max(saveScale.value * event.scale, minScale.value);
        })
        .onEnd(() => {
            isPinching.value = false;
            saveScale.value = scale.value;
        });

    const gestures = Gesture.Simultaneous(panGesture, pinchGesture);

    const getRoom = (id) => {
        if (id < 1 || id > 68) return;

        setFloor(0);
        changeFloor(0);

        if (floor === 0) {
            setMap(images.floor0[id]);
        }
        if (floor === 1 && images.floor1[id] != undefined) {
            setMap(images.floor1[id]);
        }
        if (floor === -1 && images.floorMinus1[id] != undefined) {
            setMap(images.floorMinus1[id]);
        }

        // Animation
        translateX.value = 0;
        translateY.value = 0;
        context.value = { x: 0, y: 0 };
    }

    const changeFloor = (floor) => {
        switch (floor) {
            case -1:
                if (images.floorMinus1[room] === undefined) {
                    Snackbar.show({
                        text: 'חדר זה לא קיים בקומה מינוס 1',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                    return;
                }
                setFloor(-1);
                setMap(images.floorMinus1[room]);
                break;
            case 0:
                setFloor(0);
                setMap(images.floor0[room]);
                break;
            case 1:
                if (images.floor1[room] === undefined) {
                    Snackbar.show({
                        text: 'חדר זה לא קיים בקומה 1',
                        duration: Snackbar.LENGTH_SHORT,
                    });
                    return;
                }
                setFloor(1);
                setMap(images.floor1[room]);
                break;
        }
    }

    return (
        <GestureHandlerRootView
            // behavior="padding"
            style={styles.container}>
            {/* <GestureHandlerRootView style={styles.container}> */}

            <StatusBar translucent backgroundColor={'transparent'} barStyle={'dark-content'} />

            <GestureDetector gesture={gestures}>
                <Animated.View style={[rStyle]}>
                    {/* <Image style={[styles.map]} source={require('../../assets/imgs/F0.png')} /> */}
                    <Image style={[styles.map]} source={map} />
                </Animated.View>
            </GestureDetector>

            {/* </GestureHandlerRootView> */}

            <View style={styles.searchBar}>
                <Icon style={styles.icon} name="search" size={22} color={"#757575"} onPress={() => getRoom(parseInt(room))} />
                <TextInput
                    value={room}
                    onChangeText={(text) => setRoom(text)}
                    onSubmitEditing={() => getRoom(parseInt(room))}
                    keyboardType='numeric'
                    placeholder='Search Location...'
                    placeholderTextColor={'#757575'}
                    style={styles.input}
                />
            </View>

            <View style={styles.floorContainer}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => changeFloor(-1)}
                    style={styles.floorButton}>
                    <Text style={styles.floorText}>-1</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => changeFloor(0)}
                    style={styles.floorButton}>
                    <Text style={styles.floorText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => changeFloor(1)}
                    style={styles.floorButton}>
                    <Text style={styles.floorText}>1</Text>
                </TouchableOpacity>
            </View>

        </GestureHandlerRootView >
    )
}

export default MapScreen