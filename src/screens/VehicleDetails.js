import { View, Text, FlatList, Dimensions, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useRef, useState } from 'react'
import AppHeader from '../components/AppHeader';
import { Card, Divider } from 'react-native-paper';
import { baseURL, dateSimplify } from '../../common';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import { appstyle } from '../styles/appstyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome6'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useDispatch, useSelector } from 'react-redux';
import AppBottomSheet from '../components/AppBottomSheet';
import AppDatePicker from '../components/AppDatePicker';
import { createBooking } from '../axios/axios_services/bookingService';
import { updateLoaderReducer } from '../redux/reducer/loaderReducer';

const Device_Width = Dimensions.get('window').width
const Device_Height = Dimensions.get('window').height

const VehicleDetails = ({ route }) => {
    const data = route.params
    const [currentIndex, setCurrentIndex] = useState(0)
    const { bookingStartDate, bookingEndDate } = useSelector(state => state.userReducer)
    const dispatch = useDispatch()
    const [bottomSheet, setBottomSheet] = useState(false)
    const bottomSheetRef = useRef(null);

    const handleBooking = async () => {
        try {
            const getTotalCost = getHoursDifference(bookingStartDate, bookingEndDate)
            dispatch(updateLoaderReducer({ loading: true }))
            const payload = { vehicleId: data._id, startDate: new Date(bookingStartDate), endDate: new Date(bookingEndDate), totalPrice: getTotalCost }
            const res = await createBooking({ data: payload });
            alert(JSON.stringify(res))
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


    return (
        <>
            <AppBottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['1%', '60%', '97%']} bottomSheet={bottomSheet} setBottomSheet={setBottomSheet}>
                <AppDatePicker />
            </AppBottomSheet>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: appstyle.pri, }]}>
                <AppHeader name={'Vehicle Details'} ui2 accent={'opp'} />
                <View style={{ width: '100%' }}>
                    <View>
                        <View style={{ width: '100%', alignItems: 'center', paddingBottom: 40, backgroundColor: appstyle.tri }}>
                            <Carousel
                                data={data?.files}
                                renderItem={({ item, index }) => <Card.Cover resizeMode="cover" style={{ width: '100%', borderRadius: 10 }} source={{ uri: baseURL() + "public/vehicle/" + item?.fileName }} />}
                                sliderWidth={Device_Width}
                                itemWidth={Device_Width - 50}
                                onSnapToItem={(index) => setCurrentIndex(index)}
                            />
                            <View style={{ width: '100%', marginTop: -10, alignItems: 'center' }}>
                                <FlatList
                                    horizontal
                                    data={data.files}
                                    style={{ borderRadius: 10, backgroundColor: appstyle.pri, }}
                                    contentContainerStyle={{ paddingVertical: 3 }}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <TouchableOpacity
                                                disabled
                                                onPress={() => setCurrentIndex(index)}
                                                style={[{ backgroundColor: appstyle.pri, borderRadius: 10, overflow: 'hidden', marginHorizontal: 3, borderWidth: 1, borderColor: "transparent", transform: [{ scale: .8 }], }, (currentIndex == index) && { borderWidth: 2, borderColor: appstyle.tri, borderStyle: 'dotted', transform: [{ scale: 1.2 }], }]}>
                                                <Image resizeMode='cover' source={{ uri: baseURL() + "public/vehicle/" + item?.fileName }} height={20} width={20} />
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ borderTopLeftRadius: 10, marginTop: -10, borderTopRightRadius: 10, backgroundColor: appstyle.pri, height: 10 }}></View>

                        <View style={{ width: '100', padding: 10 }}>
                            <AppText style={{ color: 'grey', fontWeight: '900', fontSize: 12, textTransform: 'capitalize' }}><FontAwesome name="user-gear" size={12} />  {data?.transmission}    <FontAwesome name="gas-pump" size={12} />  {data?.fuelType}</AppText>
                            <AppText style={{ fontWeight: 'bold', fontSize: 20, color: appstyle.tri }}>{data?.name}</AppText>
                        </View>
                        <Divider />
                        <View style={{ width: '100', marginTop: 20, padding: 10 }}>
                            <CustomTile mode="elevated">
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <AppText style={{ fontWeight: 'bold', fontSize: 14, color: appstyle.shadowColor }}>Pick Up</AppText>
                                    <AppText style={{ fontWeight: 'bold', fontSize: 14, color: appstyle.shadowColor }}>Drop Off</AppText>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <AppText style={{ color: appstyle.tri, fontWeight: 'bold'}}>{dateSimplify(bookingStartDate) || "N/A"}</AppText>
                                    <AppText style={{ fontWeight: '900' }}><AntDesign name="swap" size={20} color={appstyle.tri} /> </AppText>
                                    <AppText style={{ color: appstyle.tri, fontWeight: 'bold' }}>{dateSimplify(bookingEndDate) || "N/A"}</AppText>
                                </View>
                                <AppButton style={{ width: 100, marginTop: 10 }} icon={"calendar"} outlined onPress={() => setBottomSheet(true)}>Change</AppButton>
                            </CustomTile>
                            <CustomTile>
                                <AppText style={{ fontWeight: 'bold', fontSize: 14, color: appstyle.tri }}>Address</AppText>
                                <AppText style={{ color: appstyle.tri }} >{data.address1 || "N/A"}, {data.address2 || "N/A"}</AppText>
                            </CustomTile>
                            <CustomTile>
                                <AppText style={{ fontWeight: 'bold', fontSize: 14, color: appstyle.tri }}>Desriptions</AppText>
                                <AppText style={{ color: appstyle.tri }} >{data.description || "N/A"}</AppText>
                            </CustomTile>
                        </View>
                    </View>

                </View>
                <View style={{ width: '100%', padding: 10, paddingLeft: 20, borderTopLeftRadius: 20, borderTopRightRadius: 0, backgroundColor: appstyle?.tri, borderColor: 'lightgrey', borderTopWidth: 1, position: 'absolute', bottom: 0, left: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                        <AppText style={{ fontWeight: 'bold', fontSize: 12, color: appstyle.pri }}>Total Price</AppText>
                        <AppText style={{ fontWeight: 'bold', fontSize: 20, color: "lightgreen" }}>₹{getHoursDifference(bookingStartDate, bookingEndDate)}</AppText>
                    </View>
                    <AppButton onPress={handleBooking} outlined icon={'cash-fast'} style={{ paddingVertical: 5, }} >Proceed to Pay</AppButton>
                </View>
            </View>
        </>
    )
}



const CustomTile = ({ children, mode = null }) => {
    return <View style={{ borderWidth: 2, borderTopWidth: 2, elevation: mode == "elevated" ? 10 : 0, borderColor: '#fff', elevation: 10, marginBottom: 10, shadowColor: appstyle.shadowColor, backgroundColor: appstyle.accent, borderWidth: 2, padding: 10, borderRadius: 20 }}>
        {children}
    </View>
}

export default VehicleDetails;