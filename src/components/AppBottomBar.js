import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { appstyle } from '../styles/appstyle'
import { useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome'
import { useSelector } from 'react-redux';
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
// import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';


const AppBottomBar = () => {
    const { currRoute, role } = useSelector(state => state.userReducer)
    const navigation = useNavigation()
    
    
    const navigationClient = [
        { routeName: role.includes("host") ? 'HostDashboard' : 'Home', icon: 'home' },
        { routeName: 'WishList', icon: 'heart' },
        { routeName: 'User', icon: 'user' },
    ]
    const navigationHost = [
        { routeName: role.includes("host") ? 'HostDashboard' : 'Home', icon: 'home' },
        { routeName: 'AddVehicle', icon: 'plus' },
        { routeName: 'User', icon: 'user' },
    ]


    const translateY = useSharedValue(0);

    const styleHeader = useAnimatedStyle(() => ({
        transform: [{
            translateY: withSpring(translateY.value, {
                duration: 500,
                // easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                reduceMotion: ReduceMotion.System,

            })
        }]
    }))


    useEffect(() => {
        translateY.value = 0
        if (routsVerify(currRoute)) {
        }
        return () => {
            translateY.value = 100
        }
    }, [currRoute])

    const IconsTile = ({ icon, active, routeName }) => {
        return (
            <Pressable onPress={() => navigation.navigate(routeName)} style={!active ? style.tileBtn : style.tileBtnActive}>
                <FontAwesome6 name={icon} color={active ? appstyle.tri : appstyle.accent} size={ active ? 20 : 15} />
            </Pressable>
        )
    }



    return (
        <>
            <Animated.View style={[style.container, styleHeader]}>
                <LinearGradient colors={['transparent', '#ffffff94', '#ffffffdb']} style={[style.linearGradient]} >
                    <View style={style.child}>
                        {role.includes("host") && navigationHost?.map(items => <IconsTile routeName={items.routeName} icon={items.icon} active={currRoute == items?.routeName} />)}
                        {role.includes("client") && navigationClient?.map(items => <IconsTile routeName={items.routeName} icon={items.icon} active={currRoute == items?.routeName} />)}
                    </View>
                </LinearGradient>
            </Animated.View>
        </>
    )
}

const routsVerify = (routeName) => {
    switch (routeName) {
        case "":
            return true

        default:
            return false;
    }
}


const style = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 10,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    child: {
        width: '100%',
        borderRadius: 100,
        height: 70,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: appstyle.tri,
        elevation: 30,
        shadowColor: appstyle.tri
    },
    tileBtnActive: {
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: 'white'
    },
    tileBtn: {
        height: 50,
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
    },
    absolute: {
        position: "absolute",
        height: 80,
        left: 0,
        bottom: 0,
        right: 0
    },
    linearGradient: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
})

export default AppBottomBar