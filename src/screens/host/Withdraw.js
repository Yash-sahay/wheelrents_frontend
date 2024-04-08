import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import AppBottomBar from '../../components/AppBottomBar'
import { updateUserDetails } from '../../redux/reducer/userReducer'
import {useDispatch} from 'react-redux'
import AppHeader from '../../components/AppHeader'

const Withdraw = () => {
   
  return (
    <>
    <AppHeader ui2/>
    <AppBottomBar/>
    <View>
      <Text>Withdraw</Text>
    </View>
    </>
  )
}

export default Withdraw