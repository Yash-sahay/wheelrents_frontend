import { Dimensions, FlatList, Image, Pressable, ScrollView, View, VirtualizedList } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Text, Card, TextInput, Icon } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserDetails } from '../redux/reducer/userReducer'
import { getAllVehicleListings, toggleWishListForUser } from '../axios/axios_services/vehicleService'
import { amountFormatter, baseURL } from '../../common'
import AppHeader from '../components/AppHeader'
import AppText from '../components/AppText'
import { get_vehicle_categories } from '../axios/axios_services/homeService'
import AppButton from '../components/AppButton'
import AppBottomBar from '../components/AppBottomBar'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import FontAwesome from 'react-native-vector-icons/FontAwesome6'
import Fontisto from 'react-native-vector-icons/Fontisto'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AppDatePicker from '../components/AppDatePicker'
import { appstyle } from '../styles/appstyle'
import { updateLoaderReducer } from '../redux/reducer/loaderReducer'
import MarqueeText from 'react-native-marquee';
import Marque from '../components/Marque'


const Device_Width = Dimensions.get('window').width - 50

const Home = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const { role, username } = useSelector(state => state.userReducer);
  const [dataList, setDataList] = useState([])


  const [isExtended, setIsExtended] = React.useState(true);
  const [activeSlide, setActiveSlide] = React.useState(0);


  const { bookingStartDate, bookingEndDate } = useSelector(state => state.userReducer);


  const isIOS = Platform.OS === 'ios';

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y);
    setIsExtended(!currentScrollPosition > 0 ? true : false);
  };


  const getAllVehicle = async () => {
    try {
      // dispatch(updateLoaderReducer({ loading: true }))
      const data = {
        startDate: bookingStartDate,
        endDate: bookingEndDate
      }
      const res = await getAllVehicleListings({ data })
      const response = res.data;
      if (response) {
        setDataList(response)
      }
      // dispatch(updateLoaderReducer({ loading: false }))
    } catch (error) {
      // dispatch(updateLoaderReducer({ loading: false }))
    }
  }




  useFocusEffect(
    React.useCallback(() => {
      getAllVehicle();
    }, [bookingStartDate, bookingEndDate])
  )


  const getItem = (data, index) => ({
    ...data[index],
    index: index,
  });

  const handleAddToWishlist = async (item) => {
    try {
      // dispatch(updateLoaderReducer({ loading: true }))
      const data = {
        vehicleId: item._id
      }
      await toggleWishListForUser({ data })
      // dispatch(updateLoaderReducer({loading: false}))
      getAllVehicle()
    } catch (error) {
      dispatch(updateLoaderReducer({ loading: false }))
      console.error(error)
    }
  };


  return (
    <>
      <AppBottomBar />
      <View style={{ backgroundColor: appstyle.pri, flex: 1 }}>
        <AppHeader isExtended={isExtended} />
        <ScrollView nestedScrollEnabled onScroll={onScroll} >
          <View style={{ paddingHorizontal: 20 }}>
            <AppText style={{ fontSize: 20, marginTop: 20, fontWeight: '900' }}>Category</AppText>
          </View>
          <CategoryList />
          {/* <VirtualizedList
        onScroll={onScroll}
        nestedScrollEnabled
        contentContainerStyle={{ }}
        data={dataList}
        initialNumToRender={10}
        renderItem={({ item, index }) => <CardComponent item={item} key={index} navigation={navigation} />}
        keyExtractor={item => item.id}
        getItemCount={() => dataList.length}
        getItem={getItem}
      /> */}
          <View style={{ paddingHorizontal: 20 }}>
            <AppText style={{ fontSize: 20, marginTop: 20, fontWeight: '900' }}>Most Relevent</AppText>
          </View>
          <Carousel
            data={dataList}
            loop
            firstItem={0}
            renderItem={({ item, index }) => <CardComponent item={item} key={index} handleAddToWishlist={handleAddToWishlist} navigation={navigation} getAllVehicle={getAllVehicle} />}
            sliderWidth={Device_Width + 50}
            itemWidth={Device_Width - 50}
            onSnapToItem={(index) => setActiveSlide(index)}
          />
          <View>
            <Pagination
              dotsLength={dataList.length}
              activeDotIndex={activeSlide}
              dotStyle={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 8,
                // backgroundColor: 'rgba(255, 255, 255, 0.92)'
              }}
              inactiveDotStyle={{
                // Define styles for inactive dots here
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />


          </View>
          <Image resizeMode={'cover'} source={require("../../assets/images/black_wave.png")} />
          <View style={{ width: '100%', height: 1000, backgroundColor: appstyle.tri }}>


          <Marque
          style={{ fontSize: 50, marginTop: -30, color: appstyle.pri, opacity: 0.4, fontWeight: 'bold' }}
        >
           ● Car Trips ● Bike Trips ● Personal Rides ●
        </Marque>
          </View>
        </ScrollView>
        {/* <AppDatePicker /> */}
      </View>
    </>
  )
}


