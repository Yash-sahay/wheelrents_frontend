import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ProgressBarAndroid, StyleSheet, FlatList, Pressable, PermissionsAndroid } from 'react-native';
import { appstyle } from '../styles/appstyle';
import AppBottomBar from '../components/AppBottomBar';
import AppHeader from '../components/AppHeader';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import { MD3Colors, ProgressBar } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { booking_status_change, delete_booking_by_id, getBookingsForHost } from '../axios/axios_services/bookingService';
import { baseURL, dateSimplify } from '../../common';
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



const TABS = [
  { id: 'pending', title: 'New', content: 'New Bookings' },
  { id: 'active', title: 'Active', content: 'Active Bookings' },
  { id: 'completed', title: 'Completed', content: 'Completed Bookings' },
];


const Booking = ({navigation}) => {
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

  const handleCardPress = (id) => {
    setSelectedBookingId(id);
  };

  const handleApprove = async (id) => {
    try {
      setLoader(true)
      const payload = { bookingId: id, bookingStatus: "active" }
      const res = await booking_status_change(payload)
      alert(JSON.stringify(res.data))
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
      const bookings = await getBookingsForHost({ bookingStatus: tabValue?.id })

      setBookings(bookings?.data)
      setSelectedBookingId(bookings?.data?.[0]?._id);
    } catch (error) {
      console.error("err", error)
    }
  }

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

    useEffect(() => {
      requestCameraPermission()
    }, [])
    
  

  useEffect(() => {
    getBookings()
  }, [tabValue?.id])



  const renderBookingItem = ({ item }) => (
    <Animated.View style={styles.bookingCard} onTouchEnd={() => handleCardPress(item._id)}>
      <View style={{ width: '100%' }}>
        <View style={{ width: '100%', flexDirection: 'row', padding: 15 }}>
          <Image source={{ uri: baseURL() + "public/vehicle/" + item?.images?.[0]?.fileName }} style={styles.carImage} />
          <View style={styles.bookingInfo}>
            <AppText style={styles.carDescription}>{item?.name}</AppText>
            <AppText style={{ fontWeight: 'bold', color: 'darkgrey', fontSize: 12, marginBottom: 5 }}>Booked By <AppText style={{ color: 'grey', textTransform: 'capitalize' }}>{item?.clientName}</AppText></AppText>

            <AppText variant="titleLarge" style={{ color: 'darkgreen', fontWeight: '900', fontSize: 25 }}>{item?.totalPrice}₹</AppText>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 }}>
          <AppText style={{ fontWeight: 'bold', fontSize: 14, color: appstyle.shadowColor }}>Pick Up</AppText>
          <AppText style={{ fontWeight: 'bold', fontSize: 14, color: appstyle.shadowColor }}>Drop Off</AppText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 }}>
          <AppText style={{ color: appstyle.tri, fontWeight: 'bold' }}>{dateSimplify(item?.startDate) || "N/A"}</AppText>
          <AppText style={{ fontWeight: '900' }}><AntDesign name="swap" size={20} color={appstyle.tri} /> </AppText>
          <AppText style={{ color: appstyle.tri, fontWeight: 'bold' }}>{dateSimplify(item?.endDate) || "N/A"}</AppText>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 }}>
          <AppText style={{ color: appstyle.tri, fontWeight: 'bold' }}>{new Date(item?.startDate).getHours()} : {new Date(item?.startDate).getMinutes() || "N/A"}</AppText>
          <AppText style={{ color: appstyle.tri, fontWeight: 'bold' }}>{new Date(item?.endDate).getHours()} : {new Date(item?.endDate).getMinutes() || "N/A"}</AppText>
        </View>

        <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
          {item?.bookingStatus == "started" && <ProgressBar
            style={styles.progressBar}
            progress={0.5} color={'#8fa3ea'} />}
        </View>
        {(selectedBookingId === item?._id && tabValue.title != "Completed") && (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10, borderTopWidth: 1, borderColor: appstyle.pri }}>
            <AppButton icon="close" style={{ paddingHorizontal: 10 }} textColor={'tomato'} buttonColor={'white'} onPress={() => setModalValue(values => ({ ...values, bookingId: item?._id, name: item?.name, visible: true }))} outlined>Reject</AppButton>
            {item?.bookingStatus == "active" ? (
              <AppButton icon="qrcode" style={{}} textColor={'white'} buttonColor={appstyle.tri} onPress={() => handleOpenPress(item)}>Open QR</AppButton>
            ) : (
              <AppButton icon="check" style={{ paddingHorizontal: 10 }} textColor={'white'} buttonColor={'#00a400'} onPress={() => handleApprove(item?._id)}>Accept</AppButton>
            )}
          </View>
        )}
      </View>

    </Animated.View>
  );

  return (
    <>
      <AppBottomSheet bottomSheetRef={bottomSheetRef} snapPoints={['1%', '60%']} bottomSheet={bottomSheet} setBottomSheet={setBottomSheet}>
        <View style={{flex: 1, alignItems: 'center', padding: 20, paddingTop: 40}}>
          <QRCode
            value={qrValues?._id}
            logo={{ uri: baseURL() + "public/vehicle/" + qrValues?.images?.[0]?.fileName }}
            logoSize={20}
            size={200}
            logoBackgroundColor={appstyle.priBack}
          />
          <AppText style={{textAlign: 'center', fontWeight: "600", fontSize: 16, padding: 40, color: 'grey'}}>Scan the QR code from you phone to start the trip!</AppText>
        </View>
      </AppBottomSheet>
      <AppDialog visible={modalValue.visible}
        title='Are you sure?'
        description={`You want to cancel booking request "${modalValue?.name}"? you will not be able to get again. `}
        onCancelPress={() => {
          setModalValue({ id: null, visible: false, name: "" })
        }}
        onSuccessPress={() => {
          rejectApi()
        }} />
      <AppBottomBar />
      <AppHeader ui2 />
      <BookingTabs onChange={(tabVal) => setTabValue(prev => ({ ...tabVal }))}>
        <AppText style={styles.title}>{tabValue?.content}</AppText>
        <FlatList
          data={bookings}
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








const Tab = ({ title, onPress, isActive }) => {
  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={onPress}
    >
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const BookingTabs = ({ children, onChange = () => { } }) => {
  const [activeTab, setActiveTab] = useState('pending');
  const translateX = useSharedValue(0);

  const handleTabPress = (tabId) => {
    const index = TABS.findIndex((tab) => tab.id === tabId);
    translateX.value = withSpring(index * (100 / TABS.length));
    setActiveTab(tabId);
  };

  const tabIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));


  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <Tab
            key={tab.id}
            title={tab.title}
            onPress={() => { handleTabPress(tab.id); onChange(tab) }}
            isActive={activeTab === tab.id}
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
    paddingBottom: 20,
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




