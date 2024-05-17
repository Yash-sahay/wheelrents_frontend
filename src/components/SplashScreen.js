import { View, Text, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppText from './AppText'
import { appstyle } from '../styles/appstyle'
import { AnimatePresence, MotiView } from 'moti'


const SplashScreen = ({ loaded, setloaded }) => {
    return (
        <AnimatePresence exitBeforeEnter>
             <StatusBar barStyle={"light-content"} backgroundColor={appstyle.tri} />
           { !loaded && <MotiView  
             from={{
                opacity: 1,
            }}
            animate={{
                opacity: 1,
            }}
            exit={{
                opacity: 0,
              }}
           style={{ height: "100%", width: "100%", position: 'absolute', alignItems: 'center', justifyContent: 'center', zIndex: 9999999999, backgroundColor: appstyle.tri }}>
                <StatusBar animated backgroundColor={'transparent'} barStyle={"dark-content"} translucent />
                <MotiView
                    from={{
                        opacity: 0,
                        translateY: 100,
                    }}
                    animate={{
                        opacity: 1,
                        translateY: 0,
                    }}
                    exit={{
                        opacity: 0,
                        translateY: 100,
                      }}
                >
                    <AppText style={{ fontWeight: "bold", fontSize: 40, color: appstyle.pri }}>WheelRents</AppText>
                </MotiView>
                <MotiView
                    from={{
                        opacity: 0,
                        translateY: 100,
                    }}
                    animate={{
                        opacity: 1,
                        translateY: 0,
                    }}
                    exit={{
                        opacity: 0,
                        translateY: 100,
                      }}
                    >
                    <AppText style={{ fontWeight: "100", fontSize: 12, color: appstyle.textSec }}>Where Every Mile Marks an Adventure!</AppText>
                </MotiView>
            </MotiView>}
        </AnimatePresence>
    )
}

export default SplashScreen