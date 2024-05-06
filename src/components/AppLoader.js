import { View, Text, StyleSheet, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Icon } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { appstyle } from '../styles/appstyle'
import { BlurView } from '@react-native-community/blur'
import LottieView from 'lottie-react-native'
import AppText from './AppText'
import { AnimatePresence, MotiView } from 'moti'

const AppLoader = () => {
    const loaderData = useSelector(state => state.loaderReducer);
    const [endingState, setendingState] = useState(false)

    useEffect(() => {
        if(!loaderData?.loading){
            setTimeout(() => {
                setendingState(true)
            }, 1000);
        }else{
            setendingState(false)
        }
    }, [loaderData])
    

    return (
        <>

            <MotiView
                style={{ position: 'absolute', transform: [{ translateX: !endingState ? 0 : 5000 }], display: 'flex', zIndex: 100, ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' }}>
                <AnimatePresence exitBeforeEnter>
                    {loaderData?.loading && (
                        <MotiView
                            style={{ ...styles.absolute, backgroundColor: 'transparent', }}
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            
                            exitTransition={{
                                delay: 700,
                                type: 'timing',
                            }}
                        >
                            <BlurView
                                style={styles.absolute}
                                blurType="light"
                                blurAmount={50}
                                reducedTransparencyFallbackColor="white"
                            />
                        </MotiView>
                    )}
                    {loaderData?.loading && (
                        <MotiView
                            style={{ backgroundColor: 'transparent', }}
                            from={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{delay: 500}}
                        >
                            <LottieView
                                // ref={animationRef}
                                style={{ height: 250, width: 250 }}
                                source={require('../../assets/animation/vehicle_loading.json')} autoPlay loop={true} />
                            <AppText style={{ fontWeight: "bold", textAlign: 'center', fontSize: 18, color: appstyle.textSec }}>{"Please wait, \n while we prepare your experience."}</AppText>
                        </MotiView>
                    )}
                </AnimatePresence>
            </MotiView>
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
        backgroundColor: 'rgba(255,255,255,0.8)',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    }
});

export default AppLoader