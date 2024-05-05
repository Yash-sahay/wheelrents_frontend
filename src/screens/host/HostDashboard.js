import { View, VirtualizedList, FlatList, Dimensions, Platform, ScrollView, RefreshControl, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppButton from '../../components/AppButton'
import { deleteVehicleFromHost, getAllVehicle } from '../../axios/axios_services/vehicleService'
import { useNavigation } from '@react-navigation/native'
import { Card, AnimatedFAB, Text, Chip } from 'react-native-paper'
import AppText from '../../components/AppText'
import FontAwesome from 'react-native-vector-icons/FontAwesome6'
import { amountFormatter, baseURL, dateSimplify } from '../../../common'
import AppHeader from '../../components/AppHeader'
import { get_vehicle_categories } from '../../axios/axios_services/homeService'
import { appstyle } from '../../styles/appstyle'
import { useSelector } from 'react-redux'
import AppBottomBar from '../../components/AppBottomBar'
import AppDialog from '../../components/AppDialog'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { get_transaction_details } from '../../axios/axios_services/bookingService'

const Device_Width = Dimensions.get('window').width - 50

const HostDashboard = () => {
  const navigation = useNavigation()
  const [dataList, setDataList] = useState([])
  const [categoryList, setCategoryList] = useState([]);
  const [modalValue, setModalValue] = useState({ visible: false, id: null, name: "" });
  const { bookingStartDate, bookingEndDate } = useSelector(state => state.userReducer);
  const [deleteLoader, setDeleteLoader] = useState(false)
  const [trnx, setTrnx] = useState({})


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
      console.error(error)
    }
  }

  const getTotalTranx = async () => {
    try {
      const data = {
        // startDate: bookingStartDate,
        // endDate: bookingEndDate
      }
      const res = await get_transaction_details({ data })
      const resdata = res.data;
      if (resdata) {
        setTrnx(resdata)
      }
    } catch (error) {
      console.error(error)
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
      const res = await deleteVehicleFromHost({ data: payload });
      if (res.data) {
        setModalValue({ id: null, visible: false, name: "" })
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
    getTotalTranx()
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
      <AppHeader mode={"dark"} filterPress={(retData) => setCategoryList(retData)} isExtended={isExtended} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 100 }}
        onScroll={onScroll}
        refreshControl={<RefreshControl refreshing={false} onRefresh={() => { getAllVehicleByUser(); getTotalTranx() }} />}

        style={{ backgroundColor: appstyle.pri, height: '100%', paddingVertical: 15, paddingTop: 0, position: 'relative' }}>
        <AppText style={{ fontSize: 20, marginTop: 20, fontWeight: '900', marginLeft: 20 }}>Overview</AppText>
        <View style={{ width: '100%', flexDirection: 'row', paddingTop: 10, marginLeft: 10 }}>
          <View style={{ minHeight: 120, padding: 15, justifyContent: 'space-between', width: '35%', marginLeft: 10, backgroundColor: appstyle.tri, borderRadius: 15, elevation: 10, shadowColor: appstyle.shadowColor }}>
            <FontAwesome size={25} color={'#ddd'} name="money-bill-1-wave" />
            <AppText style={{ fontSize: 12, color: '#ddd', fontWeight: 'bold' }}>Today's Income</AppText>
            <AppText style={{ color: appstyle.pri, fontSize: 25, fontWeight: 'bold', marginTop: -10, color: '#008542', textTransform: "capitalize" }} >₹{amountFormatter(trnx?.todaysEarning) || "N/A"}</AppText>
          </View>
          <Pressable 
          onPress={() => navigation.navigate("TransactionHistory")}
          style={{ height: 120, padding: 15, width: '55%', flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10, backgroundColor: appstyle.tri, borderRadius: 15, elevation: 10, shadowColor: appstyle.shadowColor }}>
            <View style={{ height: '100%', justifyContent: 'space-between' }}>
              <FontAwesome size={25} color={'#ddd'} name="money-bills" />
              <AppText style={{ fontSize: 12, color: '#ddd', fontWeight: 'bold' }}>Total Income</AppText>
              <AppText style={{ fontWeight: 'bold', fontSize: 25, color: '#008542', marginTop: -10, textTransform: "capitalize" }} >₹{amountFormatter(trnx?.totalEarning) || "N/A"}</AppText>
            </View>
            <View style={{ height: '100%', flexDirection: 'row', alignItems: 'center', borderLeftWidth: 1, borderStyle: 'dashed', borderColor: appstyle.textSec }}>

              <AppText style={{ fontSize: 20, color: appstyle.textSec, fontWeight: 'bold', transform: [{ rotate: '-90deg' }], marginRight: -20 }}><MaterialCommunityIcons size={15} color={appstyle.textSec} name="view-dashboard-outline" /> view</AppText>
            </View>
          </Pressable>
        </View>
        <AppText style={{ fontSize: 20, marginTop: 20, fontWeight: '900', marginLeft: 20 }}>Your Listed Vechicles</AppText>
        {/* <AppText style={{ fontWeight: 'bold', fontSize: 20, marginTop: 5, marginLeft: 15 }}>Your Listed Vehicles</AppText> */}
        {/* <VirtualizedList
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
        /> */}
        {dataList.map((item, index) => <CardComponent setModalValue={setModalValue} item={item} key={index} navigation={navigation} />)}
      </ScrollView>
      <AppDialog visible={modalValue.visible}
        title='Are you sure?'
        description={`Once after deleting "${modalValue?.name}" you will not be able to get again. `}
        onCancelPress={() => {
          setModalValue({ id: null, visible: false, name: "" })
        }}
        onSuccessPress={() => {
          deleteVehicle()
        }} />
    </>
  )
}



