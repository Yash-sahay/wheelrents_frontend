import { View, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import { appstyle } from '../../styles/appstyle'
import { get_transaction_details } from '../../axios/axios_services/bookingService'
import moment from 'moment';
import AppText from '../../components/AppText'
import { Avatar, Card, Divider, IconButton } from 'react-native-paper'
import { amountFormatter } from '../../../common'
import { useSelector } from 'react-redux'


const Notification = () => {
    
  const {notifications} = useSelector(state => state.notificationReducer)


    const renderWithdrawItem = ({ item, index, itemLast }) => (
        <Card.Title
            title={item?.title}
            style={{marginBottom: 10}}
            subtitle={item?.body}
            titleStyle={{color: appstyle.textBlack, fontWeight: '600', textTransform: "capitalize" }}
            subtitleStyle={{fontSize: 13, color: appstyle.textSec}}
            left={(props) => <Avatar.Icon {...props} style={{ backgroundColor: appstyle.accent}} color={appstyle.textBlack} icon={'bell'} />}
        />
    );

    return (
        <View style={{ flex: 1, backgroundColor: appstyle.pri }}>
            <AppHeader ui2 name={"Notifications"} />

            <AppText style={{ ...styles.dateHeading, fontSize: 20 }}>{"Latest"}</AppText>
            <View style={{ paddingHorizontal: 0, paddingRight: 20 }}>
                <FlatList
                    data={notifications}
                    renderItem={({ item, index, }) => renderWithdrawItem({ item, index })}
                    keyExtractor={(item) => item._id}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        padding: 10,
        position: 'relative',
        display: 'flex',
    },
    itemAppText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    indicator: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'orange',
        borderRadius: 20,
        padding: 5,
    },
    completedIndicator: {
        backgroundColor: 'green',
    },
    dateHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
        paddingLeft: 20
    },
    rejected: {
        backgroundColor: '#FF0000',
        color: '#FFFFFF',
    },
    rejectionIndicator: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#FF0000',
        borderRadius: 20,
        padding: 5,
    },
    rejectionAppText: {
        color: '#FFFFFF',
        fontSize: 12,
    },
});


export default Notification