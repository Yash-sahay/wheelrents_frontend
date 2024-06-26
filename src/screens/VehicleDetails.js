import { View, Text, FlatList, Dimensions, Image, TouchableOpacity, StyleSheet, PixelRatio, ScrollView, Linking } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AppHeader from '../components/AppHeader';
import { Card, Divider } from 'react-native-paper';
import { amountFormatter, baseURL, dateSimplify, timeSimplify } from '../../common';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import { appstyle } from '../styles/appstyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome6'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch, useSelector } from 'react-redux';
import AppBottomSheet from '../components/AppBottomSheet';
import AppDatePicker from '../components/AppDatePicker';
import { createBooking } from '../axios/axios_services/bookingService';
import { updateLoaderReducer } from '../redux/reducer/loaderReducer';
import AppMap from '../components/AppMap';
import Animated from 'react-native-reanimated';
import { updateUserDetails } from '../redux/reducer/userReducer';
import { MotiImage, MotiView } from 'moti';

const Device_Width = Dimensions.get('window').width
const Device_Height = Dimensions.get('window').height

const VehicleDetails = ({ route, navigation }) => {

    const overViewCardWidth = Device_Width / 3 - 15
    const data = route.params
    const [currentIndex, setCurrentIndex] = useState(0)
    const { bookingStartDate, bookingEndDate } = useSelector(state => state.userReducer)
    const dispatch = useDispatch()
    const [bottomSheet, setBottomSheet] = useState(false)
    const [bookingDetails, setBookingDetails] = useState({})
    const bottomSheetRef = useRef(null);

    useEffect(() => {
        const minimumStartDate = new Date(new Date().getTime() + 5 * 60 * 60 * 1000);
        const minimubEndDate = new Date(new Date().getTime() + 10 * 60 * 60 * 1000);
        dispatch(updateUserDetails({ bookingEndDate: minimubEndDate, bookingStartDate: minimumStartDate }))

    }, [])

    const handleBooking = async () => {
        try {
            const getTotalCost = getHoursDifference(bookingStartDate, bookingEndDate)
            dispatch(updateLoaderReducer({ loading: true }))
            const payload = { vehicleId: data._id, startDate: new Date(bookingStartDate), endDate: new Date(bookingEndDate), totalPrice: getTotalCost }
            const res = await createBooking({ data: payload });
            setBookingDetails({ id: data._id })
            setBottomSheet(true)
            dispatch(updateLoaderReducer({ loading: false }))
        } catch (error) {
            dispatch(updateLoaderReducer({ loading: false }))
        }
    }


    function getHoursDifference(dateString1, dateString2) {
        // Convert date strings to Date objects
        const date1 = new Date(dateString1);
        const date2 = new Date(dateString2);

        // Calculate the time difference in milliseconds
        const timeDifference = date2 - date1;

        // Convert milliseconds to hours
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        return Math.round(hoursDifference * data.cost);
    }


    function openGps() {
        var url = `geo:${data?.latitude},${data?.longitude}`
        openExternalApp(url)
    }

    function openExternalApp(url) {
        try {
            Linking.openURL(url);
        } catch (error) {

            alert('Don\'t know how to open URI: ' + url);
        }
    }


    return (
        <>
            <AppBottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['65%', '97%']} bottomSheet={bottomSheet} setBottomSheet={setBottomSheet}>
                {bookingDetails?.id ? (
                    <View style={{ width: "100%", height: '60%', alignItems: 'center', justifyContent: 'space-between', padding: 20 }}>
                        <MotiView
                            transition={{ delay: 100, damping: 15, mass: 1 }}
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
                            <AppText style={{ fontSize: 25, fontWeight: 'bold' }}>Booking Success!</AppText>
                        </MotiView>
                        <MotiView
                            transition={{ delay: 200, damping: 15, mass: 1 }}
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
                            <MaterialCommunityIcons color={'#48c681'} name="bookmark-check" size={200} />
                        </MotiView>
                        <MotiView
                            style={{ width: "100%" }}
                            transition={{ delay: 300, damping: 15, mass: 1 }}
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
                            <AppButton onPress={() => navigation.navigate("Booking")} icon={'bookmark-check'} style={{ padding: 5, width: '100%' }} >View your bookings</AppButton>
                        </MotiView>
                    </View>
                ) : (
                    <AppDatePicker />
                )}

            </AppBottomSheet>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: appstyle.pri, }]}>
                <AppHeader name={data?.name} ui2 accent={'opp'} />
                <ScrollView contentContainerStyle={{ width: '100%', paddingBottom: 100 }}>
                    <View>
                        <View style={{ width: '100%', alignItems: 'center', paddingBottom: 40, backgroundColor: appstyle.tri }}>
                            <Carousel
                                data={data?.files}
                                renderItem={({ item, index }) => <Animated.Image
                                    resizeMode="cover" style={{ width: '100%', borderRadius: 10, height: 200 }} source={{ uri: baseURL() + "public/vehicle/" + item?.fileName }} />}
                                sliderWidth={Device_Width}
                                itemWidth={Device_Width - 50}
                                onSnapToItem={(index) => setCurrentIndex(index)}
                            />
                        </View>
                        <View style={{ borderTopLeftRadius: 10, marginTop: -10, borderTopRightRadius: 10, backgroundColor: appstyle.pri, height: 10 }}></View>

                        <View style={{ width: '100', padding: 10, paddingBottom: 0 }}>
                            <AppText style={{ fontWeight: 'bold', fontSize: 20, color: appstyle.textBlack, textTransform: "capitalize" }}>Overview</AppText>
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row', paddingTop: 10, flexWrap: 'wrap' }}>
                            <View style={{ width: overViewCardWidth, padding: 10, paddingVertical: 15, marginLeft: 10, backgroundColor: appstyle.tri, borderRadius: 15, elevation: 10, shadowColor: appstyle.shadowColor }}>
                                <MaterialCommunityIcons size={30} color={appstyle.pri} name="car-shift-pattern" />
                                <AppText style={{ fontSize: PixelRatio.get() * 3.5, color: '#eee', marginTop: 10 }}>Transmission</AppText>
                                <AppText style={{ color: appstyle.pri, fontWeight: 'bold', textTransform: "capitalize" }} >{data?.transmission || "N/A"}</AppText>
                            </View>
                            <View style={{ width: overViewCardWidth, padding: 10, marginLeft: 10, backgroundColor: appstyle.tri, borderRadius: 15, elevation: 10, shadowColor: appstyle.shadowColor }}>
                                <MaterialCommunityIcons size={30} color={appstyle.pri} name="fuel" />
                                <AppText style={{ fontSize: PixelRatio.get() * 3.5, color: '#eee', marginTop: 10 }}>Power Source</AppText>
                                <AppText style={{ fontWeight: 'bold', color: appstyle.pri, textTransform: "capitalize" }} >{data?.fuelType || "N/A"}</AppText>
                            </View>
                            <View style={{ width: overViewCardWidth, padding: 10, marginLeft: 10, backgroundColor: appstyle.tri, borderRadius: 15, elevation: 10, shadowColor: appstyle.shadowColor }}>
                                {data?.vehicleCategory == 'car' && <MaterialCommunityIcons size={30} color={appstyle.pri} name="car" />}
                                {data?.vehicleCategory == 'bike' && <MaterialCommunityIcons size={30} color={appstyle.pri} name="motorbike" />}
                                <AppText style={{ fontSize: PixelRatio.get() * 3.5, color: '#eee', marginTop: 10 }}>Vehicle Type</AppText>
                                <AppText style={{ fontWeight: 'bold', color: appstyle.pri, textTransform: "capitalize" }} >{data?.vehicleType || "N/A"}</AppText>
                            </View>
                        </View>

                        <View style={{ width: '100', marginTop: 20, padding: 10 }}>
                            <CustomTile mode="elevated">
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <AppText style={{ fontWeight: 'bold', fontSize: 14, color: appstyle.textSec }}>Pick Up</AppText>
                                    <AppText style={{ fontWeight: 'bold', fontSize: 14, color: appstyle.textSec }}>Drop Off</AppText>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{dateSimplify(bookingStartDate) || "N/A"}</AppText>
                                    <AppText style={{ fontWeight: '900' }}><AntDesign name="swap" size={20} color={appstyle.textBlack} /> </AppText>
                                    <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{dateSimplify(bookingEndDate) || "N/A"}</AppText>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{timeSimplify(bookingStartDate)}</AppText>
                                    <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{timeSimplify(bookingEndDate)}</AppText>
                                </View>
                                <AppButton style={{ width: 110, marginTop: 10, borderWidth: 1, borderColor: 'grey' }} outlined icon={"calendar"} onPress={() => { setBottomSheet(true); setBookingDetails({}) }}>Change</AppButton>
                            </CustomTile>
                            <CustomTile
                                onPress={() => { }}
                            // onPress={openGps}
                            >

                                <AppText style={{ fontWeight: 'bold', fontSize: 18, color: appstyle.textBlack }}><FontAwesome size={18} name="map-pin" /> Address</AppText>
                                {/* <AppMap
                                lat={data?.latitude}
                                long={data?.longitude}
                                /> */}
                                <AppText style={{ color: appstyle.textBlack }} >{data?.address1 || "N/A"}, {data?.address2 || "N/A"}, {data?.city || "N/A"}, {data?.country || "N/A"}</AppText>
                                <AppButton style={{ width: 140, marginTop: 10, borderWidth: 1, borderColor: 'grey' }} outlined icon={"map"} onPress={openGps} >Open in map</AppButton>
                            </CustomTile>
                            <CustomTile>
                                <AppText style={{ fontWeight: 'bold', fontSize: 18, color: appstyle.textBlack }}><FontAwesome size={18} name="briefcase" /> Desription</AppText>
                                <AppText style={{ color: appstyle.textBlack }}  >{data?.description || "N/A"}</AppText>
                            </CustomTile>
                        </View>
                    </View>

                </ScrollView>
                <View style={{ width: '100%', padding: 10, paddingLeft: 20, borderTopLeftRadius: 20, borderTopRightRadius: 0, backgroundColor: appstyle?.tri, borderColor: appstyle.textSec, borderTopWidth: 1, position: 'absolute', bottom: 0, left: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                        <AppText style={{ fontWeight: 'bold', fontSize: 12, color: appstyle.pri }}>Total Price</AppText>
                        <AppText style={{ fontWeight: 'bold', fontSize: 20, color: "lightgreen" }}>₹{amountFormatter(getHoursDifference(bookingStartDate, bookingEndDate))}</AppText>
                    </View>
                    <AppButton onPress={handleBooking} outlined icon={'bookmark-check'} style={{ paddingVertical: 5, }} >Book Now</AppButton>
                </View>
            </View>
        </>
    )
}



const CustomTile = ({ children, mode = null, onPress }) => {
    return <View onTouchEnd={onPress} style={{ borderWidth: 1, borderColor: '#f4f4f2', elevation: 0, marginBottom: 10, shadowColor: appstyle.shadowColor, backgroundColor: appstyle.pri, padding: 10, borderRadius: 20 }}>
        {children}
    </View>
}

export default VehicleDetails;