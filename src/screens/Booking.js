import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ProgressBarAndroid, StyleSheet, FlatList, Pressable, PermissionsAndroid } from 'react-native';
import { appstyle } from '../styles/appstyle';
import AppBottomBar from '../components/AppBottomBar';
import AppHeader from '../components/AppHeader';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import { MD3Colors, ProgressBar } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { booking_payment, booking_status_change, delete_booking_by_id, getBookingsForHost } from '../axios/axios_services/bookingService';
import { amountFormatter, baseURL, calculateTimePercentage, dateSimplify, timeSimplify } from '../../common';
import AntDesign from 'react-native-vector-icons/AntDesign'

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
  // ref
  const bottomSheetRef = useRef(null);
  const [bottomSheet, setBottomSheet] = useState(false);
  const [qrValues, setQrValues] = useState({})

  const handleClosePress = () => {
    setBottomSheet(false);
    bottomSheetRef.current?.close();
  };
  const handleOpenPress = (item) => {
    setQrValues(item)
    setBottomSheet(true);
    bottomSheetRef.current?.open();
  };


  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const { role } = useSelector(state => state.userReducer)

  const clientRole = role?.includes("client") ? true : false

  const handleCardPress = (id) => {
    setSelectedBookingId(id);
  };

  const handleApprove = async (id, isAccept) => {
    try {
      setLoader(true)
      let res = null
      if(isAccept){
        const payload1 = { bookingId: id, payment: "pending" }
        res = await booking_status_change(payload1)
      }else {
        const payload2 = { bookingId: id }
        res = await booking_payment(payload2)
      }
      getBookings()
      alert(JSON.stringify(res?.data))
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

      setBookings(bookings?.data)
      setSelectedBookingId(bookings?.data?.[0]?._id);
    } catch (error) {
      console.error("err", error)
    }
  }


  useEffect(() => {
    getBookings()
  }, [tabValue?.id])


  function calculateRemainingTime(endTime) {
    const currentTime = new Date().getTime();
    const remainingTime = endTime - currentTime;

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




  const renderBookingItem = ({ item }) => {
    // Example usage:
    const endTime = new Date(item?.endDate).getTime(); // Example end time
    const remainingTime = calculateRemainingTime(endTime);
    return (
      <Animated.View style={styles.bookingCard} onTouchEnd={() => handleCardPress(item._id)}>
        <View style={{ width: '100%' }}>
          <View style={{ width: '100%', flexDirection: 'row', padding: 15 }}>
            <Image source={{ uri: baseURL() + "public/vehicle/" + item?.images?.[0]?.fileName }} style={styles.carImage} />
            <View style={styles.bookingInfo}>
              <AppText style={styles.carDescription}>{item?.name}</AppText>
              <AppText style={{ fontWeight: 'bold', color: appstyle.textSec, fontSize: 12, marginBottom: 5 }}>Booked By <AppText style={{ color: appstyle.textSec, textTransform: 'capitalize' }}>{item?.clientName}</AppText></AppText>

              <AppText variant="titleLarge" style={{ color: '#008542', fontWeight: '900', fontSize: 25 }}>₹{amountFormatter(item?.totalPrice)}</AppText>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 }}>
            <AppText style={{ fontWeight: 'bold', fontSize: 14, color: appstyle.textSec }}>Pick Up</AppText>
            <AppText style={{ fontWeight: 'bold', fontSize: 14, color: appstyle.textSec }}>Drop Off</AppText>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 }}>
            <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{dateSimplify(item?.startDate) || "N/A"}</AppText>
            <AppText style={{ fontWeight: '900' }}><AntDesign name="swap" size={20} color={appstyle.textBlack} /> </AppText>
            <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{dateSimplify(item?.endDate) || "N/A"}</AppText>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 }}>
            <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{timeSimplify(item?.startDate)}</AppText>
            <AppText style={{ color: appstyle.textBlack, fontWeight: 'bold' }}>{timeSimplify(item?.endDate)}</AppText>
          </View>

          <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            {item?.bookingStatus == "started" && <ProgressBar
              style={styles.progressBar}
              progress={calculateTimePercentage(new Date(item?.startDate), new Date(item?.endDate))} color={'black'} />}
          </View>
          {(!clientRole && selectedBookingId === item?._id && tabValue.title != "Completed") && (
            <>
              {item?.bookingStatus == "pending" && (
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10, borderTopWidth: 1, borderColor: '#f4f4f2' }}>
                  <AppButton icon="close" style={{ paddingHorizontal: 10 }} textColor={'tomato'} buttonColor={'white'} onPress={() => setModalValue(values => ({ ...values, bookingId: item?._id, name: item?.name, visible: true }))} outlined>Reject</AppButton>
                  {item?.payment == "pending" ? (
                    <AppButton icon="check" style={{ paddingHorizontal: 10 }} textColor={'white'} buttonColor={'grey'}  loading={true}>Awaiting user payment</AppButton>
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
              {item?.bookingStatus == "started" && (
                <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderTopWidth: 1, borderColor: '#f4f4f2' }}>
                  <AppText style={{ fontWeight: '800', fontSize: 12, color: appstyle.textSec, textAlign: 'center' }}>{`Trip ending in ${remainingTime?.days} days, ${remainingTime?.hours} hours, and ${remainingTime?.minutes} minutes. `}</AppText>
                  {/* <AppButton icon="check" style={{ paddingHorizontal: 10 }} textColor={'white'} buttonColor={'#00a400'} onPress={() => handleApprove(item?._id)}>Accept</AppButton> */}
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
              {item?.bookingStatus == "started" && (
                <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10, borderTopWidth: 1, borderColor: '#f4f4f2' }}>
                  <AppText style={{ fontWeight: '800', fontSize: 12, color: appstyle.textSec, textAlign: 'center' }}>{`Trip ending in ${remainingTime.days} days, ${remainingTime.hours} hours, and ${remainingTime.minutes} minutes. `}</AppText>
                  {/* <AppButton icon="check" style={{ paddingHorizontal: 10 }} textColor={'white'} buttonColor={'#00a400'} onPress={() => handleApprove(item?._id)}>Accept</AppButton> */}
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
      <AppBottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['1%', '60%']} bottomSheet={bottomSheet} setBottomSheet={setBottomSheet}>
        <View style={{ flex: 1, alignItems: 'center', padding: 20, paddingTop: 20 }}>
          <AppText style={{ textAlign: 'center', fontWeight: "700", fontSize: 20, marginBottom: 20, color: appstyle.textBlack, textTransform: 'capitalize' }}><AppText style={{ textTransform: 'none' }}>Scan for</AppText> "{qrValues?.name}"</AppText>
          <QRCode
            value={qrValues?._id}
            logo={{ uri: baseURL() + "public/vehicle/" + qrValues?.images?.[0]?.fileName }}
            logoSize={20}
            size={200}
            logoBackgroundColor={appstyle.priBack}
          />
          <AppText style={{ textAlign: 'center', fontWeight: "600", fontSize: 16, padding: 40, paddingTop: 20, color: appstyle.textSec }}>Please scan the QR code from your phone to initiate the trip.</AppText>
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
        <AntDesign color={isActive ? appstyle.priBack : appstyle.textSec} style={{ marginRight: 8 }} name={icon} size={16} />
      )}
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export function BookingTabs ({ children, onChange = () => { }, tabs }) {
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




