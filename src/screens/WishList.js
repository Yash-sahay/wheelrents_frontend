// WishlistScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, VirtualizedList, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, IconButton, Chip } from 'react-native-paper';
import AppHeader from '../components/AppHeader';
import AppBottomBar from '../components/AppBottomBar';
import AppText from '../components/AppText';
import { appstyle } from '../styles/appstyle';
import { deleteWishListData, get_wishlist_by_user, toggleWishListForUser } from '../axios/axios_services/vehicleService';
import { updateLoaderReducer } from '../redux/reducer/loaderReducer';
import { useDispatch, useSelector } from 'react-redux';
import { baseURL, dateSimplify } from '../../common';
import FontAwesome from 'react-native-vector-icons/FontAwesome6'
import { CardComponent } from './Result';

const Wishlist = ({navigation}) => {
  const dispatch = useDispatch()
  const [wishlistItems, setWishlistItems] = useState([null, null, null, null]);
  const { bookingStartDate, bookingEndDate } = useSelector(state => state.userReducer);

  const removeFromWishlist = (itemId) => {
    // Remove the item from the wishlist based on its id
    setWishlistItems((prevItems) => prevItems.filter((item) => item?.id !== itemId));
  };

  const getItemCount = () => wishlistItems?.length;

  const getItem = (data, index) => wishlistItems?.[index];



  const getWishList = async () => {
    try {
      const data = {
        startDate: bookingStartDate,
        endDate: bookingEndDate
      }
      const res = await get_wishlist_by_user({data});
      setWishlistItems(res.data)
    } catch (error) {
    }
  }

  useEffect(() => {
    getWishList()
  }, [])







  const renderWishlistItem = ({ item, index }) => {


    const handleAddToWishlist = async (item) => {
      try {
        const data = {
          vehicleId: item._id
        }
        await toggleWishListForUser({ data })
        getWishList()
      } catch (error) {
        console.error(error)
      }
    };
    return (
      <CardComponent item={item} keyId={index} navigation={navigation} handleAddToWishlist={handleAddToWishlist}/>
    )
  };



  return (
    <View style={{ flex: 1 }}>
      <AppHeader name={"WishList"} ui2  />
      <AppBottomBar />
      <View style={styles.container}>
        {wishlistItems?.length === 0 ? (
          <AppText style={styles.emptyMessage}>Your wishlist is empty.</AppText>
        ) : (
          <VirtualizedList
            contentContainerStyle={{paddingBottom: 100}}
            showsVerticalScrollIndicator={false}
            data={wishlistItems}
            getItemCount={getItemCount}
            getItem={getItem}
            renderItem={renderWishlistItem}
            keyExtractor={(item) => item?.id}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: appstyle.pri,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyMessage: {
    fontSize: 17,
    color: appstyle.tri,
  },
  cardContainer: {
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: appstyle.priBack,
    borderWidth: 1,
    borderColor: '#fff',
    elevation: 20,
    shadowColor: appstyle.shadowColor
  },
});

export default Wishlist;
