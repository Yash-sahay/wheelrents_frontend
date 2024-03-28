import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
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

const Stack = createStackNavigator();
const { width } = Dimensions.get("window")

const Navigation = () => {

  // const navigation = useNavigation()
  const { isLoggedIn } = useSelector(state => state?.userReducer);
  const { role } = useSelector(state => state.userReducer)

  return (
    <>
    <AppLoader/>
    {/* <AppBottomBar/> */}
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            {role?.includes('host') && (
              <>
                <Stack.Screen options={{ animationEnabled: false }} name="HostDashboard" component={HostDashboard} />
                <Stack.Screen name="AddVehicle" component={AddVehicle} />
              </>
            )}
            {role?.includes('client') && (
              <>
                <Stack.Screen options={{ animationEnabled: false }} name="Home" component={Home} />
                <Stack.Screen name="VehicleDetails" component={VehicleDetails} />
                <Stack.Screen options={{ animationEnabled: false }} name="WishList" component={Wishlist} />
              </>
            )}
            <Stack.Screen options={{ animationEnabled: false }} name="User" component={User} />
            <Stack.Screen name="Search" component={Search} />
            <Stack.Screen name="Notification" component={Notification} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signin" component={Signin} />
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