const CardComponent = ({ item, navigation, key, setModalValue }) => (
  <Card key={key} elevation={20} style={{ shadowColor: appstyle.shadowColor, backgroundColor: appstyle.priBack, marginTop: 20, marginHorizontal: 15, overflow: 'hidden', borderRadius: 20, }}>
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
      <AppText style={{ color: appstyle.textSec, fontWeight: '900', marginTop: 10, }}>
        <Chip style={{ backgroundColor: "#f4f4f2" }} textStyle={{ color: appstyle.textBlack }} ><FontAwesome name="user-gear" size={12} />  {item?.transmission}</Chip>    <Chip style={{ backgroundColor: "#f4f4f2" }} textStyle={{ color: appstyle.textBlack }} ><FontAwesome name="gas-pump" size={12} />  {item?.fuelType}</Chip></AppText>
      <AppText variant="bodyMedium" style={{ fontWeight: '900', marginTop: 10, fontSize: 20, textTransform: "capitalize" }}>{item?.name}</AppText>
      
        {item?.vehicleCategory == "car" ? (
        <AppText style={{ color: appstyle.textSec, fontWeight: '900' }}><FontAwesome name="car" size={12} />  {item?.vehicleType} </AppText>
      ) : (
        <AppText style={{ color: appstyle.textSec, fontWeight: '900' }}><MaterialCommunityIcons name="motorbike" size={12} />  {item?.vehicleType}</AppText>
        )}
      {/* <AppText variant="bodyMedium" style={{ fontWeight: '900', marginTop: 10 }}>{item?.available ? "Available" : "Booked"}</AppText> */}
      <AppText style={{ color: '#008542', fontWeight: "bold", fontSize: 25 }}>₹{amountFormatter(item?.cost)}/hr</AppText>
      <AppText variant="bodyMedium" style={{ color: appstyle.textSec, fontWeight: '900', marginTop: 10 }}>Added on {dateSimplify(item?.date)}</AppText>
    </Card.Content>
    <Card.Actions style={{ paddingBottom: 10, borderTopWidth: 1, borderColor: '#f4f4f2', marginTop: 20, paddingTop: 10 }}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
        <AppButton icon={'circle-edit-outline'} onPress={() => navigation.navigate('AddVehicle', item)} >Edit Details</AppButton>
        <AppButton textColor={'tomato'} onPress={() => setModalValue({ visible: true, id: item?._id, name: item?.name })} style={{ marginLeft: 10 }} icon={'delete'} >Delete</AppButton>
      </View>
    </Card.Actions>
  </Card >
);

export default HostDashboard