import React, { useState } from 'react';
  import { StyleSheet, Text, View } from 'react-native';
  import { Dropdown } from 'react-native-element-dropdown';
import AppText from './AppText';
import { appstyle } from '../styles/appstyle';

  
  const AppDropDown = ({label, data, labelField, valueField, setter, allValues, search, name}) => {
    
    const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
      if(isFocus || allValues?.[name]) {      
        return (
          <Text style={[styles.label, isFocus && { color: 'rgba(0,0,0,0.7)', fontWeight: '600', borderRadius: 20 }]}>
            {label}
          </Text>
        );
      }
    };

    return (
      <View>
        {renderLabel()}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderWidth: 2, borderColor: appstyle.tri }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          itemTextStyle={styles?.itemTextStyle}
          data={data}
          search={search}
          maxHeight={300}
          labelField={labelField}
          valueField={valueField}
          placeholder={!isFocus ? label : '...'}
          searchPlaceholder="Search..."
          value={allValues?.[name]}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setter({...allValues, [name]: item?.[valueField]});
            setIsFocus(false);
          }}
        />
      </View>
    );
  };

  export default AppDropDown;

  const styles = StyleSheet.create({
    dropdown: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      color: appstyle.tri,
      backgroundColor: 'white',
      paddingHorizontal: 8,
      marginTop: 20
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: appstyle.pri,
      color: appstyle.tri,
      left: 7,
      top: 13,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 12,
    },
    placeholderStyle: {
      color: appstyle.tri,
      fontSize: 16,
      marginLeft: 5
    },
    selectedTextStyle: {
      fontSize: 16,
      color: appstyle.tri,
      marginLeft: 5
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      color: appstyle.tri,
      height: 40,
      fontSize: 16,
    },
    itemTextStyle: {
      color: appstyle.tri,
    }
  });
