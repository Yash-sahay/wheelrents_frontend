import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ProgressBarAndroid, StyleSheet, FlatList, Pressable } from 'react-native';
import { appstyle } from '../styles/appstyle';
import AppBottomBar from '../components/AppBottomBar';
import AppHeader from '../components/AppHeader';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import { MD3Colors, ProgressBar } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import { getBookingsForHost } from '../axios/axios_services/bookingService';
import { baseURL, dateSimplify } from '../../common';
import AntDesign from 'react-native-vector-icons/AntDesign'

import {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    withSpring,
  } from 'react-native-reanimated';
  import { PanGestureHandler } from 'react-native-gesture-handler';



  const TABS = [
    { id: 'Tab1', title: 'New', content: 'New Bookings' },
    { id: 'Tab2', title: 'Active', content: 'Active Bookings' },
    { id: 'Tab3', title: 'Completed', content: 'Completed Bookings' },
  ];
  

const Booking = () => {
    const [bookings, setBookings] = useState([]);
    const [tabValue, setTabValue] = useState(TABS[0]);


    const [selectedBookingId, setSelectedBookingId] = useState(null);

    const handleCardPress = (id) => {
        setSelectedBookingId(id);
    };

    const handleApprove = (id) => {
        const updatedBookings = bookings.map(booking =>
            booking.id === id ? { ...booking, status: 'approved' } : booking
        );
        setBookings(updatedBookings);
    };

    const handleReject = (id) => {
        const updatedBookings = bookings.map(booking =>
            booking.id === id ? { ...booking, status: 'rejected' } : booking
        );
        setBookings(updatedBookings);
    };



    const getBookings = async () => {
        try {
            const bookings = await getBookingsForHost()

            setBookings(bookings?.data)
        } catch (error) {
            console.error("err", error)
        }
    }

    useEffect(() => {
        getBookings()
    }, [])



    const renderBookingItem = ({ item }) => (
        <Animated.View style={styles.bookingCard} onTouchEnd={() => handleCardPress(item.id)}>
            <View style={{ width: '100%' }}>
                <View style={{ width: '100%', flexDirection: 'row', padding: 15 }}>
                    <Image source={{ uri: baseURL() + "public/vehicle/" + item.images?.[0]?.fileName }} style={styles.carImage} />
                    <View style={styles.bookingInfo}>
                        <AppText style={styles.carDescription}>{item?.name}</AppText>

                        <AppText variant="titleLarge" style={{ color: 'darkgreen', fontWeight: '900', fontSize: 25 }}>{item?.totalPrice}₹</AppText>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 }}>
                    <AppText style={{ fontWeight: 'bold', fontSize: 14, color: appstyle.shadowColor }}>Pick Up</AppText>
                    <AppText style={{ fontWeight: 'bold', fontSize: 14, color: appstyle.shadowColor }}>Drop Off</AppText>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15  }}>
                    <AppText style={{ color: appstyle.tri, fontWeight: 'bold' }}>{dateSimplify(item?.startDate) || "N/A"}</AppText>
                    <AppText style={{ fontWeight: '900' }}><AntDesign name="swap" size={20} color={appstyle.tri} /> </AppText>
                    <AppText style={{ color: appstyle.tri, fontWeight: 'bold' }}>{dateSimplify(item?.endDate) || "N/A"}</AppText>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15  }}>
                    <AppText style={{ color: appstyle.tri, fontWeight: 'bold' }}>{new Date(item?.startDate).getUTCHours()} : {new Date(item?.startDate).getUTCMinutes() || "N/A"}</AppText>
                    <AppText style={{ color: appstyle.tri, fontWeight: 'bold' }}>{new Date(item?.endDate).getUTCHours()} : {new Date(item?.endDate).getUTCMinutes() || "N/A"}</AppText>
                </View>

                <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                    {tabValue.title == "Active" && <ProgressBar
                        style={styles.progressBar}
                        progress={0.5} color={'#8fa3ea'} />}
                </View>

                {(selectedBookingId === item.id && tabValue.title != "Completed") && (
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 10, borderTopWidth: 1, borderColor: appstyle.pri }}>
                        <AppButton icon="close" style={{ paddingHorizontal: 10 }} textColor={'red'} buttonColor={'white'} onPress={() => handleReject(item.id)} outlined>Reject</AppButton>
                        <AppButton icon="check" style={{ paddingHorizontal: 10 }} textColor={'white'} buttonColor={'#00a400'} onPress={() => handleApprove(item.id)}>Approve</AppButton>
                    </View>
                )}
            </View>

        </Animated.View>
    );

    return (
        <>
            <AppBottomBar />
            <AppHeader ui2 />
            <BookingTabs onChange={(tabVal) => setTabValue(prev => ({...tabVal}))}>
                <AppText style={styles.title}>{tabValue?.content}</AppText>
                <FlatList
                    data={bookings}
                    renderItem={renderBookingItem}
                    keyExtractor={(item) => item._id}
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
  
  const BookingTabs = ({children, onChange = () => {}}) => {
    const [activeTab, setActiveTab] = useState('Tab1');
    const translateX = useSharedValue(0);
  
    const handleTabPress = (tabId) => {
      const index = TABS.findIndex((tab) => tab.id === tabId);
      translateX.value = withSpring(index * (100 / TABS.length));
      setActiveTab(tabId);
    };
  
    const tabIndicatorStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));
  
    const gestureHandler = useAnimatedGestureHandler({
      onStart: (_, ctx) => {
        ctx.startX = translateX.value;
      },
      onActive: (event, ctx) => {
        translateX.value = ctx.startX + event.translationX;
      },
      onEnd: () => {
        // Snap to the nearest tab
        const newIndex = Math.round(translateX.value / (300 / TABS.length));
        translateX.value = withSpring(newIndex * (100 / TABS.length));
        setActiveTab(TABS[newIndex].id);
      },
    });
  
    return (
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          {TABS.map((tab) => (
            <Tab
              key={tab.id}
              title={tab.title}
              onPress={() => {handleTabPress(tab.id); onChange(tab)}}
              isActive={activeTab === tab.id}
            />
          ))}
          <Animated.View style={[styles.tabIndicator, tabIndicatorStyle]} />
        </View>
        {/* Render content based on activeTab */}
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={styles.contentContainer}>
            {children}
          </Animated.View>
        </PanGestureHandler>
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
        marginBottom: 10,
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




