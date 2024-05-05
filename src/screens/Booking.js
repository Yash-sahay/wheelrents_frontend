import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ProgressBarAndroid, StyleSheet, FlatList, Pressable, PermissionsAndroid, Linking, ScrollView } from 'react-native';
import { appstyle } from '../styles/appstyle';
import AppBottomBar from '../components/AppBottomBar';
import AppHeader from '../components/AppHeader';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import { MD3Colors, ProgressBar } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { booking_payment, booking_status_change, delete_booking_by_id, extend_trip, finish_trip, getBookingsForHost } from '../axios/axios_services/bookingService';
import { amountFormatter, baseURL, calculateDistance, calculateTimePercentage, dateSimplify, timeSimplify } from '../../common';
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import AppDialog from '../components/AppDialog';
import AppBottomSheet from '../components/AppBottomSheet';
import QRCode from 'react-native-qrcode-svg';
import { useSelector } from 'react-redux';
import PaymentOverView from './PaymentOverView';
import { MotiView } from 'moti';



const TABS = [
  { id: 'pending', title: 'Pending', content: 'Pending Bookings', icon: 'exclamationcircle' },
  { id: 'active', title: 'Active', content: 'Active Bookings', icon: 'checkcircle' },
  { id: 'started', title: 'Running', content: 'Running Trips', icon: 'dashboard' },
  // { id: 'completed', title: 'Completed', content: 'Completed Bookings' },
];


