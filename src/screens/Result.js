import React, { useEffect, useState } from 'react';
import { View, FlatList, Pressable, Dimensions, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Searchbar } from 'react-native-paper'; // Import Searchbar from react-native-paper
import { appstyle } from '../styles/appstyle';
import { searchApi } from '../axios/axios_services/homeService';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { Text, Card } from 'react-native-paper'
import AppHeader from '../components/AppHeader'
import AppText from '../components/AppText'
import { amountFormatter, baseURL } from '../../common';
import AppButton from '../components/AppButton';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { toggleWishListForUser } from '../axios/axios_services/vehicleService';
import { updateLoaderReducer } from '../redux/reducer/loaderReducer';
import { useDispatch, useSelector } from 'react-redux'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';



const SearchResultScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { bookingStartDate, bookingEndDate } = useSelector(state => state.userReducer);

  const [searchResults, setSearchResults] = useState([]);

  const onChangeSearch = query => {
    setSearchQuery(query);
    // Perform search based on query and update searchResults state
    // Example: setSearchResults([...]); // Update with search results
  };

  const searchDatabase = async () => {
    try {
      const data = {
        startDate: bookingStartDate,
        endDate: bookingEndDate
      }
      const res = await searchApi(route?.params?.searchString, data)
      setSearchResults(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    searchDatabase()
  }, [route?.params?.searchString])

  const handleAddToWishlist = async (item) => {
    try {
      // dispatch(updateLoaderReducer({ loading: true }))
      const data = {
        vehicleId: item._id
      }
      await toggleWishListForUser({ data })
      // dispatch(updateLoaderReducer({loading: false}))
      searchDatabase()
    } catch (error) {
      // dispatch(updateLoaderReducer({ loading: false }))
      console.error(error)
    }
  };



  return (
    <View style={{ flex: 1, backgroundColor: appstyle.pri }}>
      <StatusBar animated backgroundColor={'transparent'} barStyle={'dark-content'} translucent showHideTransition={'fade'} />
      <View style={{ padding: 20, paddingTop: 30, elevation: 10, backgroundColor: appstyle.pri }}>
        <AppText style={{ fontWeight: 'bold', fontSize: 30, color: appstyle.textBlack }}>Explore</AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Searchbar
            // onFocus={() => setFocus(true)}
            // onBlur={() => setFocus(false)}
            editable={true}
            inputStyle={styles.searchBar}
            // onSubmitEditing={(val) => submitEdit(val)}
            placeholderTextColor={appstyle.textSec}
            style={[styles.searchBarContainer]}
            placeholder="Search for vehicles"
            disableFullscreenUI
            // ref={searchRef}
            onChangeText={onChangeSearch}
            value={route?.params?.searchString}
          />
          <View style={[styles.filterButtonContainer]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.filterButton, { backgroundColor: appstyle.pri }]}>

              <Ionicons style={[styles.filterIcon, { color: appstyle.tri }]} size={30} name="filter" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* <AppText style={{ fontWeight: 'bold', paddingHorizontal: 20, fontSize: 20, marginBottom: 30, marginBottom: 5, color: appstyle.textSec }}><Icon name="search" size={20} />  Showing result for "{route?.params?.searchString}"</AppText> */}
      <FlatList
        data={searchResults}
        style={{flex:1}}
        contentContainerStyle={{paddingBottom: 100}}
        keyExtractor={item => item?._id?.toString()} // Assuming each item has a unique id
        renderItem={({ item }) => (
          <CardComponent
            item={item}
            navigation={navigation}
            handleAddToWishlist={handleAddToWishlist} // Ensure this function is defined and passed correctly
          />
        )}
      />
    </View>
  );
};
const Device_Width = Dimensions.get('window').width - 60


const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    width: Device_Width - 60,
    borderRadius: 10,
    backgroundColor: '#f4f4f2',
    color: appstyle.textSec,
    // borderWidth: 2,
    borderColor: '#f4f4f2',
    // borderStyle: 'dashed',
    marginTop: 10,
  },
  searchBar: {
    padding: 0,
    height: 40,
    color: appstyle.textSec,
    fontWeight: '800',
  },
  filterButtonContainer: {
    padding: 1,
    overflow: 'hidden',
    marginTop: 10,
  },
  filterButton: {
    padding: 0,
    backgroundColor: appstyle.tri,
    height: 54,
    width: 55,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    color: appstyle.pri,
    size: 20,
  },
})



export function CardComponent({ item, navigation, handleAddToWishlist }) {
  // const dispatch = useDispatch();
  const styles = {
    card: {
      marginTop: 20,
      margin: 20,
      overflow: 'hidden',
      shadowColor: appstyle.shadowColor,
      backgroundColor: appstyle.pri,
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
      borderRadius: 0,
      height: 180,
      width: Device_Width + 20,
      borderRadius: 0,
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
      fontSize: 20,
      color: appstyle.textBlack,
      textTransform: 'capitalize',
    },
    cost: {
      color: 'green',
      fontWeight: "bold",
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
    <Card elevation={20} style={styles.card}>
      <Pressable onPress={() => handleAddToWishlist(item)} style={styles.addToWishlistBtn}>
        <Fontisto name={"heart"} style={{ elevation: 30 }} color={item?.isWishList ? '#ff3b30' : '#ddd'} size={20} />
      </Pressable>
      <AppText style={styles.availabilityText}>
        {item?.available ? 'Available' : 'Booked at selected time period!'}
      </AppText>
      <FlatList
        style={styles.imageList}
        data={item?.files}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={(imgs) => (
          <Card.Cover

            resizeMode="cover"
            style={styles.image}
            source={{ uri: baseURL() + 'public/vehicle/' + imgs?.item?.fileName }}
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
          ₹{amountFormatter(item?.cost)}/hr
        </Text>
        {/* <Text variant="bodyMedium" style={styles.title}>
            {item?.name}
          </Text> */}
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <AppButton buttonColor={appstyle.tri} icon={'eye'} onPress={() => navigation.navigate('VehicleDetails', { ...item })}>
          View Details
        </AppButton>
      </Card.Actions>
    </Card>
  );
};


export default SearchResultScreen;
