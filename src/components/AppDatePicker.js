import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserDetails } from '../redux/reducer/userReducer';
import DatePicker from 'react-native-date-picker'
import AppText from './AppText';
import { SegmentedButtons } from 'react-native-paper';
import { appstyle } from '../styles/appstyle';
import { BookingTabs } from '../screens/Booking';

const TABS = [
    { id: 'startDate', title: 'Pick-up', content: 'Pending Bookings', icon: 'arrowup' },
    { id: 'endDate', title: 'Drop-off', content: 'Active Bookings', icon: 'arrowdown' },
    // { id: 'completed', title: 'Completed', content: 'Completed Bookings' },
  ];

export default AppDatePicker = (props) => {

    // const [state, setState] = useState({ selectedStartDate: null, selectedEndDate: null })
    const { bookingStartDate, bookingEndDate } = useSelector(state => state.userReducer);
    const dispatch = useDispatch()

    const [value, setValue] = React.useState('startDate');
    const [tabValue, setTabValue] = useState(TABS[0]);
    
    const onDateChange = (date, type) => {
        if (type === 'END_DATE') {
            dispatch(updateUserDetails({ bookingEndDate: date }))
        } else {
            console.warn("start-date-->",date)
            dispatch(updateUserDetails({ bookingStartDate: date }))
        }
    }


    const minimumStartDate = new Date(new Date().getTime() + 5 * 60 * 60 * 1000);
    const minimubEndDate = new Date(new Date().getTime() + 10 * 60 * 60 * 1000);


    const properDate = (date, fallBackDate) => {
        if (Object.prototype.toString.call(date) === '[object Date]') {
            return date;
        }
        return fallBackDate;
    }

    return (
            <BookingTabs tabs={TABS} onChange={(tabVal) => setTabValue(prev => ({ ...tabVal }))}>
        <View style={styles.container}>
            
            {tabValue.id == "startDate" ? (
                <>
                    <AppText style={styles.text}>Select pick-up date</AppText>
                    <View style={styles.date}>
                        <DatePicker minimumDate={minimumStartDate} date={properDate(bookingStartDate, minimumStartDate)} onDateChange={(date) => onDateChange(date, 'START_DATE')} />
                    </View>
                </>
            ) : (
                <>
                    <AppText style={styles.text}>Select drop-off date</AppText>
                    <View style={styles.date}>
                        <DatePicker minimumDate={minimubEndDate} date={properDate(bookingEndDate, minimubEndDate)} onDateChange={(date) => onDateChange(date, 'END_DATE')} />
                    </View>
                </>
            )}
        </View>
            </BookingTabs>
    );
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        // alignItems: 'center',
        paddingHorizontal: 20
        // justifyContent: 'center'
    },
    text: {
        fontWeight: '900',
        fontSize: 20,
        color: appstyle.textSec
        // paddingTop: 20
    },
    date: {
        // height: '70%',
        width: '100%',
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 20,
        marginTop: 10,
        borderColor: '#f4f4f2',
        backgroundColor: appstyle.pri,
        elevation: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});