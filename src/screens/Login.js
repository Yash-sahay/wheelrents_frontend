import { Image, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Divider, TextInput } from 'react-native-paper'
import { loginUser } from '../axios/axios_services/loginService'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { updateUserDetails } from '../redux/reducer/userReducer'
import AppButton from '../components/AppButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppTextInput from '../components/AppTextInput'
import AppText from '../components/AppText'
import Icon from 'react-native-vector-icons/FontAwesome6'
import { updateLoaderReducer } from '../redux/reducer/loaderReducer'
import { appstyle } from '../styles/appstyle'

const Login = () => {
  const [allValues, setAllValues] = useState({ email: 'yash@gmail.com', password: 'radhekrishna', secureTextEntry: true })
  const navigation = useNavigation()

  const dispatch = useDispatch()

  const loginfun = async () => {
    try {
      dispatch(updateLoaderReducer({ loading: true}))
      const payload = { ...allValues }
      const login = await loginUser({ data: payload })
      const { id, name, userType, email } = login.data.user
      const obj = {
        username: name,
        userId: id,
        role: userType,
        email: email
      }
      dispatch(updateUserDetails({ isLoggedIn: true, ...obj }))
      dispatch(updateLoaderReducer({ loading: false}))
      await AsyncStorage.setItem('Tokens', JSON.stringify(login?.data))

      console.warn(login.data)
    } catch (error) {
      dispatch(updateLoaderReducer({ loading: false}))
      alert(JSON.stringify(error))
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 10, flex: 1, backgroundColor: appstyle.pri, justifyContent: 'space-between' }}>
        <View>
          <View  style={{width: '100%', alignItems: 'center'}}>
            <Image style={{width: 300, height: 300}} source={require('../../assets/images/login.png')} />
          </View>
          <AppText style={{ fontWeight: '900', color: appstyle.tri, fontSize: 25, textAlign: 'center', marginVertical: 20 }}>Welcome Back!</AppText>
          <AppTextInput
            right={<TextInput.Icon icon={'account'} />}
            mode="outlined"
            label="Email"
            name={'email'}
            setter={setAllValues}
            allValues={allValues}
          />
          <AppTextInput
            mode="outlined"
            label="Password"
            right={
              <TextInput.Icon
                onPress={() => setAllValues(prevState => ({ ...prevState, secureTextEntry: !prevState.secureTextEntry }))}
                icon={!allValues.secureTextEntry ? "eye" : 'eye-off'}
              />
            }
            name={'password'}
            secureTextEntry={allValues?.secureTextEntry}
            setter={setAllValues} allValues={allValues}
          />
          <View style={{position: 'relative', marginVertical: 20}}>
            <Divider
              style={{  }}
              bold
              theme={{ colors: { primary: appstyle.textSec } }}
            />
            <AppText style={{ textAlign: 'center', width: 30, top: -10, left: '45%', position: 'absolute', backgroundColor: appstyle.pri, fontWeight: 'bold', color: appstyle.textSec }}>OR</AppText>
          </View>
        </View>
        <View>
        <AppButton mode="outlined" style={{ marginTop: 20 }} onPress={loginfun}>Log In    <Icon name={'arrow-right'} size={14} color={appstyle.pri} /></AppButton>
        <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
          <AppText style={{ textAlign: 'center', fontWeight: 'bold', color: appstyle.textSec, marginVertical: 10 }}>Do not have an account? <AppText style={{color: '#0163f7', textDecorationLine: 'underline', textDecorationColor: '#0163f7', textDecorationStyle: 'dashed'}}>Sign In</AppText></AppText>
        </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Login