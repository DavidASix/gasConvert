import React, { Component } from 'react';
import { View, SafeAreaView } from 'react-native';
import Router from './src/config/Router';

export default class App extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Router />
      </SafeAreaView>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
};
