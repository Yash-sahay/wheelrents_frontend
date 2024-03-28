import { View, Text, StyleSheet, Alert } from 'react-native'
import React from 'react'
import { ActivityIndicator, Icon } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { appstyle } from '../styles/appstyle'
import { BlurView } from '@react-native-community/blur'

const AppLoader = () => {
    const loaderData = useSelector(state => state.loaderReducer);
    if (!loaderData?.loading) return <></>
    return (
        <>
            <View style={{ position: 'absolute', zIndex: 100, ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' }}>
                <BlurView
                    style={styles.absolute}
                    blurType="light"
                    blurAmount={10}
                    reducedTransparencyFallbackColor="white"
                />
                <ActivityIndicator size={50} color={appstyle.tri} style={{}} />
                <Icon color={appstyle.tri} icon={'camera'} size={100} />
            </View>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center"
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
});

export default AppLoader