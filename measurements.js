import {Dimensions, StyleSheet} from 'react-native';


var getMediumHairlineWidth = () => {
  return Math.ceil(StyleSheet.hairlineWidth * 4);
}

var getSmallBorderRadius = () => {
  return Math.ceil(StyleSheet.hairlineWidth * 5);
}

var getMediumBorderRadius = () => {
  return Math.ceil(StyleSheet.hairlineWidth * 20);
}

var getSmallBlockHeight = () => {
  return Dimensions.get("screen").height* .06;
}

var getMediumBlockHeight = () => {
  return Dimensions.get("screen").height* .085;
}

var getMediumFontSize = () => {
  return Dimensions.get("screen").height* .018;
}

var getLargeFontSize = () => {
  return Dimensions.get("screen").height* .025;
}

var getTitleFontSize = () => {
  return Dimensions.get("screen").width* .11;
}

module.exports = {
  getMediumHairlineWidth: getMediumHairlineWidth,
  getSmallBorderRadius: getSmallBorderRadius,
  getMediumBorderRadius: getMediumBorderRadius,
  getSmallBlockHeight: getSmallBlockHeight,
  getMediumBlockHeight: getMediumBlockHeight,
  getMediumFontSize: getMediumFontSize,
  getLargeFontSize: getLargeFontSize,
  getTitleFontSize: getTitleFontSize
};