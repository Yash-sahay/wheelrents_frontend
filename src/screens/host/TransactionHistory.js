import { View, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppHeader from '../../components/AppHeader'
import { appstyle } from '../../styles/appstyle'
import { get_transaction_details } from '../../axios/axios_services/bookingService'
import moment from 'moment';
import AppText from '../../components/AppText'
import { Avatar, Card, Divider, IconButton } from 'react-native-paper'
import { amountFormatter } from '../../../common'


const TransactionHistory = () => {
    const [trnx, setTrnx] = useState({})

    const getTotalTranx = async () => {
        try {

            const res = await get_transaction_details({})
            const resdata = res?.data;
            if (resdata) {
                setTrnx(resdata)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getTotalTranx()
    }, [])


    // Grouping data by date
    const groupedData = trnx?.overallEarning?.reduce((acc, item) => {
        const date = moment(item.date).format('ddd DD MMM');
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(item);
        return acc;
    }, {});

    const renderWithdrawItem = ({ item, index, itemLast }) => (
        <Card.Title
            title={item?.withDrawStatus == "pending" ? "processing" : item?.withDrawStatus}
            style={{borderBottomWidth: index != itemLast ? 1 : 0, borderBlockColor: '#eee',marginBottom: 10}}
            subtitle={item?.bookingId}
            titleStyle={{color: appstyle.textBlack, fontWeight: '600', textTransform: "capitalize" }}
            subtitleStyle={{fontSize: 10, color: appstyle.textSec}}
            left={(props) => <Avatar.Icon {...props} style={{ backgroundColor: item?.withDrawStatus === 'pending' ? "orange" : "green" }} color={"white"} icon={item?.withDrawStatus === 'pending' ? "clock-alert" : "check-circle"} />}
            right={(props) => <AppText style={{ ...styles.itemAppText, color: item?.withDrawStatus === 'pending' ? "orange" : "green" }}>{"₹" + amountFormatter(item?.amount)}</AppText>}
        />
    );

    const renderWithdrawGroup = ({ item }) => {
        const itemDate = item?.date
        const itemLast = (groupedData[itemDate].length - 1)
        return (
            <View style={{ paddingHorizontal: 0, paddingRight: 20 }}>
                <AppText style={styles.dateHeading}>{item.date}</AppText>
                <FlatList
                    data={groupedData[itemDate]}
                    renderItem={({ item, index, }) => renderWithdrawItem({ item, index, itemLast })}
                    keyExtractor={(item) => item._id}
                />
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: appstyle.pri }}>
            <AppHeader ui2 name={"Transactions"} />

            <AppText style={{ ...styles.dateHeading, fontSize: 20 }}>{"Activity"}</AppText>
            <FlatList
                data={groupedData ? Object.keys(groupedData)?.map((date) => ({ date, data: groupedData[date] })) : []}
                renderItem={renderWithdrawGroup}
                keyExtractor={(item) => item.date}
            />
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


export default TransactionHistory