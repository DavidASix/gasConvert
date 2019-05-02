import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert
 } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

import states from '../states';
import { screenWidth, averageURL } from '../Constants';

class App extends Component {
  state = {
    area: null,
    displayArea: null,
    result: null,
    nationalAverage: ''
  }
  async componentDidMount() {
    try {
      let { data } = await axios.get('https://gasprices.aaa.com/');
      //console.log(data);
      let pos = data.search('National Average');
      if (pos === -1) { throw new Error('Data not found'); }
      let nPrice = data.substr(pos, 23);
      nPrice = nPrice.slice(18, 24);
      this.setState({ nationalAverage: `Today's national average is $${nPrice}/G` });
    } catch (err) {
      this.setState({ nationalAverage: 'National Average currently unavailable' });
    }
  }
  onPressGetPrice = async () => {
    this.setState({ result: 'loading', displayArea: this.state.area });
    try {
      let { data } = await axios.get(`${averageURL}${this.state.area}`);
      let page = data;
      let pos = page.search('Avg. ');
      if (pos === -1) { throw new Error('State not found'); }
      page = page.substr(pos, 11);
      page = page.slice(6, 11);
      this.setState({ result: page });
    } catch (err) {
      this.setState({ result: null });
      Alert.alert(
        'Error fetching price',
        'Something went wrong fetching the price for this state. Try again later.',
        { text: 'OK', onPress: () => {} }
      );
    }
  }

  renderResult() {
    if (this.state.result === null) {
      return (
        <Text style={styles.subTitle}>
          Select a state
        </Text>
      );
    } else if (this.state.result === 'loading') {
      return (
        <ActivityIndicator
          size='large'
          color='blue'
        />
      );
    }
    return (
      <View style={[styles.container, { justifyContent: 'space-around' }]}>
        <Text style={styles.subTitle}>{`Average gas price in ${this.state.displayArea}`}</Text>
        <Text style={styles.title}>{`$${this.state.result} / Gallon`}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.title}>Average Price</Text>
          <Text style={styles.instructions}>Average Price of Gas by state</Text>
          <Text style={styles.instructions}>{this.state.nationalAverage}</Text>
        </View>
        <View style={[styles.container, { flex: 4 }]}>
          <View style={[styles.container, { flex: 1, justifyContent: 'space-around' }]}>
            <RNPickerSelect
              items={states}
              placeholder={{ label: 'Select a state', value: null }}
              onValueChange={(value) => { this.setState({ area: value }); }}
            />
            <TouchableOpacity
              onPress={this.onPressGetPrice}
              style={{
                borderWidth: 1,
                borderRadius: 4,
                borderColor: '#999999',
                width: screenWidth / 2.5,
                height: 30,
                marginLeft: 5,
                marginRight: 10,
                padding: 2,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={styles.instructions}>Get Price</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.line} />

          <View style={[styles.container, { flex: 3 }]}>
            {this.renderResult()}
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
  },
  subTitle: {
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  line: {
    height: 0.5,
    width: screenWidth - 40,
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
    backgroundColor: '#333333',
  }
};

export default App;
