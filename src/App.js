import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, Alert, StyleSheet } from 'react-native';

const TimerApp = () => {
  const [timers, setTimers] = useState([]);

  const addTimer = (inputTime = 60) => {
    if (timers.length < 5) {
      setTimers([...timers, { id: Date.now(), timeLeft: inputTime, isRunning: false, inputTime }]);
    } else {
      Alert.alert('Limit Reached', 'You can only add up to 5 timers.');
    }
  };

  const startTimer = (id) => {
    setTimers(timers.map(timer => timer.id === id ? { ...timer, isRunning: true } : timer));
  };

  const pauseTimer = (id) => {
    setTimers(timers.map(timer => timer.id === id ? { ...timer, isRunning: false } : timer));
  };

  const resetTimer = (id) => {
    setTimers(timers.map(timer => timer.id === id ? { ...timer, timeLeft: timer.inputTime, isRunning: false } : timer));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(timers => timers.map(timer => {
        if (timer.isRunning && timer.timeLeft > 0) {
          return { ...timer, timeLeft: timer.timeLeft - 1 };
        }
        if (timer.timeLeft === 0 && timer.isRunning) {
          Alert.alert('Timer Complete', `Timer ${timer.id} has finished.`);
          return { ...timer, isRunning: false };
        }
        return timer;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [timers]);

  return (
    <View style={styles.container}>
      <FlatList
        data={timers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.timer}>
            <Text>{`Time Left: ${item.timeLeft} seconds`}</Text>
            <Button title={item.isRunning ? "Pause" : "Start"} onPress={() => item.isRunning ? pauseTimer(item.id) : startTimer(item.id)} />
            <Button title="Reset" onPress={() => resetTimer(item.id)} />
          </View>
        )}
      />
      <Button title="Add Timer" onPress={() => addTimer()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  timer: { margin: 10, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 5 }
});

export default TimerApp;
