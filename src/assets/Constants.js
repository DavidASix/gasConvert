//both get
import { Dimensions } from 'react-native';

export const fxURL2 = 'http://data.fixer.io/api/latest?access_key=cf11a654cb63c1dfca6e0b53831a9e4e';
export const fxURL = 'http://api.openrates.io/latest?base=';

export const averageURL = 'https://gasprices.aaa.com/?state=';//two digit state code ie WY (wyoming)

export const display = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
};

export const colors = {
  accent: '#F84464',
  dark: '#2f2f2f',
  light: '#E0E5E9',
  white: '#F9F9F9'
};

export const currencies = ['USD', 'CAD', 'GBP', 'MXN', 'CNY', 'AUD', 'EUR'];

export const fluids = ['Gallons', 'Litres'];
