import { View, Text, FlatList, Pressable, Image, Dimensions, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AppBottomBar from '../../components/AppBottomBar'
import { updateUserDetails } from '../../redux/reducer/userReducer'
import { useDispatch } from 'react-redux'
import AppHeader from '../../components/AppHeader'
import { appstyle } from '../../styles/appstyle'
import AppButton from '../../components/AppButton'
import AppText from '../../components/AppText'
import { Avatar, Card, Checkbox, Icon, IconButton, TextInput } from 'react-native-paper'
import { get_booking_transaction_by_user, update_host_payment_status } from '../../axios/axios_services/homeService'
import { amountFormatter } from '../../../common'
import AppShimmer from '../../components/AppShimmer'
import AnimatedNumbers from 'react-native-animated-numbers';
import AppBottomSheet from '../../components/AppBottomSheet'
import AppTextInput from '../../components/AppTextInput'
import FastImage from 'react-native-fast-image'
import LottieView from 'lottie-react-native';
import { MotiView } from 'moti'

const ScreenWidth = Dimensions.get("screen").width

const Withdraw = ({navigation}) => {

  const [results, setResults] = useState([null, null, null, null, null, null])
  const [bottomSheet, setBottomSheet] = useState(false);
  const [allValues, setAllValues] = useState({});

  const animationRef = useRef(null);



  const getHostIncome = async () => {
    try {
      let res = await get_booking_transaction_by_user()
      let arr = []
      if (res.data?.transactions?.length > 0) {
        res.data?.transactions.map(tnx => {
          if (tnx?.assosiatedBooking?.bookingStatus != "started") {
            return arr = [...arr, { ...tnx, nonSelectable: true }]
          }
          arr = [...arr, { ...tnx, nonSelectable: false }]
        })
      }
      let indexValue = null
      const data = arr.filter((checkSelectable, index) => {
        if (checkSelectable?.nonSelectable == true) {
          if (!indexValue) {
            indexValue = index
          }
        }
      })
      if (arr?.[indexValue]) {
        arr[indexValue].checked = true
      }
      setResults(arr)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getHostIncome()
  }, [])

  const handleCheck = (item, index) => {
    let res = [...results]
    if (item.checked) {
      res[index] = { ...item, checked: false }
    } else {
      res[index] = { ...item, checked: true }
    }
    setResults(res)
  }

  const totalWithdraw = () => {
    const allAmt = results?.filter(val => val?.checked)

    let amt = 0
    allAmt?.map(item => {
      amt += JSON.parse(item?.withdrawableAmt)
    })

    return amt
  }

  const [widthDrawLoader, setWithDrawLoader] = useState({ loading: false, success: false })

  const withdraw = async () => {
    const checkAmt = results.filter(check => check.checked == true);
    if (bottomSheet == true) {
      try {
        setWithDrawLoader(true)
        const payload = {
          transactions: checkAmt,
          withDrawStatus: "pending",
          vpaId: allValues?.vpa
        }
        const updateStatus = await update_host_payment_status(payload);
        if (updateStatus.data.success) {
          setWithDrawLoader({ loading: false, success: true })
          animationRef.current?.play(0, 62);
          onPressTouch()
          getHostIncome()
        }
      } catch (error) {
        console.error(error)
        setWithDrawLoader({ loading: false, success: false })
      }
    }
    setBottomSheet(true)
  }



  const CardTransaction = ({ item, index }) => (
    <AppShimmer visible={item ? true : false} style={[{ backgroundColor: '#f4f4f2', height: 70, width: '100%', borderRadius: 20, marginTop: 10, borderWidth: 2, borderColor: 'transparent' }, item?.checked && { borderWidth: 2, borderColor: appstyle.textSec }]}>
      <Pressable onPress={() => item?.nonSelectable && handleCheck(item, index)}>
        <Card.Title
          style={[{ backgroundColor: '#f4f4f2', borderRadius: 20, marginTop: 10, borderWidth: 2, borderColor: 'transparent' }, item?.checked && { borderWidth: 2, borderColor: 'darkgreen' }]}
          titleStyle={{ color: !item?.nonSelectable ? '#cb9700' : "green", fontWeight: 'bold' }}
          title={"+ ₹" + amountFormatter(item?.withdrawableAmt)}
          subtitleStyle={{ fontSize: 10, fontStyle: 'italic', opacity: 0.5, fontWeight: '100', color: appstyle.textSec }}
          subtitle={"#ref-" + item?.bookingId}
          left={(props) => <View>
            {item?.nonSelectable && <View style={{ position: 'absolute', zIndex: 1, top: -8, left: -8, backgroundColor: '#f4f4f2', height: 28, alignItems: 'center', justifyContent: 'center', width: 28, borderRadius: 100, }}>
              <Icon size={25} color='green' source={item?.checked ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} />
            </View>}
            <Avatar.Icon style={{ backgroundColor: !item?.nonSelectable ? '#ffcc37' : appstyle.textBlack }} {...props} icon={!item?.nonSelectable ? "clock-time-three" : "cash-plus"} />
          </View>}
        />
      </Pressable>
    </AppShimmer>
  );




  var match = /[a-zA-Z0-9_]{3,}@[a-zA-Z]{3,}/;

  const scrollRef = useRef(null);
  const onPressTouch = () => {
    scrollRef.current?.scrollTo({
      x: ScreenWidth,
      animated: true,
    });
  }

  return (
    <>
      <AppHeader ui2 renderRight={<IconButton onPress={() => navigation.navigate("TransactionHistory")} size={30} iconColor={appstyle.pri} icon={"history"} />} />
      <AppBottomBar />

      <AppBottomSheet visible={true} snapPoints={['40%']} bottomSheet={bottomSheet} setBottomSheet={setBottomSheet}>

        <View style={{ paddingHorizontal: 20, height: '100%', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
          <ScrollView style={{ height: '100%' }} showsHorizontalScrollIndicator={false} ref={scrollRef} horizontal pagingEnabled scrollEnabled={false} >
            <MotiView
              transition={{ damping: 10 }}
              animate={{ translateX: widthDrawLoader?.success ? -500 : 0 }}
              style={{ width: ScreenWidth - 40, height: '100%' }}>
              <AppText style={{ fontWeight: 'bold', fontSize: 15, color: appstyle.textBlack, paddingVertical: 10 }}>Enter Your UPI ID</AppText>
              <AppTextInput
                mode="outlined"
                label="UPI ID"
                keyboardType="email-address"
                name={'vpa'}
                placeholder='example@rbi'
                setter={setAllValues}
                allValues={allValues}
                error={allValues?.vpa?.length > 0 ? !match.test(allValues.vpa) : false}
              />
              <AppButton
                onPress={withdraw}
                loading={widthDrawLoader?.loading}
                disabled={!match.test(allValues?.vpa) || widthDrawLoader?.loading}
                style={{ backgroundColor: !match.test(allValues.vpa) ? 'lightgrey' : appstyle.tri, marginVertical: 20 }} >Proceed</AppButton>
            </MotiView>

            <MotiView
              style={{ width: ScreenWidth - 40, alignItems: 'center' }}
              transition={{ damping: 20, delay: 10 }}
              animate={{ translateX: !widthDrawLoader?.success ? 500 : 0 }}
            >
              {widthDrawLoader?.success && <LottieView
                ref={animationRef}
                style={{ height: 200, width: 200 }}
                source={require('../../../assets/animation/success_animation.json')} autoPlay loop={false} />}
              {widthDrawLoader?.success && <>
                <MotiView
                  transition={{ damping: 50 }}
                  from={{ translateY: 100, opacity: 0 }}
                  animate={{ translateY: 0, opacity: 1 }}
                  delay={1000}
                  style={{ width: '100%' }}>
                  <AppButton
                    onPress={() => {
                      setBottomSheet(false)
                    }}
                    style={{ marginBottom: 5, backgroundColor: appstyle.tri, width: "100%" }} >Done</AppButton>
                </MotiView>
                <MotiView
                  delay={1400}
                  transition={{ damping: 50 }}
                  from={{ translateY: 100, opacity: 0 }}
                  animate={{ translateY: 0, opacity: 1 }}
                  style={{ width: '100%' }}>
                  <AppText style={{ fontWeight: 'bold', fontSize: 10, color: appstyle.textSec, textAlign: 'center' }}>We have received your request, and the requested amount will be credited to your bank account shortly.</AppText>
                </MotiView>
              </>}
            </MotiView>
          </ScrollView>
        </View>
      </AppBottomSheet>
      <View style={{ flex: 1, backgroundColor: appstyle.pri, paddingHorizontal: 20 }}>

        {/* <AppText style={{ fontWeight: 'bold', fontSize: 30, color: appstyle.textBlack }}>Your Earnings</AppText> */}
        <View style={{ marginVertical: 20, width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <AppText style={{ fontWeight: 'bold', fontSize: 50, color: totalWithdraw() < 1 ? 'grey' : appstyle.tri }}>₹</AppText>
          <AnimatedNumbers
            includeComma
            animationDuration={700}
            animateToNumber={totalWithdraw()}
            fontStyle={{ fontSize: 50, fontWeight: 'bold', color: totalWithdraw() < 1 ? 'grey' : appstyle.tri }}
          />
        </View>
        <AppButton
          onPress={withdraw}
          style={{ marginVertical: 20, backgroundColor: totalWithdraw() < 1 ? 'lightgrey' : appstyle.tri }} disabled={totalWithdraw() < 1}>Withdraw</AppButton>
        <AppText style={{ fontWeight: 'bold', fontSize: 15, color: appstyle.textBlack, paddingVertical: 10 }}>Your Earnings</AppText>
        <FlatList
          keyExtractor={(item) => item?._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150 }}
          data={results}
          renderItem={({ item, index }) => <CardTransaction item={item} index={index} />}
        // keyExtractor={}
        />

      </View>
    </>
  )
}


export default Withdraw