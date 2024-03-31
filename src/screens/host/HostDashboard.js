import { View, VirtualizedList, FlatList, Dimensions, Platform, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppButton from '../../components/AppButton'
import { deleteVehicleFromHost, getAllVehicle } from '../../axios/axios_services/vehicleService'
import { useNavigation } from '@react-navigation/native'
import { Card, AnimatedFAB, Text, Chip } from 'react-native-paper'
import AppText from '../../components/AppText'
import FontAwesome from 'react-native-vector-icons/FontAwesome6'
import { baseURL, dateSimplify } from '../../../common'
import AppHeader from '../../components/AppHeader'
import { get_vehicle_categories } from '../../axios/axios_services/homeService'
import { appstyle } from '../../styles/appstyle'
import { useSelector } from 'react-redux'
import AppBottomBar from '../../components/AppBottomBar'
import AppDialog from '../../components/AppDialog'


const Device_Width = Dimensions.get('window').width - 50

const HostDashboard = () => {
  const navigation = useNavigation()
  const [dataList, setDataList] = useState([])
  const [categoryList, setCategoryList] = useState([]);
  const [modalValue, setModalValue] = useState({visible: false, id: null, name: ""});
  const { bookingStartDate, bookingEndDate } = useSelector(state => state.userReducer);
  const [deleteLoader, setDeleteLoader] = useState(false)


  const getAllVehicleByUser = async () => {
    try {
      setDataList([])
      const data = {
        startDate: bookingStartDate,
        endDate: bookingEndDate
      }
      const res = await getAllVehicle({ data })
      const resdata = res.data;
      if (resdata) {
        setDataList(resdata)
      }
    } catch (error) {

    }
  }


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
  const deleteVehicle = async () => {
    try {
      setDeleteLoader(true)
      const payload = {
        vehicleId: modalValue?.id
      }
      const res = await deleteVehicleFromHost({data: payload});
      if (res.data) {
        setModalValue({id: null, visible: false, name: ""})
        getAllVehicleByUser()
        setDeleteLoader(false)
      }
    } catch (error) {
      setDeleteLoader(false)
      console.error(error)
    }
  }

  useEffect(() => {
    getAllVehicleByUser();
  }, [bookingStartDate, bookingEndDate])


  useEffect(() => {
    getAllCategory()
  }, [])

  const getItem = (data, index) => ({
    ...data[index],
    index: index,
  });

  const [isExtended, setIsExtended] = React.useState(true);

  const isIOS = Platform.OS === 'ios';

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

    setIsExtended(currentScrollPosition <= 0);
  };

  // const fabStyle = { [animateFrom]: 16 };


  return (
    <>
      <AppBottomBar />
      {/* <AnimatedFAB
        extended={isExtended}
        icon="plus"
        label={'List Your Vehicle'}
        onPress={() => navigation.navigate("AddVehicle")}
        elevated
        color={appstyle.pri}
        style={{
          backgroundColor: appstyle.tri,
          position: 'absolute',
          // margin: 16,
          right: 10,
          bottom: 100,
          zIndex: 8,
        }}

      /> */}
      <AppHeader filtersData={categoryList} filterPress={(retData) => setCategoryList(retData)} isExtended={isExtended} />
      <View style={{ backgroundColor: appstyle.pri, height: '100%', padding: 15, paddingTop: 0, position: 'relative' }}>
      <AppText style={{ fontWeight: 'bold', fontSize: 20, marginVertical: 5, }}>Your Listed Vehicles</AppText>
        <VirtualizedList
          onRefresh={getAllVehicleByUser}
          refreshing={false}
          onScroll={onScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 230 }}
          data={dataList}
          initialNumToRender={10}
          renderItem={({ item, index }) => <CardComponent setModalValue={setModalValue} item={item} key={index} navigation={navigation} />}
          keyExtractor={item => item.id}
          getItemCount={() => dataList.length}
          getItem={getItem}
        />
      </View>
      <AppDialog visible={modalValue.visible} 
      title='Are you sure?'
      description={`Once after deleting "${modalValue?.name}" you will not be able to get again. `}
      onCancelPress={() => {
        setModalValue({id: null, visible: false, name: ""})
      }}
      onSuccessPress={() => {
        deleteVehicle()
      }}/>
    </>
  )
}



const CardComponent = ({ item, navigation, key, setModalValue }) => (
  <Card key={key} mode="elevated" style={{ backgroundColor: appstyle.priBack, marginTop: 20, overflow: 'hidden' }}>
    <FlatList
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      data={item?.files}
      renderItem={(imgs) => <Card.Cover resizeMode="cover" style={{ width: Device_Width + 20, borderRadius: 0, }} source={{ uri: baseURL() + "public/vehicle/" + imgs.item?.fileName }} />}
    />
    <AppText style={{
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
      paddingVertical: 2,
      paddingHorizontal: 10,
      backgroundColor: !item?.available ? 'hsl(148,75%,22%)' : 'hsl(43,85%,33%)',
      color: appstyle.priBack,
      elevation: 10,
      shadowColor: appstyle.shadowColor,
      borderBottomRightRadius: 10,
    }}>
      {item?.available ? 'Not booked yet' : 'Booked at selected time period!'}
    </AppText>
    <Card.Content>
    
      <AppText style={{ color: 'grey', fontWeight: '900', marginTop: 10,  }}><Chip style={{backgroundColor: appstyle.sec}} textStyle={{color: 'black'}} ><FontAwesome name="user-gear" size={12} />  {item?.transmission}</Chip>    <Chip style={{backgroundColor: appstyle.sec}} ><FontAwesome name="gas-pump" size={12} />  {item?.fuelType}</Chip></AppText>
      <AppText variant="bodyMedium" style={{ fontWeight: '900', marginTop: 10, textTransform: "capitalize" }}>{item?.name}</AppText>
      {/* <AppText variant="bodyMedium" style={{ fontWeight: '900', marginTop: 10 }}>{item?.available ? "Available" : "Booked"}</AppText> */}
      <AppText variant="titleLarge" style={{ color: 'darkgreen', fontWeight: '900', fontSize: 25 }}>{item?.cost}₹/hr</AppText>
      <AppText variant="bodyMedium" style={{ color: 'grey', fontWeight: '900', marginTop: 10 }}>Added on {dateSimplify(item?.date)}</AppText>
    </Card.Content>
    <Card.Actions style={{ paddingBottom: 10, borderTopWidth: 1, borderColor: appstyle.pri, marginTop: 20, paddingTop: 10 }}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <AppButton icon={'circle-edit-outline'} onPress={() => navigation.navigate('AddVehicle', item)} >Edit Details</AppButton>
        <AppButton textColor={'tomato'} onPress={() => setModalValue({visible: true, id: item?._id, name: item?.name})} style={{ marginLeft: 10 }} icon={'delete'} >Delete</AppButton>
      </View>
    </Card.Actions>
  </Card>
);

export default HostDashboard