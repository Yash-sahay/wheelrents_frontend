import { Dimensions, PermissionsAndroid, StyleSheet, TouchableOpacity, View } from 'react-native';
// import { NavigationContainer, useNavigation } from '@react-navigation/native';
import React from 'react';

// import { createStackNavigator } from '@react-navigation/stack';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Home from '../screens/Home';
import Login from '../screens/Login';
import AddVehicle from '../screens/host/AddVehicle';
import HostDashboard from '../screens/host/HostDashboard';
import User from '../screens/Commons/User';
import Notification from '../screens/Commons/Notification';
import Signin from '../screens/Signin';
import VehicleDetails from '../screens/VehicleDetails';
import AppLoader from '../components/AppLoader';
import AppBottomBar from '../components/AppBottomBar';
import Wishlist from '../screens/WishList';
import Search from '../screens/Search';
import Booking from '../screens/Booking';
import QRScanner from '../screens/QRScanner';
import SearchResultScreen from '../screens/Result';
import Withdraw from '../screens/host/Withdraw';
import { updateUserDetails } from '../redux/reducer/userReducer';
import Geolocation from '@react-native-community/geolocation';
import { requestLocationPermission } from '../../common';
import { updateLocationReducer } from '../redux/reducer/locationReducer';
import PaymentOverView from '../screens/PaymentOverView';
import BannerOpenView from '../screens/BannerOpenView';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChatScreen from '../screens/Commons/ChatScreen';

const Stack = createNativeStackNavigator();
const { width } = Dimensions.get("window")

const Navigation = () => {


  // const navigation = useNavigation()
  const { isLoggedIn } = useSelector(state => state?.userReducer);
  const { role, bookingStartDate, bookingEndDate } = useSelector(state => state.userReducer)
  const dispatch = useDispatch() 
  
  useEffect(() => {
    const startDate = new Date(new Date().getTime() + 5 * 60 * 60 * 1000);
    const endDate = new Date(new Date().getTime() + 10 * 60 * 60 * 1000);
    dispatch(updateUserDetails({bookingEndDate: endDate, bookingStartDate: startDate }))
    
    requestLocationPermission(updateLocationDetails)
  }, [])

  const updateLocationDetails =(locationObj) => {
    dispatch(updateLocationReducer({...locationObj}))
  }
  

  useEffect(() => {
    async function requestLocationPermission() {

      const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

      if (granted) {
        console.log("You can use the ACCESS_FINE_LOCATION")

        Geolocation.getCurrentPosition(
          //Will give you the current location
          async (position) => {
            // //getting the Longitude from the location json
            dispatch(updateUserDetails({ lat: position.coords.latitude, long: position.coords.longitude }))

          }, (error) => alert(error.message), {
          enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
        }
        );
      }

    }
    requestLocationPermission()

  }, [])


  return (
    <>
      <AppLoader />
      {/* <AppBottomBar/> */}
      <NavigationContainer initialRouteName="Home">
        <Stack.Navigator
          screenOptions={{ headerShown: false }}>
          {!isLoggedIn ? (
            <>
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signin" component={Signin} />
            </>
          ) : (
            <>
              {role?.includes('host') && (
                <>
                  <Stack.Screen options={{ animationEnabled: false }} name="HostDashboard" component={HostDashboard} />
                  <Stack.Screen name="AddVehicle" component={AddVehicle} />
                  <Stack.Screen name="Withdraw" options={{ animationEnabled: false, animation: "none" }} component={Withdraw} />
                </>
              )}
              {role?.includes('client') && (
                <>
                  <Stack.Screen options={{ animationEnabled: false, animation: "none" }} name="Home" component={Home} />
                  <Stack.Screen name="VehicleDetails" component={VehicleDetails} />
                  <Stack.Screen options={{ animationEnabled: false, animation: "none" }} name="WishList" component={Wishlist} />
                  <Stack.Screen name="BannerOpenView" component={BannerOpenView} />
                </>
              )}
              <Stack.Screen options={{ animationEnabled: false, animation: "none" }} name="User" component={User} />
              <Stack.Screen name="Search" component={Search} />
              <Stack.Screen name="Notification" component={Notification} />
              <Stack.Screen options={{ animationEnabled: false, animation: "none" }} name="Booking" component={Booking} />
              <Stack.Screen options={{ animation: "slide_from_bottom" }} name="QRScanner" component={QRScanner} />
              <Stack.Screen options={{ animation: "slide_from_bottom" }} name="ChatScreen" component={ChatScreen} />
              <Stack.Screen options={{}} name="Result" component={SearchResultScreen} />
              <Stack.Screen name="PaymentOverView" component={PaymentOverView} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  closeBtn: {
    width: width / 10,
    height: width / 10,
    borderRadius: 100,
    elevation: 5,
    backgroundColor: '#cb5151',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#cd8686',
    alignItems: 'center',
    margin: 10,
    marginTop: 10
  },
});
