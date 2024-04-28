import { Dimensions, FlatList, Image, Pressable, ScrollView, View, VirtualizedList } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Text, Card, TextInput, Icon } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserDetails } from '../redux/reducer/userReducer'
import { getAllVehicleListings, toggleWishListForUser } from '../axios/axios_services/vehicleService'
import { amountFormatter, baseURL, calculateDistance } from '../../common'
import AppHeader from '../components/AppHeader'
import AppText from '../components/AppText'
import { get_banner_images, get_vehicle_categories } from '../axios/axios_services/homeService'
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
import Animated from 'react-native-reanimated'
import { Marquee } from '@animatereactnative/marquee';
import AppShimmer from '../components/AppShimmer'


const Device_Width = Dimensions.get('window').width - 50

const Home = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const { role, username, lat, long } = useSelector(state => state.userReducer);
  const [dataList, setDataList] = useState([null, null, null, null, null,])


  const [isExtended, setIsExtended] = React.useState(true);
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [activeSlideBanner, setActiveSlideBanner] = React.useState(0);

  const [bannerList, setBannerListList] = useState([null, null, null, null])

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


  const getAllBanners = async () => {
    try {
      const res = await get_banner_images();
      if (res.data) {
        setBannerListList(res.data.allBanners);
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getAllBanners()
  }, [])




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
          <Carousel
            data={bannerList}
            loop
            autoplayInterval={10000}
            autoplay={true}
            firstItem={0}
            renderItem={({ item, index }) => (
              <AppShimmer style={{ width: '100%', height: 200, marginVertical: 20, overflow: 'hidden', borderRadius: 20, }} visible={item == null ? false : true}>
                <View style={{ width: '100%', height: 200, overflow: 'hidden', borderRadius: 20, marginVertical: 20 }}>
                  <Pressable onPress={() => navigation.navigate("BannerOpenView", { uri: baseURL() + 'public/category/' + item?.image, tag: 'Img' + index })}>
                    <Animated.Image
                      sharedTransitionTag={'Img' + index}
                      resizeMode="stretch"
                      style={{
                        width: '100%',
                        borderRadius: 0,
                        height: 200,
                      }}
                      source={{ uri: baseURL() + 'public/category/' + item?.image }}
                    />
                  </Pressable>
                </View>
              </AppShimmer>
            )}
            sliderWidth={Device_Width + 50}
            itemWidth={Device_Width - 0}
            onSnapToItem={(index) => setActiveSlideBanner(index)}
          />
          <View style={{ marginTop: -30 }}>
            <Pagination
              dotsLength={bannerList?.length}
              activeDotIndex={activeSlideBanner}
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
          <View style={{ zIndex: 1, marginTop: -40, overflow: 'visible' }}>
            <View>
              <Image resizeMode={'contain'} style={{ width: '100%', height: 100 }} source={require("../../assets/images/wave.png")} />
            </View>
            <View style={{ backgroundColor: '#f7f7f7', height: 100, zIndex: 1, marginTop: -20 }}>

            </View>
            <View style={{ position: 'absolute', zIndex: 2, top: 60, paddingHorizontal: 20 }}>
              <AppText style={{ fontSize: 20, fontWeight: '900' }}>Category</AppText>
              <CategoryList />
            </View>
            <View style={{backgroundColor: '#f7f7f7', zIndex: 2, paddingTop: 20}}>
            <View style={{ paddingHorizontal: 20 }}>
              <AppText style={{ fontSize: 20, marginTop: 20, fontWeight: '900' }}>Most Relevent</AppText>
            </View>
            <Carousel
              data={dataList}
              loop
              firstItem={0}
              renderItem={({ item, index }) => <CardComponent latitude={lat} longitude={long} item={item} keyId={index} handleAddToWishlist={handleAddToWishlist} getAllVehicle={getAllVehicle} />}
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
            </View>
            <View>
              <Image resizeMode={'contain'} style={{ width: '100%', height: 100, marginTop: -8 }} source={require("../../assets/images/greyWave.png")} />
            </View>
          </View>


          <Image resizeMode={'cover'} source={require("../../assets/images/black_wave.png")} />
          <View style={{ width: '100%', height: 1000, marginTop: -30, backgroundColor: appstyle.tri }}>
            <Marquee spacing={20} speed={1}>
              <AppText style={{ fontSize: 60, fontWeight: 'bold', color: appstyle.textSec }}>● Car Trips  ● Bike Trips  ● Personal Rides  </AppText>
            </Marquee>
            <Marquee spacing={20} speed={2}>
              <AppText style={{ fontSize: 60, fontWeight: 'bold', color: appstyle.textSec }}>● Car Trips  ● Bike Trips  ● Personal Rides  </AppText>
            </Marquee>
          </View>
        </ScrollView>
        {/* <AppDatePicker /> */}
      </View>
    </>
  )
}