const Booking = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [tabValue, setTabValue] = useState(TABS[0]);
  const [modalValue, setModalValue] = useState({});
  const [loader, setLoader] = useState(false)
  const [hourCount, setHourCount] = useState(0)
  // ref
  const bottomSheetRef = useRef(null);
  const endTripSheetRef = useRef(null);
  const [bottomSheet, setBottomSheet] = useState(false);
  const [endTripSheet, setEndTripSheet] = useState(false);
  const [endTripModalValues, setEndTripModalValues] = useState({});
  const [bottomModal, setBottomModal] = useState({})

  const handleClosePress = () => {
    setBottomSheet(false);
    bottomSheetRef.current?.close();
  };
  const handleOpenPress = (item, tripExtend) => {
    setBottomModal({ ...item, tripExtend: tripExtend ? true : false })
    setBottomSheet(true);
    bottomSheetRef.current?.open();
  };


  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const { role, lat, long } = useSelector(state => state.userReducer)

  const clientRole = role?.includes("client") ? true : false

  const handleCardPress = (id) => {
    setSelectedBookingId(id);
  };

  const handleApprove = async (id, isAccept) => {
    try {
      setLoader(true)
      let res = null
      if (isAccept) {
        const payload1 = { bookingId: id, payment: "pending" }
        res = await booking_status_change(payload1)
      } else {
        res = await booking_status_change({ bookingId: id, bookingStatus: "active", payment: "done" })
      }
      getBookings()
      setLoader(false)
    } catch (error) {
      setLoader(false)
      console.error("delete error", error)
    }
  };


  const rejectApi = async () => {
    try {
      setModalValue(prev => ({ ...prev, loader: true, }))
      const payload = { bookingId: modalValue?.bookingId }
      const res = await delete_booking_by_id(payload)
      const updatedBookings = bookings.filter(booking => {
        if (booking._id === modalValue?.bookingId) {
        } else {
          return booking
        }
      });
      setModalValue({ id: null, visible: false, loader: false, name: "" })
      setBookings(updatedBookings);
    } catch (error) {
      console.error("delete error", error)
    }
  }

  const getBookings = async () => {
    try {
      const bookings = await getBookingsForHost({ isClient: clientRole, bookingStatus: tabValue?.id })

      setSelectedBookingId(bookings?.data?.[0]?._id);
      setBookings(bookings?.data)
    } catch (error) {
      console.error("err", error)
    }
  }

  const extendTripApi = async (extendedHours) => {
    try {
      const extend = await extend_trip({ "bookingId": bottomModal?._id, "extendedHours": extendedHours })
      setSelectedBookingId(extend?._id);
      getBookings()
      handleClosePress()
    } catch (error) {
      console.error("err", error)
    }
  }


  const handleEndTrip = (itemdata) => {
    endTripSheetRef.current?.open()
    setEndTripSheet(true)
    navigation.navigate("PaymentOverView", { endTripModalValues: itemdata })
    setEndTripModalValues(itemdata)
  }


  useEffect(() => {
    getBookings()
  }, [tabValue?.id])


  function calculateRemainingTime(currTime, endTime, extendedHours) {
    const currentTime = currTime ? new Date(currTime).getTime() : new Date().getTime();
    let remainingTime = endTime - currentTime;

    if (extendedHours > 0) {
      remainingTime = remainingTime + (extendedHours * 60 * 60 * 1000)
    }

    // Convert remaining time from milliseconds to days, hours, and minutes
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

    return {
      days: days,
      hours: hours,
      minutes: minutes
    };
  }



  // console.log(`Remaining time: ${remainingTime.hours} hours, ${remainingTime.minutes} minutes, ${remainingTime.seconds} seconds`);

  function openGps(data) {
    var url = `geo:${data?.latitude},${data?.longitude}`
    openExternalApp(url)
  }
  function openPhone(phoneNumber) {
    var url = `tel:${phoneNumber}`
    openExternalApp(url)
  }

  function openExternalApp(url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log('Don\'t know how to open URI: ' + url);
      }
    });
  }


  const renderBookingItem = ({ item }) => {
    // Example usage:
    const endTime = new Date(item?.endDate).getTime(); // Example end time
    const remainingTime = calculateRemainingTime(false, endTime, parseInt(item?.extendedHours));
    const newEndTime = new Date().getTime() - (parseInt(item?.extendedHours) * 60 * 60 * 1000)
    const editionalTime = calculateRemainingTime(endTime, newEndTime);
    const distance = JSON.stringify(parseInt(item?.latitude)) != "null" ? calculateDistance({ latitude: lat, longitude: long }, { latitude: item?.latitude, longitude: item?.longitude }) + " Km" : "N/A"

    return (
      <Animated.View style={styles.bookingCard} onTouchEnd={() => handleCardPress(item._id)}>
        <View style={{ width: '100%' }}>
          <View style={{ width: '100%', flexDirection: 'row', padding: 15, borderBottomWidth: selectedBookingId === item?._id ? 1 : 0, paddingBottom: 10, borderColor: '#f4f4f2', justifyContent: 'flex-start' }}>
            <View>
              <Image source={{ uri: baseURL() + "public/vehicle/" + item?.images?.[0]?.fileName }} style={styles.carImage} />
            </View>

            <View style={styles.bookingInfo}>
              <AppText style={{ borderWidth: 1, borderStyle: 'dashed', color: appstyle.textSec, borderColor: 'grey', paddingHorizontal: 2, backgroundColor: '#f4f4f2', borderRadius: 5, fontWeight: '700' }}> {item?.vehicleNo} </AppText>
              <AppText style={styles.carDescription}>{item?.name}</AppText>
              {clientRole ? <AppText style={{ fontWeight: 'bold', color: appstyle.textSec, fontSize: 12, marginBottom: 5 }}>Hosted By <AppText style={{ color: appstyle.textSec, textTransform: 'capitalize' }}>{item?.hostName}</AppText></AppText> : (
                <AppText style={{ fontWeight: 'bold', color: appstyle.textSec, fontSize: 12, marginBottom: 5 }}>Booked By <AppText style={{ color: appstyle.textSec, textTransform: 'capitalize' }}>{item?.clientName}</AppText></AppText>
              )}

              <AppText variant="titleLarge" style={{ color: '#008542', fontWeight: '900', fontSize: 25 }}>₹{amountFormatter(item?.totalPrice)}</AppText>
            </View>
          </View>
          {(clientRole && selectedBookingId === item?._id) && (
            <>
              {item?.bookingStatus != "pending" && (
                <TouchableOpacity onPress={() => openPhone(item?.hostNumber)} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, marginTop: 10, borderBottomWidth: 1, paddingBottom: 10, borderColor: '#f4f4f2' }}>
                  <AppText style={{ color: appstyle.textBlack, fontWeight: '900', fontSize: 16 }}><MaterialCommunityIcons name="phone-dial" size={18} color={appstyle.textBlack} />  {item?.hostNumber}</AppText>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={appstyle.textBlack} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => openGps(item)} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingTop: 10, borderBottomWidth: 1, paddingBottom: 10, borderColor: '#f4f4f2' }}>
                <AppText style={{ color: appstyle.textBlack, fontWeight: '900', fontSize: 16 }}><MaterialCommunityIcons name="map-marker-distance" size={20} color={appstyle.textBlack} />  {distance}</AppText>
                <MaterialCommunityIcons name="chevron-right" size={20} color={appstyle.textBlack} />
              </TouchableOpacity>
            </>
          )}
          {(!clientRole && selectedBookingId === item?._id && item?.bookingStatus != "pending") && (
                <TouchableOpacity onPress={() => openPhone(item?.clientNumber)} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, marginTop: 10, borderBottomWidth: 1, paddingBottom: 10, borderColor: '#f4f4f2' }}>
                  <AppText style={{ color: appstyle.textBlack, fontWeight: '900', fontSize: 16 }}><MaterialCommunityIcons name="phone-dial" size={18} color={appstyle.textBlack} />  {item?.clientNumber}</AppText>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={appstyle.textBlack} />
                </TouchableOpacity>
              )}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingTop: 10 }}>
            <AppText style={{ fontWeight: 'bold', fontSize: 14, color: appstyle.textSec }}>Pick Up</AppText>
            <AppText style={{ fontWeight: 'bold', fontSize: 14, color: appstyle.textSec }}>Drop Off</AppText>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 }}>
            <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{dateSimplify(item?.startDate) || "N/A"}</AppText>
            <AppText style={{ fontWeight: '900' }}><AntDesign name="swap" size={20} color={appstyle.textBlack} /> </AppText>
            <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{dateSimplify(item?.endDate, item?.extendedHours) || "N/A"}</AppText>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 }}>
            <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{timeSimplify(item?.startDate)}</AppText>
            <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{timeSimplify(item?.endDate, item?.extendedHours)}</AppText>
          </View>

          <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            {item?.bookingStatus == "started" && <ProgressBar
              style={[styles.progressBar, (remainingTime?.hours < 2) && { backgroundColor: 'tomato' }]}
              progress={calculateTimePercentage(new Date(item?.startDate), new Date(item?.endDate), parseInt(item?.extendedHours))}
              color={calculateTimePercentage(new Date(item?.startDate), new Date(item?.endDate), parseInt(item?.extendedHours)) > 1 ? 'tomato' : 'black'}
            />}
          </View>
          {(!clientRole && selectedBookingId === item?._id && tabValue.title != "Completed") && (
            <>
              {item?.bookingStatus == "pending" && (
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10, borderTopWidth: 1, borderColor: '#f4f4f2' }}>
                  <AppButton icon="close" style={{ paddingHorizontal: 10 }} textColor={'tomato'} buttonColor={'white'} onPress={() => setModalValue(values => ({ ...values, bookingId: item?._id, name: item?.name, visible: true }))} outlined>Reject</AppButton>
                  {item?.payment == "pending" ? (
                    <AppButton icon="check" style={{ paddingHorizontal: 10 }} textColor={'white'} buttonColor={'grey'} loading={true}>Awaiting user payment</AppButton>
                  ) : (
                    <AppButton icon="check" style={{ paddingHorizontal: 10 }} textColor={'white'} buttonColor={'green'} onPress={() => handleApprove(item?._id, true)}>Accept</AppButton>
                  )}
                </View>
              )}
              {item?.bookingStatus == "active" && (
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10, borderTopWidth: 1, borderColor: '#f4f4f2' }}>
                  <AppButton icon="close" style={{ paddingHorizontal: 10 }} textColor={'tomato'} buttonColor={'white'} onPress={() => setModalValue(values => ({ ...values, bookingId: item?._id, name: item?.name, visible: true }))} outlined>Reject</AppButton>
                  <AppButton icon="qrcode" style={{}} textColor={'white'} buttonColor={appstyle.tri} onPress={() => handleOpenPress(item)}>Open QR</AppButton>
                </View>
              )}
              {item?.bookingStatus == "started" && (<View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10, borderTopWidth: 1, borderColor: '#f4f4f2' }}>
                <AppButton icon="view-sequential" style={{ paddingHorizontal: 10, marginLeft: 10 }} textColor={'white'} onPress={() => { handleEndTrip({ ...item, editionalTime }) }}>Payment Overview</AppButton>
              </View>)}
              {item?.bookingStatus == "started" && (
                <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderTopWidth: 1, borderColor: '#f4f4f2' }}>
                  {remainingTime?.minutes < 0 ? (
                    <AppText style={{ fontWeight: '800', fontSize: 12, color: 'tomato', textAlign: 'center' }}>{`Running late by ${Math.abs(editionalTime?.days)} days, ${Math.abs(editionalTime?.hours)} hours, and ${Math.abs(editionalTime?.minutes)} minutes. `}</AppText>
                  ) : (
                    <AppText style={{ fontWeight: '800', fontSize: 12, color: appstyle.textSec, textAlign: 'center' }}>{`Trip ending in ${remainingTime?.days} days, ${remainingTime?.hours} hours, and ${remainingTime?.minutes} minutes. `}</AppText>
                  )}
                </View>
              )}
            </>
          )}

          {(clientRole && selectedBookingId === item?._id && tabValue.title != "Completed") && (
            <>
              {item?.bookingStatus == "active" && (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', padding: 10, borderTopWidth: 1, borderColor: '#f4f4f2' }}>
                  <AppButton icon="qrcode-scan" style={{}} textColor={'white'} buttonColor={appstyle.tri} onPress={() => navigation.navigate("QRScanner")}>Initiate Trip with Scan</AppButton>
                </View>
              )}
              {item?.bookingStatus == "pending" && (
                <View style={{ flexDirection: 'row', justifyContent: item?.payment == "pending" ? 'flex-end' : 'center', padding: 10, borderTopWidth: 1, borderColor: '#f4f4f2' }}>
                  {item?.payment == "pending" ? (
                    <AppButton icon="cash" style={{ paddingHorizontal: 10 }} textColor={'white'} buttonColor={appstyle.tri} onPress={() => handleApprove(item?._id)} >Pay to activate your trip</AppButton>
                  ) : (
                    <AppText style={{ fontWeight: '600', color: 'hsl(43,85%,33%)', fontSize: 12, }}>● Waiting for the vehicle owner to accept the request...</AppText>
                  )}

                  {/* <AppButton icon="check" style={{ paddingHorizontal: 10 }} textColor={'white'} buttonColor={'#00a400'} onPress={() => handleApprove(item?._id)}>Accept</AppButton> */}
                </View>
              )}
              {(remainingTime?.hours < 5 && item?.bookingStatus == "started") && (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', padding: 10, borderTopWidth: 1, borderColor: '#f4f4f2' }}>
                  {!(remainingTime?.days < 0 && remainingTime?.hours < 0 && remainingTime?.minutes < 0) && <View>
                    <AppButton icon="chevron-triple-right" style={{ paddingHorizontal: 10, display: parseInt(item?.extendedHours) > 0 ? 'none' : 'flex' }} textColor={'white'} onPress={() => { handleOpenPress(item, 'tripExtend') }}>Extend trip</AppButton>
                  </View>}
                  <View>
                    <AppButton icon="clock-end" style={{ paddingHorizontal: 10, marginLeft: 10 }} buttonColor={'tomato'} textColor={'white'} onPress={() => { handleEndTrip({ ...item, editionalTime }) }}>End trip</AppButton>
                  </View>
                </View>
              )}
              {item?.bookingStatus == "started" && (
                <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderTopWidth: 1, borderColor: '#f4f4f2' }}>
                  {remainingTime?.minutes < 0 ? (
                    <AppText style={{ fontWeight: '800', fontSize: 12, color: 'tomato', textAlign: 'center' }}>{`Your trip is getting extending by \n ${Math.abs(editionalTime?.days)} days, ${Math.abs(editionalTime?.hours)} hours, and ${Math.abs(editionalTime?.minutes)} minutes. `}</AppText>
                  ) : (
                    <AppText style={{ fontWeight: '800', fontSize: 12, color: appstyle.textSec, textAlign: 'center' }}>{`Trip ending in ${remainingTime?.days} days, ${remainingTime?.hours} hours, and ${remainingTime?.minutes} minutes. `}</AppText>
                  )}
                </View>
              )}
            </>
          )}

        </View>

      </Animated.View>
    )
  };


  return (
    <>
      <AppBottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['60%']} bottomSheet={bottomSheet} setBottomSheet={setBottomSheet}>

        <View style={{ flex: 1, alignItems: 'center', padding: 20, paddingTop: 20 }}>
          {bottomModal?.tripExtend ? (
            <View style={{ width: '100%', alignItems: 'center' }}>
              <AppText style={{ textAlign: 'center', fontWeight: "700", fontSize: 25, marginBottom: 20, color: appstyle.textBlack, textTransform: 'capitalize' }}>Select extension duration</AppText>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
                <TouchableOpacity disabled={hourCount <= 0} onPress={() => setHourCount(hourCount <= 0 ? 0 : hourCount - 1)} style={{ backgroundColor: hourCount <= 0 ? appstyle.pri : appstyle.tri, borderWidth: 1, borderColor: "#f4f4f2", borderRadius: 10, marginHorizontal: 20 }}>
                  <MaterialCommunityIcons size={50} color={hourCount <= 0 ? appstyle.textSec : appstyle.pri} name="minus" />
                </TouchableOpacity>
                <View style={{ backgroundColor: "#f4f4f2", width: 100, height: 100, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
                  <AppText style={{ fontSize: 50 }}>{hourCount}</AppText>
                </View>
                <TouchableOpacity disabled={hourCount >= 5} onPress={() => setHourCount(hourCount >= 5 ? 5 : hourCount + 1)} style={{ backgroundColor: hourCount >= 5 ? appstyle.pri : appstyle.tri, borderWidth: 1, borderColor: "#f4f4f2", borderRadius: 10, marginHorizontal: 20 }}>
                  <MaterialCommunityIcons size={50} color={hourCount >= 5 ? appstyle.textSec : appstyle.pri} name="plus" />
                </TouchableOpacity>
              </View>
              <AppButton icon="chevron-triple-right" style={{ padding: 10, borderWidth: 1, borderColor: "#f4f4f2", marginTop: 40, width: '90%', borderRadius: 30 }} disabled={hourCount < 1} textColor={'white'} onPress={() => { extendTripApi(hourCount) }}>Extend trip to {hourCount}hrs</AppButton>
              <AppText style={{ textAlign: 'center', fontWeight: "600", fontSize: 10, marginTop: 5, color: appstyle.textSec, }}>Note: Additional charges apply for extended hours.</AppText>
            </View>
          ) : (
            <>
              <AppText style={{ textAlign: 'center', fontWeight: "700", fontSize: 20, marginBottom: 20, color: appstyle.textBlack, textTransform: 'capitalize' }}><AppText style={{ textTransform: 'none' }}>Scan for</AppText> "{bottomModal?.name}"</AppText>
              <QRCode
                value={bottomModal?._id}
                logo={{ uri: baseURL() + "public/vehicle/" + bottomModal?.images?.[0]?.fileName }}
                logoSize={20}
                size={200}
                logoBackgroundColor={appstyle.priBack}
              />
              <AppText style={{ textAlign: 'center', fontWeight: "600", fontSize: 16, padding: 40, paddingTop: 20, color: appstyle.textSec }}>Please scan the QR code from your phone to initiate the trip.</AppText>
            </>
          )}
        </View>
      </AppBottomSheet>
      <AppDialog visible={modalValue.visible}
        title='Are you sure?'
        description={`Are you sure you want to cancel the booking request for "${modalValue?.name}"? Once canceled, this action cannot be undone. `}
        onCancelPress={() => {
          setModalValue({ id: null, visible: false, name: "" })
        }}
        onSuccessPress={() => {
          rejectApi()
        }} />
      <AppBottomBar />
      <AppHeader ui2 name={"Bookings"} />
      <BookingTabs onChange={(tabVal) => setTabValue(prev => ({ ...tabVal }))}>
        <AppText style={styles.title}>{tabValue?.content}</AppText>
        <FlatList
          data={bookings}
          style={{}}
          renderItem={renderBookingItem}
          keyExtractor={(item) => item?._id}
          contentContainerStyle={styles.flatListContent}
        />
      </BookingTabs>
      {/* <View style={styles.container}>
            </View> */}
    </>
  );
};








