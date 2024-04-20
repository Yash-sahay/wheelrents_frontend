import React from 'react'
import { amountFormatter, dateSimplify, timeSimplify } from '../../common'
import { appstyle } from '../styles/appstyle'
import { ScrollView, StatusBar, View } from 'react-native'
import AppText from '../components/AppText'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/Ionicons'
import AppButton from '../components/AppButton'
import AppHeader from '../components/AppHeader'
import { finish_trip } from '../axios/axios_services/bookingService'
import { useSelector } from 'react-redux'

const PaymentOverView = ({ route, navigation }) => {
    const endTripModalValues = route.params?.endTripModalValues;
    const { role } = useSelector(state => state.userReducer)

    const extendChargeAmt = endTripModalValues?.extendedHours > 0 ? (endTripModalValues?.cost * (endTripModalValues?.extendedHours)) * 1.5 : 0
    const nonInformedExtendedChargeAmt = endTripModalValues?.editionalTime?.hours > 0 ? (endTripModalValues?.cost * (endTripModalValues?.editionalTime?.hours)) * 2 : 0

    const finishTripApi = async () => {
        try {
            const payload = {
                "bookingId": endTripModalValues._id,
                "finalExtendedHours": extendChargeAmt + nonInformedExtendedChargeAmt,
                "extendedPrice": extendChargeAmt,
                "nonInformedExtendedPrice": nonInformedExtendedChargeAmt
            }
            const final = await finish_trip(payload)
            navigation.goBack()
            alert("done")
        } catch (error) {
            console.error("err", error)
        }
    }

    return (
        <>
            <StatusBar animated barStyle={"light-content"} backgroundColor={appstyle.tri} />
            <AppHeader ui2  name={"Payment Overview"}/>
            <ScrollView style={{ backgroundColor: appstyle.pri }} contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={{ flex: 1, padding: 20, paddingTop: 20 }}>
                    <CustomTile style={{ backgroundColor: '#f4f4f2' }}>
                        <AppText style={{ fontWeight: "700", fontSize: 16, marginBottom: 5, color: appstyle.textSec, textTransform: 'capitalize', textAlign: 'center' }}>Starting Payment</AppText>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingTop: 10 }}>
                            <AppText style={{ fontWeight: 'bold', fontSize: 14, color: appstyle.textSec }}>Pick Up</AppText>
                            <AppText style={{ fontWeight: 'bold', fontSize: 14, color: appstyle.textSec }}>Drop Off</AppText>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 }}>
                            <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{dateSimplify(endTripModalValues?.startDate) || "N/A"}</AppText>
                            <AppText style={{ fontWeight: '900' }}><AntDesign name="swap" size={20} color={appstyle.textBlack} /> </AppText>
                            <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{dateSimplify(endTripModalValues?.endDate) || "N/A"}</AppText>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 }}>
                            <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{timeSimplify(endTripModalValues?.startDate)}</AppText>
                            <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{timeSimplify(endTripModalValues?.endDate)}</AppText>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, borderTopWidth: 2, borderColor: 'lightgrey', borderStyle: 'dashed', marginTop: 10, alignItems: 'center' }}>
                            <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>Amount Paid</AppText>
                            <AppText variant="titleLarge" style={{ color: '#008542', textAlign: 'right', fontWeight: '900', fontSize: 25, opacity: 0.7, textDecorationLine: "line-through" }}>₹{amountFormatter(endTripModalValues?.totalPrice)}</AppText>
                        </View>
                    </CustomTile>
                    {endTripModalValues?.extendedHours > 0 && (
                        <CustomTile style={{ elevation: 30, shadowColor: appstyle.shadowColor }}>
                            <AppText style={{ fontWeight: "700", fontSize: 16, marginBottom: 5, color: appstyle.textSec, textTransform: 'capitalize', marginTop: 10, textAlign: 'center' }}>Extend Charges</AppText>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingTop: 10 }}>
                                <AppText style={{ fontWeight: 'bold', fontSize: 14, color: appstyle.textSec }}>Extended From</AppText>
                                <AppText style={{ fontWeight: 'bold', fontSize: 14, color: appstyle.textSec }}>Extended To</AppText>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 }}>
                                <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{dateSimplify(endTripModalValues?.endDate) || "N/A"}</AppText>
                                <AppText style={{ fontWeight: '900' }}><AntDesign name="swap" size={20} color={appstyle.textBlack} /> </AppText>
                                <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{dateSimplify(endTripModalValues?.endDate, endTripModalValues.extendedHours) || "N/A"}</AppText>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, }}>
                                <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{timeSimplify(endTripModalValues?.endDate)}</AppText>
                                <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{timeSimplify(endTripModalValues?.endDate, endTripModalValues.extendedHours)}</AppText>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 15, borderTopWidth: 2, borderColor: '#f4f4f2', marginTop: 10, paddingTop: 10 }}>
                                <MaterialCommunityIcons name="timeline-clock" size={20} />
                                <AppText style={{ color: appstyle.textSec, fontWeight: 'bold' }}> Extended for {endTripModalValues?.extendedHours} {endTripModalValues?.extendedHours > 1 ? "hours" : "hour"} </AppText>

                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, borderTopWidth: 2, borderColor: '#f4f4f2', borderStyle: 'dashed', marginTop: 10, alignItems: 'center' }}>
                                <View>
                                    <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>Amount Payble</AppText>
                                    <AppText style={{ color: appstyle.textSec, fontSize: 10, fontWeight: 'bold' }}>(hourly cost × extended hours × 1.5)</AppText>
                                </View>
                                <AppText variant="titleLarge" style={{ color: '#008542', textAlign: 'right', fontWeight: '900', fontSize: 25 }}>₹{amountFormatter((endTripModalValues.cost * endTripModalValues?.extendedHours) * 1.5)}</AppText>
                            </View>
                        </CustomTile>
                    )}
                    {endTripModalValues?.editionalTime?.hours > 0 && (
                        <>
                            <MaterialCommunityIcons name="plus" style={{ alignSelf: 'center', color: 'lightgrey', marginLeft: 10, fontWeight: 'bold', marginBottom: 10 }} size={35} />
                            <CustomTile style={{ elevation: 30, shadowColor: appstyle.shadowColor }}>
                                <AppText style={{ fontWeight: "700", fontSize: 16, marginBottom: 5, color: appstyle.textSec, textTransform: 'capitalize', marginTop: 10, textAlign: 'center' }}>Non Informed Extend Charges</AppText>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingTop: 10 }}>
                                    <AppText style={{ fontWeight: 'bold', fontSize: 14, color: appstyle.textSec }}>Extended From</AppText>
                                    <AppText style={{ fontWeight: 'bold', fontSize: 14, color: appstyle.textSec }}>Extended To</AppText>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 }}>
                                    <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{dateSimplify(endTripModalValues?.endDate, endTripModalValues.extendedHours) || "N/A"}</AppText>
                                    <AppText style={{ fontWeight: '900' }}><AntDesign name="swap" size={20} color={appstyle.textBlack} /> </AppText>
                                    <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{dateSimplify(new Date()) || "N/A"}</AppText>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, }}>
                                    <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{timeSimplify(endTripModalValues?.endDate, endTripModalValues.extendedHours)}</AppText>
                                    <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{timeSimplify(new Date())}</AppText>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 15, borderTopWidth: 2, borderColor: '#f4f4f2', marginTop: 10, paddingTop: 10 }}>
                                    <MaterialCommunityIcons name="timeline-clock" size={20} />
                                    <AppText style={{ color: appstyle.textSec, fontWeight: 'bold' }}> Extended for {endTripModalValues?.editionalTime?.hours} {endTripModalValues?.editionalTime?.hours > 1 ? "hours" : "hour"} </AppText>

                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, borderTopWidth: 2, borderColor: '#f4f4f2', borderStyle: 'dashed', marginTop: 10, alignItems: 'center' }}>
                                    <View>
                                        <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>Amount Payble</AppText>
                                        <AppText style={{ color: appstyle.textSec, fontSize: 10, fontWeight: 'bold' }}>(hourly cost × extended hours × 2)</AppText>
                                    </View>
                                    <AppText variant="titleLarge" style={{ color: '#008542', textAlign: 'right', fontWeight: '900', fontSize: 25 }}>₹{amountFormatter((endTripModalValues?.cost * endTripModalValues?.editionalTime?.hours) * 2)}</AppText>
                                </View>
                            </CustomTile>
                        </>
                    )}

                </View>
            </ScrollView>
            <View style={{ width: '100%', padding: 10, paddingLeft: 20, paddingRight: 20, backgroundColor: appstyle?.pri, borderColor: '#f4f4f2', borderTopWidth: 2, position: 'absolute', bottom: 0, left: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                    <AppText style={{ fontWeight: 'bold', fontSize: 12, color: appstyle.tri }}>Total Amt</AppText>
                    <AppText style={{ fontWeight: 'bold', fontSize: 20, color: "#008542" }}>₹{amountFormatter((extendChargeAmt + nonInformedExtendedChargeAmt))}</AppText>
                </View>
                {role.includes("client") ? (
                    <AppButton onPress={() => { finishTripApi() }} icon={'clock-end'} style={{ paddingVertical: 3, }} >Pay to end trip</AppButton>
                ): (
                    <AppText style={{ fontWeight: 'bold', fontSize: 20, color: appstyle.textSec }}>Amount Payble</AppText>
                )}
            </View>
        </>
    )
}


const CustomTile = ({ children, mode = null, onPress, style }) => {
    return <View onTouchEnd={onPress} style={{ borderWidth: 2, borderColor: '#f4f4f2', elevation: 0, marginBottom: 10, shadowColor: appstyle.shadowColor, backgroundColor: appstyle.pri, padding: 10, borderRadius: 20, ...style, }}>
        {children}
    </View>
}

export default PaymentOverView