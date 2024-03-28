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


const User = () => {
  const dispatch = useDispatch()
  const { username, email } = useSelector(state => state.userReducer)
  return (
    <View style={{ backgroundColor: appstyle.pri, flex: 1 }}>
      <AppBottomBar/>
      <AppHeader ui2 />
      <View style={{ width: '100%', padding: 20, justifyContent: 'center', alignItems: 'center', }}>
        <View style={{ width: 150, height: 150, backgroundColor: 'lightgrey', borderRadius: 1000, borderWidth: 2, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', }}>
          {/* <Image/> */}
          <FontAwesome6 name="user" size={70} />
        </View>
        <AppText style={{ fontWeight: '900', color: appstyle.tri, fontSize: 20, marginTop: 10 }}>{username}</AppText>
        <AppText style={{ fontWeight: '900', color: 'grey', fontSize: 15, marginBottom: 10 }}>{email}</AppText>
        <View style={{ borderRadius: 20, backgroundColor: appstyle.accent, height: 300, elevation: 10, shadowColor: appstyle.shadowColor, borderWidth: 1, borderColor: '#fff', justifyContent: 'space-between', marginTop: 10, width: '100%', padding: 10 }}>
          <View>
            <TileBtn icon={'user'} text={"KYC"} />
            <TileBtn />
          </View>
          <AppButton style={{backgroundColor: '#ff3b30'}} textColor="#fff" onPress={() => { dispatch(updateUserDetails({ isLoggedIn: false })) }} outlined icon={'logout-variant'}>LogOut</AppButton>
        </View>
      </View>
    </View>
  )
}


const TileBtn = ({ onPress, text, icon }) => {
  return (
    <Pressable onPress={onPress && onPress} style={{ width: '100%', borderBottomWidth: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 15, borderColor: appstyle.pri }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {icon && (
          <FontAwesome6 color={appstyle.tri} name={icon} size={17} />
        )}
        <AppText style={{ fontSize: 17, fontWeight: '600', color: appstyle.tri }}>  {text}</AppText>
      </View>
      <FontAwesome6 name={'arrow-right'} color={appstyle.tri} size={20} />
    </Pressable>
  )
}

export default User