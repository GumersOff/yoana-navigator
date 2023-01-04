import { StyleSheet, Dimensions } from 'react-native'
import React from 'react'

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },

    map: {
        aspectRatio: 1,
        resizeMode: 'contain',
        transform: [
            { translateX: -1000 },
            { translateY: 1000 }
        ]
    },

    circle: {
        height: 80,
        aspectRatio: 1,
        backgroundColor: 'blue',
        borderRadius: 40,
        opacity: 0.8,
    },

    searchBar: {
        position: 'absolute',
        top: 50,
        backgroundColor: '#FFF',
        width: windowWidth - 50,
        borderRadius: 50,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 1,
    },

    input: {
        padding: 0,
        paddingVertical: 10,
        marginLeft: 5,
        color: '#000',
        width: '100%',
    },

    floorContainer: {
        position: 'absolute',
        zIndex: 10,
        bottom: 25,
        right: 25,
    },

    floorButton: {
        marginVertical: 3,
        backgroundColor: '#626262',
        borderRadius: 5,
        // width: 50,
        // height: 50,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
        padding: 15,
    },

    floorText: {
        color: '#FFF',
    },
})

export default styles;