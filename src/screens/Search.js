import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import AppHeader from '../components/AppHeader';
import { get_vehicle_categories, searchApi } from '../axios/axios_services/homeService';
import AppText from '../components/AppText';
import Icon from 'react-native-vector-icons/FontAwesome5'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserDetails } from '../redux/reducer/userReducer';
import { baseURL } from '../../common';
import { appstyle } from '../styles/appstyle';

const Search = () => {
  const { searchString, recentSearches } = useSelector(state => state.userReducer)
  const dispatch = useDispatch()


  const [categoryList, setCategoryList] = useState([])
  const [searchList, setSearchList] = useState([])
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

  const putIntoSearch = (text) => {
    dispatch(updateUserDetails({ searchString: text }))
  }

  useEffect(() => {
    getAllCategory()
  }, [])

  useEffect(() => {
    searchString?.length > 0 && searchDatabase()
  }, [searchString])


  const searchDatabase = async () => {
    try {
      const res = await searchApi(searchString)
      setSearchList(res.data)
    } catch (error) {
      console.error(error)
    }
  }


  return (
    <View style={styles.container}>
      <AppHeader isExtended={false} search={true} />
      <View style={{ paddingHorizontal: 20 }}>
        {searchString?.length > 0 ? (
          <>
              <AppText style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 20, }}><Icon name="search" size={20} />  Searching for "{searchString}"</AppText>
              {searchList?.map((string, index) => (
                <TouchableOpacity onPress={() => putIntoSearch(string?.name)} style={styles.recentItems}>
                  <View style={styles.recentItemsContent}>
                    <MaterialIcons name="search" size={20} />
                    <AppText style={{ paddingHorizontal: 10, fontWeight: '500' }}>{string?.name}</AppText>
                  </View>
                </TouchableOpacity>
              ))}
          </>
        ) : (
          <>
            {(recentSearches?.length > 0) && (
              <>
                <AppText style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 20, }}><Icon name="search" size={20} />  Recent Searches</AppText>
                {recentSearches?.map((string, index) => (
                  <TouchableOpacity onPress={() => putIntoSearch(string)} style={styles.recentItems}>
                    <View style={styles.recentItemsContent}>
                      <MaterialIcons name="restore" size={20} />
                      <AppText style={{ paddingHorizontal: 10, fontWeight: '500' }}>{string}</AppText>
                    </View>
                    <TouchableOpacity onPress={() => dispatch(updateUserDetails({ recentSearches: recentSearches.filter((item, i) => i !== index) }))}>
                      <MaterialIcons name="close" size={20} style={{ color: 'lightgrey' }} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </>
            )}
            <AppText style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 20, marginTop: 30, }}><Icon name="search" size={20} />  Browse Categories</AppText>
            <FlatList
              data={categoryList}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => putIntoSearch(item?.name)} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                  <View style={{ backgroundColor: appstyle.pri, padding: 5, borderRadius: 10 }}>
                    <Image resizeMode={'cover'} style={{ width: 40, height: 40 }} source={{ uri: baseURL() + "public/category/" + item?.image }} />
                  </View>
                  <AppText style={{ marginLeft: 20, textTransform: "capitalize", fontWeight: '500' }}>{item?.name}</AppText>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  cancelButton: {
    color: 'blue',
    marginRight: 10,
  },
  backButton: {
    color: 'blue',
    marginLeft: 10,
  },
  sectionContainer: {
    marginBottom: 10,
  },
  categoryItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    borderRadius: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    // backgroundColor: 'red',
  },
  recentItems: {
    // padding: 10,
    paddingVertical: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  recentItemsContent: {
    flexDirection: 'row'
  }
});

export default Search;
