import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import AppHeader from '../../components/AppHeader'
import AppText from '../../components/AppText'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import { useDispatch, useSelector } from 'react-redux'
import AppButton from '../../components/AppButton'
import { updateUserDetails } from '../../redux/reducer/userReducer'
import { appstyle } from '../../styles/appstyle'
import { TouchableOpacity } from '@gorhom/bottom-sheet'
import AppBottomBar from '../../components/AppBottomBar'


const User = ({navigation}) => {
  const dispatch = useDispatch()
  const { username, email } = useSelector(state => state.userReducer)
  return (
    <View style={{ backgroundColor: appstyle.pri, flex: 1 }}>
      <AppBottomBar/>
      <AppHeader ui2 />
      <View style={{ width: '100%', padding: 20, justifyContent: 'center', alignItems: 'center', }}>
        <View style={{ width: 150, height: 150, backgroundColor: '#f4f4f2', borderRadius: 1000, borderWidth: 2, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', }}>
          {/* <Image/> */}
          <FontAwesome6 name="user" size={70} />
        </View>
        <AppText style={{ fontWeight: '900', color: appstyle.textBlack, fontSize: 20, marginTop: 10 }}>{username}</AppText>
        <AppText style={{ fontWeight: '900', color: appstyle.textSec, fontSize: 15, marginBottom: 10 }}>{email}</AppText>
        <View style={{ borderRadius: 20, backgroundColor: appstyle.pri, height: 300, elevation: 2, shadowColor: appstyle.shadowColor, borderWidth: 1, borderColor: '#f4f4f2', justifyContent: 'space-between', marginTop: 10, width: '100%', padding: 10 }}>
          <View>
            <TileBtn icon={'user'} text={"KYC"} />
            <TileBtn icon={"phone"} text={"Need any help?"} onPress={() => navigation.navigate("ChatScreen")} />
          </View>
          <AppButton style={{backgroundColor: '#ff3b302e'}} textColor="#ff3b30" onPress={() => { dispatch(updateUserDetails({ isLoggedIn: false })) }}  icon={'logout-variant'}>Logout</AppButton>
        </View>
      </View>
    </View>
  )
}


const TileBtn = ({ onPress, text, icon }) => {
  return (
    <Pressable onPress={onPress && onPress} style={{ width: '100%', borderBottomWidth: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 15, borderColor: '#f4f4f2' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {icon && (
          <FontAwesome6 color={appstyle.textBlack} name={icon} size={17} />
        )}
        <AppText style={{ fontSize: 16, fontWeight: '500', color: appstyle.textSec }}>  {text}</AppText>
      </View>
      <FontAwesome6 name={'arrow-right'} color={appstyle.textBlack} size={20} />
    </Pressable>
  )
}

export default User