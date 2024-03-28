import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, VirtualizedList } from 'react-native';
import AppHeader from '../../components/AppHeader';
import { appstyle } from '../../styles/appstyle';

const NotificationCard = ({ notification }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Image source={{ uri: notification.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message}>{notification.message}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Notification = () => {
  const notifications = [
    {
      id: '1',
      title: 'New Message',
      message: 'You have a new message from John Doe',
      image: 'https://example.com/user1.jpg',
    },
    {
      id: '2',
      title: 'Reminder',
      message: "Don't forget to complete your task today!",
      image: 'https://example.com/remind.jpg',
    },
    // Add more notifications as needed
  ];

  const getItemCount = () => notifications.length;

  const getItem = (data, index) => notifications[index];

  const renderNotification = ({ item }) => (
    <NotificationCard key={item.id} notification={item} />
  );

  return (
    <>
    <AppHeader ui2/>
    <View style={styles.screenContainer}>
      {/* <Text style={styles.header}>Notifications</Text> */}
      <VirtualizedList
        data={notifications}
        keyExtractor={(item) => item.id}
        getItemCount={getItemCount}
        getItem={getItem}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContainer}
      />
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: appstyle.pri,
    // padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: appstyle.accent,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: appstyle.priBack,
    marginBottom: 16,
    padding: 12,
    elevation: 15,
    shadowColor: appstyle.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    fontSize: 16,
    color: '#555',
  },
  listContainer: {
    padding: 16
  }
});

export default Notification;
