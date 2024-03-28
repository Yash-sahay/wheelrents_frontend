import React, { useState } from 'react';
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

export default AppDatePicker = (props) => {

    // const [state, setState] = useState({ selectedStartDate: null, selectedEndDate: null })
    const { bookingStartDate, bookingEndDate } = useSelector(state => state.userReducer);
    const dispatch = useDispatch()

    const [value, setValue] = React.useState('startDate');

    const onDateChange = (date, type) => {
        if (type === 'END_DATE') {
            dispatch(updateUserDetails({ bookingEndDate: date }))
        } else {
            dispatch(updateUserDetails({ bookingStartDate: date }))
        }
    }


    // Add 5 hours to the current date
    const startDate = bookingStartDate ? new Date(bookingStartDate) : new Date();
    const endDate = bookingEndDate ? new Date(bookingEndDate) : new Date(new Date().getTime() + 5 * 60 * 60 * 1000);

    return (
        <View style={styles.container}>
            <SegmentedButtons
                theme={{ colors: { primary: 'green' } }}
                value={value}
                style={{ borderColor: 'red' }}
                onValueChange={setValue}
                buttons={[
                    {
                        icon: 'calendar-start',
                        value: 'startDate',
                        label: 'Pick up time',
                    },
                    {
                        icon: 'calendar-end',
                        value: 'endDate',
                        label: 'Drop off time',
                    },
                ]}
            />
            {value == "startDate" ? (
                <View style={styles.date}>
                    {/* <AppText style={styles.text}>SELECT START DATE</AppText> */}
                    <DatePicker androidVariant="nativeAndroid" date={startDate} onDateChange={(date) => onDateChange(date, 'START_DATE')} />
                </View>
            ) : (
                <View style={styles.date}>
                    {/* <AppText style={styles.text}>SELECT END DATE</AppText> */}
                    <DatePicker androidVariant="nativeAndroid" date={endDate} onDateChange={(date) => onDateChange(date, 'END_DATE')} />
                </View>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        padding: 20
        // justifyContent: 'center'
    },
    text: {
        fontWeight: '900',
        fontSize: 20,
    },
    date: {
        height: '70%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    }
});