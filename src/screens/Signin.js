import { StatusBar, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Chip, Divider, TextInput } from 'react-native-paper'
import { createuser, loginUser } from '../axios/axios_services/loginService'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { updateUserDetails } from '../redux/reducer/userReducer'
import AppButton from '../components/AppButton'
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppTextInput from '../components/AppTextInput'
import AppText from '../components/AppText'
import Icon from 'react-native-vector-icons/FontAwesome6'
import { appstyle } from '../styles/appstyle'

const Signin = () => {
  const [allValues, setAllValues] = useState({ email: '', phoneNo: '', password: '', userType: 'client', secureTextEntry: true })
  const navigation = useNavigation()

  const dispatch = useDispatch()

  const createUserFun = async () => {
    try {
      const payload = { ...allValues }
      const user = await createuser({ data: payload })
      const { id, name } = user.data.user

      if (name) {
        alert('Hoorray! ' + name + ' Please Login now and start using weelrents.')
        navigation.navigate('Login')
      }
    } catch (error) {
      alert(JSON.stringify(error))
    }
  }

  const handleChange = (dynKey, value) => {
    setAllValues((prevState) => ({ ...prevState, [dynKey]: value }))
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar translucent barStyle={"dark-content"} backgroundColor={"transparent"} />
      <View style={{ padding: 20, flex: 1, backgroundColor: appstyle.pri, justifyContent: 'flex-end' }}>
        <View>
          <AppText style={{ fontWeight: '900', color: appstyle.tri, fontSize: 25, textAlign: 'center', marginVertical: 20 }}>Become A Member!</AppText>
          <AppTextInput
            right={<TextInput.Icon icon={'account'} />}
            mode="outlined"
            label="User Name"
            name={'name'}
            setter={setAllValues}
            allValues={allValues}
          />
          <AppTextInput
            right={<TextInput.Icon icon={'email'} />}
            mode="outlined"
            label="Email"
            name={'email'}
            keyboardType="email-address"
            textContentType="emailAddress"
            returnKeyType="done"
            autoCapitalize='none'
            setter={setAllValues}
            allValues={allValues}
          />
          <AppTextInput
            right={<TextInput.Icon icon={'phone'} />}
            mode="outlined"
            label="Phone Number"
            maxLength={10}
            keyboardType="phone-pad"
            name={'phoneNo'}
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
          <View>
            <AppText style={{ fontWeight: 'bold', paddingVertical: 10, marginTop: 5 }}>Select purpose</AppText>
            <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}>
              <CustomChip
                style={{ marginLeft: 4 }}
                keyValue={'userType'}
                name={"client"}
                onPress={(val) => handleChange("userType", val)}
                allValues={allValues}>For Renting</CustomChip>
              <CustomChip
                keyValue={'userType'}
                style={{ marginLeft: 10 }}
                onPress={(val) => handleChange("userType", val)}
                name={"host"}
                allValues={allValues}>For Hosting</CustomChip>
            </View>
          </View>
          <View style={{ position: 'relative', marginVertical: 20 }}>
            <Divider
              style={{}}
              bold
              theme={{ colors: { primary: appstyle.textSec } }}
            />
            <AppText style={{ textAlign: 'center', width: 30, top: -10, left: '45%', position: 'absolute', backgroundColor: appstyle.pri, fontWeight: 'bold', color: appstyle.textSec }}>OR</AppText>
          </View>
        </View>
        <View>
          <AppButton mode="outlined" style={{ marginTop: 20 }} onPress={createUserFun}>Create Account    <Icon name={'arrow-right'} size={14} color={appstyle.pri} /></AppButton>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <AppText style={{ textAlign: 'center', fontWeight: 'bold', color: appstyle.textSec, marginVertical: 10 }}>Already have an account? <AppText style={{ color: '#0163f7', textDecorationLine: 'underline', textDecorationColor: '#0163f7', textDecorationStyle: 'dashed' }}>Log In</AppText></AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}


const CustomChip = ({ allValues, name, keyValue, children, style, onPress, icon }) => {
  return (
    <Chip
      selectedColor={appstyle.pri}
      elevated
      elevation={1}
      selected={allValues?.[keyValue] == name}
      style={{ backgroundColor: allValues?.[keyValue] == name ? appstyle.tri : appstyle.pri, ...style }}
      textStyle={{ color: allValues?.[keyValue] == name ? appstyle.pri : appstyle.tri }}
      onPress={() => onPress(name)}>{children}</Chip>
  )
}

export default Signin