const Tab = ({ title, onPress, icon, isActive }) => {
  return (
  
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={onPress}
    >
      {icon && (
        <MotiView  
        transition={{ delay: 5, damping: 15, mass: 1 }}
        animate={{ opacity: isActive ? 1 : 0, translateY: isActive ? 0 : 100 }}>
          <AntDesign color={isActive ? appstyle.priBack : appstyle.textSec} style={{ marginRight: 8 }} name={icon} size={16} />
        </MotiView>
      )}
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export function BookingTabs({ children, onChange = () => { }, tabs }) {
  let newTab = tabs || TABS
  const [activeTab, setActiveTab] = useState(newTab[0].id);
  const translateX = useSharedValue(0);


  const handleTabPress = (tabId) => {
    const index = newTab.findIndex((tab) => tab.id === tabId);
    translateX.value = withSpring(index * (100 / newTab.length));
    setActiveTab(tabId);
  };

  const tabIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));


  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {newTab?.map((tab) => (
          <Tab
            icon={tab?.icon}
            key={tab?.id}
            title={tab?.title}
            onPress={() => { handleTabPress(tab?.id); onChange(tab) }}
            isActive={activeTab === tab?.id}
          />
        ))}
        <Animated.View style={[styles.tabIndicator, tabIndicatorStyle]} />
      </View>
      {/* Render content based on activeTab */}

      <Animated.View style={styles.contentContainer}>
        {children}
      </Animated.View>
    </View>
  );
};









