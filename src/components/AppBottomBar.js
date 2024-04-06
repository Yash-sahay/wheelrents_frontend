import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import { appstyle } from '../styles/appstyle'
import { useNavigation, useRoute } from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/Ionicons'
import { useSelector } from 'react-redux';
import Animated, { ReduceMotion, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
// import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import AppText from "./AppText"


const AppBottomBar = () => {
    const { currRoute, role } = useSelector(state => state.userReducer)
    const navigation = useNavigation()
    
    
    const navigationClient = [
        { routeName: role.includes("host") ? 'HostDashboard' : 'Home', icon: 'home', tilename: 'Home' },
        { routeName: 'WishList', icon: 'heart', tilename: 'Wishlist' },
        { routeName: 'Booking', icon: 'bookmark', tilename: 'Bookings' },
        { routeName: 'User', icon: 'person', tilename: 'profile' },
    ]
    const navigationHost = [
        { routeName: role.includes("host") ? 'HostDashboard' : 'Home', icon: 'home', tilename: 'Home' },
        { routeName: 'AddVehicle', icon: 'add', tilename: 'Add' },
        { routeName: 'Booking', icon: 'bookmark', tilename: 'Bookings' },
        { routeName: 'User', icon: 'person', tilename: 'profile' },
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

    const IconsTile = ({ icon, active, routeName, tilename }) => {
        return (
            <Pressable onPress={() => navigation.navigate(routeName)} style={[style.tileBtn]}>
                <FontAwesome6 name={!active ? icon + "-outline" : icon} color={appstyle.accent} size={20} />
                {/* {active && <AppText style={{color: appstyle.pri, fontSize: 10}}>{tilename}</AppText>} */}
            </Pressable>
        )
    }



    return (
        <>
            <Animated.View style={[style.container, styleHeader]}>
                <LinearGradient colors={['transparent', '#ffffff94', '#ffffffdb']} style={[style.linearGradient]} >
                    <View style={style.child}>
                        {role.includes("host") && navigationHost?.map(items => <IconsTile routeName={items.routeName} tilename={items?.tilename} icon={items.icon} active={currRoute == items?.routeName} />)}
                        {role.includes("client") && navigationClient?.map(items => <IconsTile routeName={items.routeName} tilename={items?.tilename} icon={items.icon} active={currRoute == items?.routeName} />)}
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
        // flexDirection: 'row',
        justifyContent: 'center',
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
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
})

export default AppBottomBar