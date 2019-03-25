import React, { Component } from 'react';
import { Image,Alert,
  NetInfo,
  TouchableOpacity,
  AppRegistry,
  Text,
  View,
  StyleSheet,
  PixelRatio,
  TouchableHighlight, } from 'react-native';

import {
  ViroARSceneNavigator
} from 'react-viro';
import * as firebase from "react-native-firebase";
import Loader from "./js/Loader";
import Guide from "./js/Guide";


var sharedProps = {
  apiKey:"584284A4-EA24-4BB5-93E2-AD8FF10043FA",
}

var InitialARScene;

var UNSET = "UNSET";
var AR_MAIN = "AR";
var AR_TARGET_LESS = "ART"

var defaultNavigatorType = UNSET;

export default class ViroSample extends Component {
  state = {
    initialized: false
  }


  CheckConnectivity = () => {
      NetInfo.isConnected.fetch().then(isConnected => {
        if (!isConnected) {
          Alert.alert("You are offline! \n Active internet connection required..");
        }
      });
  };

  handleFirstConnectivityChange = isConnected => {
    NetInfo.isConnected.removeEventListener(
        "connectionChange",
        this.handleFirstConnectivityChange
    );

    if (isConnected === false) {
      Alert.alert("You are offline!");
    }
  };

  constructor() {
    super();

    this.state = {
      navigatorType : defaultNavigatorType,
      sharedProps : sharedProps
    }
    this._getExperienceSelector = this._getExperienceSelector.bind(this);
    this._getARNavigator = this._getARNavigator.bind(this);
    this._navigate = this._navigate.bind(this);
    this.CheckConnectivity();
  }

  componentDidMount(){
    const fData = firebase.database().ref();
    fData.on('value',snap => {

      let assets = snap.toJSON();

      Object.keys(assets).map((key, index) => {
        const myItem = assets[key];
        const data = Object.values( myItem );

        InitialARScene = require('./js/ARStudy')(data);


        this.setState({
          initialized: true
        })
      });
    })
  }


    render() {

    if (!this.state.initialized) return <Loader/>

    if (this.state.navigatorType == UNSET) {
      return this._getExperienceSelector();
    } else if (this.state.navigatorType == AR_MAIN) {
      return this._getARNavigator();
    }else if (this.state.navigatorType == AR_TARGET_LESS) {
      InitialARScene = require('./js/Guide');
      return this.guide();
    }
  }

  _getExperienceSelector() {
    return (
          <View style={localStyles.mainContainer} >
            <Text style={localStyles.largeTitle}>AR STUDY</Text>
            <View style={localStyles.screenImageContainer}>
            <Image
                style={localStyles.image}
                source={{uri: 'https://firebasestorage.googleapis.com/v0/b/augmentedstudy.appspot.com/o/icon%2Fanimalicon.jpg?alt=media&token=2ac33808-9287-4c26-9a6c-982f75f529e7'}}
            />
            </View>
            <Text style={localStyles.titleText}>
              Are you ready for education with AR?
            </Text>

            <TouchableHighlight style={localStyles.buttons}
              onPress={this._navigate(AR_MAIN)}
              underlayColor={'#42b03f'} >

              <Text style={localStyles.buttonText}>Let's GO!</Text>
            </TouchableHighlight>


            <TouchableOpacity style={localStyles.buttons}
                                onPress={this._navigate(AR_TARGET_LESS)}
                                activeOpacity={0.8} >

              <Text style={localStyles.buttonText}>Guide</Text>
            </TouchableOpacity>
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

  guide(){
    return(
        <Guide/>
    );
  }

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
    borderRadius: 300,
    borderColor: '#20b4ff',
    borderWidth: 2,
    elevation: 5
  },
  viroContainer :{
    flex : 1,
    backgroundColor: "black",
  },
  mainContainer: {
    flex : 1,
    flexDirection: 'column',
    alignItems:'center',
    backgroundColor: "transparent",
    justifyContent: 'center'
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
  largeTitle: {
    fontFamily:'serif',
    paddingBottom: 20,
    paddingLeft: 15,
    paddingRight:15,
    marginBottom:20,
    color:'#20b4ff',
    textAlign:'center',
    fontSize : 40
  },
  buttonText: {
    color:'#fff',
    textAlign:'center',
    fontSize : 20,
    fontFamily:'serif'
  },
  buttons : {
    elevation:5,
    height: 80,
    width: 150,
    paddingTop:20,
    paddingBottom:20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor:'#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f5f6f7'
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
