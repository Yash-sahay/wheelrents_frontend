import React from 'react'
import { Button } from 'react-native-paper'
import { appstyle } from '../styles/appstyle'

const AppButton = (props) => {
  if (props?.outlined) return <Button style={{ borderWidth: 1,  borderColor: appstyle.textBlack, ...props?.style }} buttonColor={appstyle.pri} textColor={appstyle.textBlack} {...props}/>
  return <Button style={{ ...props.style }} buttonColor={appstyle.tri} textColor={appstyle.pri}  {...props} />
}

export default AppButton