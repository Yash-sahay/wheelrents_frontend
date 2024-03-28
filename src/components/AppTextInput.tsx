import React from 'react'
import { TextInput, TextInputProps } from 'react-native-paper'
import { appstyle } from '../styles/appstyle'

const AppTextInput = (props: TextInputProps ) => {
  return <TextInput {...props} 
  value={props?.allValues?.[props?.name]}
  activeOutlineColor={appstyle.tri}  
  style={{marginTop: 15, backgroundColor: 'white',  ...props.style}} onChangeText={(text) => {
    if(props.setter && props?.allValues && props?.name)  {
      props?.setter({...props?.allValues, [props?.name]: text})
    };
    props.onChange && props?.onChange(text);
}}/>
}

export default AppTextInput