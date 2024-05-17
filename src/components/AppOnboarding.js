import { View, Text, StatusBar, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { appstyle } from '../styles/appstyle'
import AppText from './AppText'
import AppButton from './AppButton'
import { AnimatePresence, MotiView } from 'moti'
import { MotiPressable } from 'moti/interactions'

const AppOnboarding = ({ navigation }) => {
    return (
        <AnimatePresence exitBeforeEnter >
            <View style={{ backgroundColor: appstyle.tri, flex: 1, padding: 20, justifyContent: 'space-between' }}>
                <StatusBar barStyle={"light-content"} backgroundColor={appstyle.tri} />
                <View>
                    <MotiView
                        delay={3200}
                        from={{
                            opacity: 0,
                            translateY: 60,
                        }}
                        animate={{
                            opacity: 1,
                            translateY: 0,
                        }}
                        exit={{
                            opacity: 0,
                            translateY: 60,
                        }}
                    >
                        <AppText style={{ fontSize: 25, color: appstyle.pri, fontWeight: "bold" }}>WheelRents</AppText>
                    </MotiView>
                </View>
                <View>
                    <MotiView
                        delay={3500}
                        from={{
                            opacity: 0,
                            translateY: 60,
                        }}
                        animate={{
                            opacity: 1,
                            translateY: 0,
                        }}
                        exit={{
                            opacity: 0,
                            translateY: 60,
                        }}
                    >
                        <AppText style={{ fontSize: 30, color: appstyle.pri, fontWeight: "bold" }}>Where Every Mile Marks an Adventure!</AppText>
                    </MotiView>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 40 }}>
                        <MotiView
                            style={{ width: '50%' }}
                            delay={3800}
                            from={{
                                opacity: 0,
                                translateY: 60,
                            }}
                            animate={{
                                opacity: 1,
                                translateY: 0,
                            }}
                            exit={{
                                opacity: 0,
                                translateY: 60,
                            }}
                        >
                            <AppButton
                                onPress={() => navigation.navigate("Login")}
                                style={{ backgroundColor: appstyle.pri, width: '100%', paddingVertical: 10, paddingHorizontal: 20 }} textColor={appstyle.textBlack}>Log in</AppButton>
                        </MotiView>

                        <MotiView
                            delay={3900}
                            from={{
                                opacity: 0,
                                translateY: 60,
                            }}
                            animate={{
                                opacity: 1,
                                translateY: 0,
                            }}
                            exit={{
                                opacity: 0,
                                translateY: 60,
                            }}
                        >
                            <TouchableOpacity style={{ backgroundColor: "#3a3c3e", height: 60, marginTop: -2, borderRadius: 20, paddingVertical: 10, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ height: 25, width: 20 }} source={require("../../assets/images/google-icon.png")} />
                            </TouchableOpacity>
                        </MotiView>

                        <MotiView
                            delay={4000}
                            from={{
                                opacity: 0,
                                translateY: 60,
                            }}
                            animate={{
                                opacity: 1,
                                translateY: 0,
                            }}
                            exit={{
                                opacity: 0,
                                translateY: 60,
                            }}
                        >
                            <TouchableOpacity style={{ backgroundColor: "#3a3c3e", height: 60, marginTop: -2, borderRadius: 20, paddingVertical: 10, padding: 20, alignItems: 'center', justifyContent: 'center' }}>
                                <Image style={{ height: 20, width: 16 }} source={require("../../assets/images/apple-icon.png")} />
                            </TouchableOpacity>
                        </MotiView>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 40 }}>
                        <MotiView
                            delay={4200}
                            from={{
                                opacity: 0,
                                translateY: 60,
                            }}
                            animate={{
                                opacity: 1,
                                translateY: 0,
                            }}
                            exit={{
                                opacity: 0,
                                translateY: 60,
                            }}
                        >
                            <TouchableOpacity style={{ backgroundColor: "#3a3c3e", borderRadius: 20, padding: 10, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' }}>
                            </TouchableOpacity>
                        </MotiView>
                        <MotiView
                            delay={4300}
                            from={{
                                opacity: 0,
                                translateY: 60,
                            }}
                            animate={{
                                opacity: 1,
                                translateY: 0,
                            }}
                            exit={{
                                opacity: 0,
                                translateY: 60,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => navigation.navigate("Signin")}
                            >
                                <AppText style={{ color: appstyle.pri, textDecorationLine: 'underline' }}>Sign up</AppText>
                            </TouchableOpacity>
                        </MotiView>
                    </View>
                </View>
            </View>
        </AnimatePresence>
    )
}

export default AppOnboarding