const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    backgroundColor: appstyle.pri,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 0,
    marginLeft: 20
  },
  flatListContent: {
    // paddingBottom: 20,
    paddingBottom: 100
  },
  bookingCard: {
    flexDirection: 'row',
    margin: 20,
    alignItems: 'center',
    marginBottom: 0,
    backgroundColor: appstyle.priBack,
    elevation: 10,
    shadowColor: appstyle.shadowColor,
    borderRadius: 30,
    overflow: 'hidden'
    // padding: 10,
  },
  carImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: appstyle.pri,
  },
  bookingInfo: {
    flex: 1,
    display: 'flex',
    alignItems: 'flex-start'
  },
  carDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 1,
    textTransform: 'capitalize'
  },
  progressBar: {
    marginBottom: 10,
    borderRadius: 10,
    height: 6,
    // marginBottom: 20
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  approveButton: {
    backgroundColor: '#28a745',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },

  tabContainer: {
    flexDirection: 'row',
    padding: 5,
    marginBottom: 30,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    borderRadius: 30,
    elevation: 10,
    shadowColor: appstyle.shadowColor,
    shadowOffset: { width: 5, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  activeTab: {
    backgroundColor: appstyle.tri,
  },
  tabText: {
    color: '#555',
    fontSize: 16,
  },
  activeTabText: {
    color: '#fff',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
    backgroundColor: '#007bff',
  },
  contentContainer: {
    flex: 1,
  },
});

export default Booking;