const CategoryList = () => {
  const [categoryList, setCategoryList] = useState([])
  const getAllCategory = async () => {
    try {
      const res = await get_vehicle_categories();
      if (res.data) {
        setCategoryList(res.data);
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getAllCategory()
  }, [])


  return (
    <View style={{ paddingBottom: 10 }}>
      <FlatList
        nestedScrollEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categoryList}
        renderItem={({ item, index }) => {
          return (
            <View key={index} style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, marginRight: 15, marginLeft: index > 0 ? 0 : 20 }}>
              <View style={{ height: 70, width: 70, backgroundColor: '#fff', elevation: 2, shadowColor: appstyle.shadowColor, borderRadius: 20, borderWidth: 1, borderColor: '#f4f4f2', justifyContent: 'center', alignItems: "center" }}>
                <Image resizeMode={'cover'} style={{ width: 40, height: 40 }} source={{ uri: baseURL() + "public/category/" + item?.image }} />
              </View>
              <AppText style={{ fontWeight: '700', marginTop: 8, fontSize: 13, }} >{item?.name?.toUpperCase()}</AppText>
            </View>
          )
        }}
      />
    </View>
  )
}



const CardComponent = ({ item, navigation, handleAddToWishlist }) => {
  const dispatch = useDispatch();
  const styles = {
    card: {
      marginTop: 10,
      overflow: 'hidden',
      backgroundColor: appstyle.tri,
      borderColor: appstyle.priBack,
      borderWidth: 2,
      marginBottom: 2,
    },
    availabilityText: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
      paddingVertical: 2,
      paddingHorizontal: 10,
      backgroundColor: item?.available ? 'hsl(148,75%,22%)' : 'hsl(43,85%,33%)',
      color: appstyle.priBack,
      elevation: 10,
      shadowColor: appstyle.shadowColor,
      borderBottomRightRadius: 10,
    },
    imageList: {
      pagingEnabled: true,
      height: 180,
      showsHorizontalScrollIndicator: false,
    },
    image: {
      width: '100%',
      borderRadius: 0,
      height: 180,
    },
    content: {
      height: 70,
    },
    infoText: {
      color: appstyle.textSec,
      fontWeight: '900',
      fontSize: 12,
      marginTop: 10,
      textTransform: 'capitalize',
    },
    title: {
      fontWeight: '900',
      marginTop: 10,
      color: '#ddd',
      textTransform: 'capitalize',
    },
    cost: {
      color: 'lightgreen',
      fontWeight: '900',
    },
    actions: {
      // Add any common styles for actions here
    },
    addToWishlistBtn: {
      position: 'absolute',
      right: 10,
      top: 10,
      zIndex: 2
    }
  };

  
  return (
    <Card style={styles.card}>
      <Pressable onPress={() => handleAddToWishlist(item)} style={styles.addToWishlistBtn}>
        <Fontisto name={"heart"} style={{ elevation: 30 }} color={item.isWishList ? '#ff3b30' : '#ddd'} size={20} />
      </Pressable>
      <AppText style={styles.availabilityText}>
        {item?.available ? 'Available' : 'Booked at selected time period!'}
      </AppText>
      <FlatList
        style={styles.imageList}
        data={item?.files}
        renderItem={(imgs) => (
          <Card.Cover
            resizeMode="cover"
            style={styles.image}
            source={{ uri: baseURL() + 'public/vehicle/' + imgs.item?.fileName }}
          />
        )}
      />

      <Card.Content style={styles.content}>
        <AppText style={styles.infoText}>
          <FontAwesome name="user-gear" size={12} /> {item?.transmission}{'   '}
          <FontAwesome name="gas-pump" size={12} /> {item?.fuelType}
        </AppText>
        <Text variant="bodyMedium" style={styles.title}>
          {item?.name}
        </Text>
        <Text variant="titleLarge" style={styles.cost}>
          ₹{amountFormatter(item.cost)}/hr
        </Text>
        {/* <Text variant="bodyMedium" style={styles.title}>
          {item?.name}
        </Text> */}
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <AppButton buttonColor={appstyle.priBack} outlined icon={'eye'} onPress={() => navigation.navigate('VehicleDetails', { ...item })}>
          View Details
        </AppButton>
      </Card.Actions>
    </Card>
  );
};

export default Home