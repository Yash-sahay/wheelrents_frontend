// WishlistScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, VirtualizedList, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, IconButton } from 'react-native-paper';
import AppHeader from '../components/AppHeader';
import AppBottomBar from '../components/AppBottomBar';
import AppText from '../components/AppText';
import { appstyle } from '../styles/appstyle';
import { deleteWishListData, get_wishlist_by_user, toggleWishListForUser } from '../axios/axios_services/vehicleService';
import { updateLoaderReducer } from '../redux/reducer/loaderReducer';
import { useDispatch } from 'react-redux';

const Wishlist = () => {
  const dispatch = useDispatch()
  const [wishlistItems, setWishlistItems] = useState([
    // { id: '1', title: 'Product 1', description: 'Description for Product 1', image: 'https://placekitten.com/200/300' },
    // { id: '2', title: 'Product 2', description: 'Description for Product 2', image: 'https://placekitten.com/200/301' },
    // { id: '3', title: 'Product 3', description: 'Description for Product 3', image: 'https://placekitten.com/200/302' },
    // Add more wishlist items as needed
  ]);

  const removeFromWishlist = (itemId) => {
    // Remove the item from the wishlist based on its id
    setWishlistItems((prevItems) => prevItems.filter((item) => item?.id !== itemId));
  };

  const getItemCount = () => wishlistItems?.length;

  const getItem = (data, index) => wishlistItems?.[index];



  const getWishList = async () => {
    try {
      dispatch(updateLoaderReducer({ loading: true }))
      const res = await get_wishlist_by_user();
      setWishlistItems(res.data)
      dispatch(updateLoaderReducer({ loading: false }))
    } catch (error) {
      dispatch(updateLoaderReducer({ loading: false }))
    }
  }

  useEffect(() => {
    getWishList()
  }, [])





  const renderWishlistItem = ({ item }) => {


    const handleAddToWishlist = async () => {
      try {
        dispatch(updateLoaderReducer({ loading: true }))
        const data = {
          vehicleId: item.vehicleId
        }
        const res = await deleteWishListData({ data })
        console.warn(res.data?.message)
        dispatch(updateLoaderReducer({ loading: false }))
        getWishList()
      } catch (error) {
        dispatch(updateLoaderReducer({ loading: false }))
        console.error(error)
      }
    };
    return (
      <Card style={styles.cardContainer}>
        <Card.Cover source={{ uri: item.image }} />
        <Card.Content>
          <Title>{item.title}</Title>
          <Paragraph>{item.description}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <IconButton icon="delete" iconColor="tomato" onPress={() => handleAddToWishlist()} />
        </Card.Actions>
      </Card>
    )
  };



  return (
    <View style={{ flex: 1 }}>
      <AppHeader name={"Wish List"} ui2 />
      <AppBottomBar />
      <View style={styles.container}>
        {wishlistItems?.length === 0 ? (
          <AppText style={styles.emptyMessage}>Your wishlist is empty.</AppText>
        ) : (
          <VirtualizedList
            showsVerticalScrollIndicator={false}
            data={wishlistItems}
            getItemCount={getItemCount}
            getItem={getItem}
            renderItem={renderWishlistItem}
            keyExtractor={(item) => item.id}
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
    padding: 20,
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
    backgroundColor: appstyle.accent,
    borderWidth: 1,
    borderColor: '#fff',
    elevation: 20,
    shadowColor: appstyle.shadowColor
  },
});

export default Wishlist;
