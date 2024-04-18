import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CELL_SIZE = width / 10;

const Calendar = () => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  // Function to get the days in a month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Function to generate calendar days
  const generateCalendarDays = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];

    // Fill in empty cells for the days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Generate calendar days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // Function to handle date selection
  const handleDateSelection = (day) => {
    if (selectedStartDate && selectedEndDate) {
      // Reset selection if both start and end dates are already selected
      setSelectedStartDate(day);
      setSelectedEndDate(null);
    } else if (selectedStartDate === null) {
      // Select start date if none is selected
      setSelectedStartDate(day);
    } else if (selectedStartDate !== null && selectedEndDate === null) {
      // Select end date if start date is already selected
      setSelectedEndDate(day);
    }
  };

  // Render calendar days
  const renderCalendarDays = () => {
    const days = generateCalendarDays();
    return days.map((day, index) => {
      const isSelected = (selectedStartDate && selectedEndDate) ? (day >= selectedStartDate && day <= selectedEndDate) :
                         (selectedStartDate === day || selectedEndDate === day);
      return (
        <TouchableOpacity
          key={index}
          style={[
            styles.dayContainer,
            { backgroundColor: isSelected ? '#f0f0f0' : 'transparent' },
            { width: CELL_SIZE, height: CELL_SIZE },
          ]}
          onPress={() => handleDateSelection(day)}>
          {day !== null && <Text style={[styles.dayText, { color: isSelected ? '#000' : '#333' }]}>{day}</Text>}
        </TouchableOpacity>
      );
    });
  };

  // Render days of the week
  const renderDayOfWeek = (dayOfWeek) => {
    return (
      <View key={dayOfWeek} style={[styles.dayContainer, { width: CELL_SIZE, height: CELL_SIZE }]}>
        <Text style={styles.dayOfWeekText}>{dayOfWeek}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.daysContainer}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(renderDayOfWeek)}
      </View>
      <View style={styles.daysContainer}>{renderCalendarDays()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    // paddingHorizontal: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: CELL_SIZE / 2,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dayOfWeekText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayText: {
    fontSize: 16,
  },
});

export default Calendar;
