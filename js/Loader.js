import React, { Component } from 'react';

import {Image, StyleSheet, Text, View} from 'react-native';

export default class Loader extends Component {
  render() {
    return (
        <View style={styles.container}>
          <View style={styles.screenImageContainer}>
          <Text>Loading...</Text>
          </View>
        </View>

    );
  }

}

var styles = StyleSheet.create({
  container: {
    flex : 1,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: "center",
    backgroundColor:'transparent'
  },
  image:{
    width: 150,
    height: 120
  },
  screenImageContainer:{
    backgroundColor: 'white',
    width:"50%", height:"25%",
    alignItems:'center',
    justifyContent: "center",
    borderRadius: 300
  },
});

module.exports = Loader;
