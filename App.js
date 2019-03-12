import React, { Component } from 'react';
import {Image} from 'react-native';
import {
  AppRegistry,
  Text,
  View,
  StyleSheet,
  PixelRatio,
  TouchableHighlight,
} from 'react-native';

import {
  ViroARSceneNavigator
} from 'react-viro';
import * as firebase from "react-native-firebase";


var sharedProps = {
  apiKey:"584284A4-EA24-4BB5-93E2-AD8FF10043FA",
}

var InitialARScene;

var UNSET = "UNSET";
var AR_NAVIGATOR_TYPE = "AR";

var defaultNavigatorType = UNSET;

export default class ViroSample extends Component {
  state = {
    initialized: false
  }

  constructor() {
    super();

    this.state = {
      navigatorType : defaultNavigatorType,
      sharedProps : sharedProps
    }
    this._getExperienceSelector = this._getExperienceSelector.bind(this);
    this._getARNavigator = this._getARNavigator.bind(this);
    this._navigate = this._navigate.bind(this);
  }

  componentDidMount(){
    const fData = firebase.database().ref();
    fData.on('value',snap => {

      let assets = snap.toJSON();

      Object.keys(assets).map((key, index) => {
        const myItem = assets[key];
        const data = Object.values( myItem );

        InitialARScene = require('./js/ARStudy')(data);

        console.log(data);

        this.setState({
          initialized: true
        })
      });
    })
  }

  render() {

    if (!this.state.initialized) return <View><Text>Loading</Text></View>

    if (this.state.navigatorType == UNSET) {
      return this._getExperienceSelector();
    } else if (this.state.navigatorType == AR_NAVIGATOR_TYPE) {
      return this._getARNavigator();
    }
  }

  _getExperienceSelector() {
    return (
        <View style={localStyles.outer} >
          <View style={localStyles.inner} >
            <View style={localStyles.screenImageContainer}>
            <Image
                style={localStyles.image}
                source={require('./assets/animalicon.jpg')}
            />
            </View>
            <Text style={localStyles.titleText}>
              Are you ready for education with AR?
            </Text>

            <TouchableHighlight style={localStyles.buttons}
              onPress={this._navigate(AR_NAVIGATOR_TYPE)}
              underlayColor={'#68a0ff'} >

              <Text style={localStyles.buttonText}>Let's GO!</Text>
            </TouchableHighlight>
          </View>
        </View>
    );
  }

  // Returns the ViroARSceneNavigator which will start the AR experience
  _getARNavigator() {
    return (
      <ViroARSceneNavigator {...this.state.sharedProps}
        initialScene={{scene: InitialARScene}} />
    );
  }

  // This function returns an anonymous/lambda function to be used
  // by the experience selector buttons
  _navigate(navigatorType) {
    return () => {
      this.setState({
        navigatorType : navigatorType
      })
    }
  }
}

var localStyles = StyleSheet.create({
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
  viroContainer :{
    flex : 1,
    backgroundColor: "black",
  },
  outer : {
    flex : 1,
    flexDirection: 'row',
    alignItems:'center',
    backgroundColor:'transparent'
  },
  inner: {
    flex : 1,
    flexDirection: 'column',
    alignItems:'center',
    backgroundColor: "transparent",
  },
  titleText: {
    fontFamily:'serif',
    paddingTop: 30,
    paddingBottom: 20,
    paddingLeft: 15,
    paddingRight:15,
    color:'#20b4ff',
    textAlign:'center',
    fontSize : 20
  },
  buttonText: {
    color:'#fff',
    textAlign:'center',
    fontSize : 20,
    fontFamily:'serif'
  },
  buttons : {
    height: 80,
    width: 150,
    paddingTop:20,
    paddingBottom:20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor:'#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f5f6f7',
  },
  exitButton : {
    height: 80,
    width: 150,
    paddingTop:20,
    paddingBottom:20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor:'#cf1408',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  }
});

module.exports = ViroSample