const CategoryList = () => {
  const [categoryList, setCategoryList] = useState([null, null, null, null])
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
            <View key={index} style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 5, marginRight: 15, marginLeft: index > 0 ? 0 : 3 }}>
              <AppShimmer style={{ height: 80, width: 120, borderRadius: 20, elevation: 2, shadowColor: appstyle.shadowColor }} visible={item == null ? false : true}>
              </AppShimmer>
              {item && <View style={{ height: 80, minWidth: 120, backgroundColor: appstyle.pri, elevation: 2, shadowColor: appstyle.shadowColor, borderRadius: 20, borderWidth: 1, borderColor: appstyle.pri, flexDirection: 'row', justifyContent: 'center', alignItems: "center" }}>
                <Image resizeMode={'cover'} style={{ width: 40, height: 40 }} source={{ uri: baseURL() + "public/category/" + item?.image }} />
                <View style={{}}>
                  <AppText style={{ fontWeight: '700', fontSize: 16, marginLeft: 10 }} >{item?.name?.toUpperCase()}</AppText>
                  <AppText style={{ fontWeight: '700', marginTop: -5, fontSize: 10, color: appstyle.textSec, marginLeft: 10 }} >{'View all'}</AppText>
                </View>
              </View>}
            </View>
          )
        }}
      />
    </View>
  )
}



function CardComponent({ item, handleAddToWishlist, latitude, keyId, longitude }) {
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const styles = {
    card: {
      marginTop: 10,
      overflow: 'hidden',
      backgroundColor: appstyle.tri,
      marginBottom: 2,
      borderRadius: 20,
    },
    availabilityText: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
      paddingVertical: 2,
      paddingHorizontal: 10,
      paddingTop: 3,
      paddingLeft: 20,
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

  const distance = JSON.stringify(parseInt(item?.latitude)) != "null" ? calculateDistance({ latitude, longitude }, { latitude: item?.latitude, longitude: item?.longitude }) + " Km" : "N/A"

  return (
    <Card key={keyId} style={styles.card}>
      <Pressable onPress={() => handleAddToWishlist(item)} style={styles.addToWishlistBtn}>
        <AppShimmer style={{ height: 20, width: 20, borderRadius: 20, }} visible={item == null ? false : true}>
          <Fontisto name={"heart"} style={{ elevation: 30 }} color={item?.isWishList ? '#ff3b30' : '#ddd'} size={20} />
        </AppShimmer>
      </Pressable>
      {item && <AppText style={styles.availabilityText}>
        {item?.available ? 'Available' : 'Booked at selected time period!'}
      </AppText>}
      <FlatList
        style={styles.imageList}
        data={item?.files || [null]}
        renderItem={({ index }) => (
          <AppShimmer style={styles.image} visible={item == null ? false : true}>
            <Animated.Image
              resizeMode="cover"
              style={styles.image}
              sharedTransitionTag={"carData" + keyId + index}
              source={{ uri: baseURL() + 'public/vehicle/' + item?.files?.[0]?.fileName }}
            />
          </AppShimmer>
        )}
      />
      <Card.Content style={styles.content}>
        <AppShimmer style={{ ...styles.infoText, borderRadius: 20 }} visible={item == null ? false : true}>
          <AppText style={styles.infoText}>
            <FontAwesome name="user-gear" size={12} /> {item?.transmission}{'   '}
            <FontAwesome name="gas-pump" size={12} /> {item?.fuelType}
          </AppText>
        </AppShimmer>
        <AppShimmer style={{ ...styles.title, width: 60, borderRadius: 20 }} visible={item == null ? false : true}>
          <Text variant="bodyMedium" style={styles.title}>
            {item?.name}
          </Text>
        </AppShimmer>
        <AppShimmer style={{ ...styles.cost, width: 50, marginTop: 10, borderRadius: 20 }} visible={item == null ? false : true}>
          <Text variant="titleLarge" style={styles.cost}>
            ₹{amountFormatter(item?.cost)}/hr
          </Text>
        </AppShimmer>
        <AppShimmer style={{ ...styles.title, width: 30, borderRadius: 20 }} visible={item == null ? false : true}>
          <Text variant="bodyMedium" style={{ fontWeight: 'bold', color: 'grey' }}>
            {distance}
          </Text>
        </AppShimmer>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <AppShimmer style={{ ...styles.title, marginTop: 0, width: 130, height: 40, borderRadius: 20 }} visible={item == null ? false : true}>
          <AppButton buttonColor={appstyle.priBack} outlined icon={'eye'} onPress={() => navigation.navigate('VehicleDetails', { ...item, tag: "carData" + keyId })}>
            View Details
          </AppButton>
        </AppShimmer>
      </Card.Actions>
    </Card>
  );
};

export default Home