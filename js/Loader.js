import React from 'react';
import {View, ActivityIndicator, Image, Text} from 'react-native';

const Loader = () => (
    <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center'
        }}
    >
      <ActivityIndicator size={80} color={"#20b4ff"}  />
      <Text style={{ marginTop: 20, fontFamily: 'Roboto',fontSize:20, color:"#20b4ff"}}>Fetching Data...</Text>
    </View>
);

export default Loader;
