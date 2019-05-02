import React, { Component } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  UIManager,
  TextInput,
  Alert,
  LayoutAnimation,
  Image
} from 'react-native';
import Picker from 'react-native-picker';
import axios from 'axios';

import {
  currencies,
  fluids,
  colors,
  display,
  fxURL
} from '../assets/Constants';

class Home extends Component {
  constructor(props) {
    super(props);
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    this.animationOptions = {
      duration: 900,
      create: {
        duration: 250,
        type: 'easeInEaseOut',
        property: 'scaleY'
      },
      update: {
        type: 'spring',
        springDamping: 0.4
      },
      delete: {
        duration: 200,
        type: 'easeInEaseOut',
        property: 'scaleY'
      }
    };

    this.initialState = {
      display: 'from',
      fromFluid: 'Gallons',
      fromCurrency: 'USD',
      fromVal: '',
      toFluid: 'Litres',
      toCurrency: 'CAD',
      result: ''
    };
    this.state = this.initialState;
  }

  showPicker = (items, title, id) => {
    Picker.init({
      pickerTitleText: title,
      pickerData: items,
      selectedValue: [items[0] || ''],
      onPickerConfirm: data => { this.setState({ [id]: data }); },
      onPickerCancel: data => { console.log(data); },
      onPickerSelect: data => { console.log(data); }
    });
    Picker.show();
  }

  onPressSubmit = async () => {
    let { fromFluid, fromCurrency, fromVal, toFluid, toCurrency } = this.state;

    // Validate input data //
    const regex = /^[+]?(?:\d*\.)?\d+$/;
    let match = this.state.fromVal.match(regex);
    if (!fromFluid || !fromCurrency || !fromVal || !toFluid || !toCurrency || !match) {
      Alert.alert('Please correct selections', '', [{ text: 'OK', onPress: () => {} }]);
      return;
    }

    try {
      // Pull FX Rates //
      let { data } = await axios.get(`${fxURL}${this.state.fromCurrency}`);
      let convertTo = data.rates[this.state.toCurrency];
      //convert dollar amount to float then lower to 2 decimal
      let resultingCurrency = parseFloat(this.state.fromVal) * convertTo;

      let fluidDollarValue = null;
      if (fromFluid === toFluid) {
        fluidDollarValue = resultingCurrency;
      } else if (fromFluid === 'Gallons') {
        // From G to L
        fluidDollarValue = resultingCurrency / 3.785411784;
      } else {
        // From L to G //
        fluidDollarValue = resultingCurrency * 3.785411784;
      }

      this.setState({ result: fluidDollarValue.toFixed(2), showResultModal: true });
      Alert.alert(
        `${this.state.fromVal} ${this.state.fromCurrency} / ${this.state.fromFluid} Converts to:`,
        `${this.state.result} ${this.state.toCurrency} / ${this.state.toFluid}`,
        [{ text: 'OK', onPress: () => this.setState(this.initialState) }]
      );
    } catch (err) {
      Alert.alert('Error Fetching FOREX Data', 'Please try again', [{ text: 'OK', onPress: () => {} }]);
    }
  }

  renderOptions() {
    return (
      <View style={styles.content}>
        <View style={{ flex: 0, alignItems: 'center' }}>
          <Text style={styles.contentTitle}>
            From
          </Text>
          <TextInput
            style={[styles.button, styles.shadow, { flex: undefined }]}
            onChangeText={(text) => this.setState({ fromVal: String(text) })}
            value={this.state.fromVal}
            keyboardType='numeric'
            maxLength={5}
            placeholder='Price'
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => this.showPicker(currencies, 'Convert From', 'fromCurrency')}
              style={[styles.button, styles.shadow]}
            >
              <Text>
                {this.state.fromCurrency}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.showPicker(fluids, 'Convert From', 'fromFluid')}
              style={[styles.button, styles.shadow]}
            >
              <Text>
                {this.state.fromFluid || 'G / L'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 0, alignItems: 'center' }}>
          <Text style={styles.contentTitle}>
            To
          </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.showPicker(currencies, 'Convert To', 'toCurrency')}
            style={[styles.button, styles.shadow]}
          >
            <Text>
              {this.state.toCurrency || 'Currency'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.showPicker(fluids, 'Convert To', 'toFluid')}
            style={[styles.button, styles.shadow]}
          >
            <Text>
              {this.state.toFluid || 'Gallons | Litres'}
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.header, styles.shadow]}>
          <Text>Price Conversion</Text>
        </View>
        {this.renderOptions()}
        <View style={styles.buttonContainer}>

          <TouchableOpacity onPress={this.onPressSubmit} style={[styles.button, styles.shadow]}>
            <Text>
              Submit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.setState(this.initialState)}
            style={[styles.button, styles.shadow, { width: 60, borderRadius: 30, padding: 0, backgroundColor: colors.accent, flex: undefined }]}
          >
            <Image source={require('../assets/reset.png')} style={{ height: 40, width: 36 }} />
          </TouchableOpacity>

        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: display.width,
    height: 60,
    paddingHorizontal: '5%',
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    width: display.width,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  contentTitle: {
    fontSize: 18,
    color: colors.dark,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: display.width,
    height: 60,
    margin: 8,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: display.width * 0.95,
    flex: 1,
    height: 60,
    borderRadius: 15,
    backgroundColor: colors.white,
    color: colors.dark,
    margin: 10
  },
  shadow: {
    elevation: 5,
    shadowOpacity: 0.65,
    shadowColor: '#181818',
    shadowRadius: 5,
    shadowOffset: {
        height: 3,
        width: 1
    }
  },
};

export default Home;
