import React, { Component } from 'react';
import {
  Image, Alert,
  NetInfo,
  TouchableOpacity,
  Text,
  View,
  TouchableHighlight,
  Linking,
  BackHandler,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  ViroARSceneNavigator
} from 'react-viro';
import * as firebase from "react-native-firebase";
import Loader from "./js/Loader";
import Guide from "./js/Guide";
import OfflineNotice from "./screens/components/OfflineNotice";
import {AccessToken, LoginManager} from "react-native-fbsdk";


var sharedProps = {
  apiKey:"584284A4-EA24-4BB5-93E2-AD8FF10043FA",
}

var InitialARScene;

var UNSET = "UNSET";
var AR_MAIN = "AR";
var GUIDE = "GUIDE";

var defaultNavigatorType = UNSET;


export default class ViroSample extends Component {
  state = {
    initialized: false,
    currentUser: null,
    userName: ''
  };


  static navigationOptions = {
    header: null,
  };

  signOutUser = async () => {
    try {
      await firebase.auth().signOut();
    } catch (e) {
      console.log(e);
    }
  };

  openLink = () => {
    Linking.openURL('https://firebasestorage.googleapis.com/v0/b/augmentedstudy.appspot.com/o/targets.rar?alt=media&token=22750c26-2aa7-470b-955d-4163668342cb')
  };

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

    var docRef = firebase.firestore().collection("users")
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {

            const { currentUser } = firebase.auth();
            this.setState({ currentUser });

            if (doc && doc.exists && doc.data().userId === this.state.currentUser.uid ) {
              this.setState({userName: doc.data().userName});
            }
          });
        });

    this.state = {
      navigatorType : defaultNavigatorType,
      sharedProps : sharedProps
    }
    this._getExperienceSelector = this._getExperienceSelector.bind(this);
    this._getARNavigator = this._getARNavigator.bind(this);
    this._navigate = this._navigate.bind(this);
    this.CheckConnectivity();
  }


  onBackButtonPressAndroid = () => {
    this.setState({
      navigatorType: UNSET
    });
    return true;
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
  }

  componentDidMount(){

    const { currentUser } = firebase.auth();

    this.setState({ currentUser });


    this.setState({userName: currentUser._user.displayName});

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

      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)

    })
  }


    render() {

    if (!this.state.initialized) return <Loader/>;

    if (this.state.navigatorType == UNSET) {
      return this._getExperienceSelector();
    } else if (this.state.navigatorType == AR_MAIN) {
      return this._getARNavigator();
    }else if (this.state.navigatorType == GUIDE) {
      return this.guide();
    }
  }

  _getExperienceSelector() {
    return (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 0.07 }}>
            <View
              style={{
                height: 57,
                width:'100%',
                elevation: 2,
                borderBottomColor:'transparent',
                borderBottomWidth:1,
                backgroundColor:'#3c3c3c',
                alignItems:'flex-start',
                justifyContent:'space-between',
                padding: 10,
                flexDirection:'row',
                position:'absolute',
                top: 0
              }}>
            <View style={{
              padding:10,
              alignItems:'center',
              justifyContent:'flex-end',
              flexDirection:'row',
            }}
            >
              <Icon color={'white'} size={22} name={'account-circle'}/>
              <Text style={{
                color:'white',
                fontSize: 14,
                marginLeft: 5
              }}>
                {this.state.userName && this.state.userName}
              </Text>
            </View>
            <TouchableOpacity style={ localStyles.logOutButton }
                              onPress={this.signOutUser}
                              activeOpacity={0.8} >

              <Icon color={'white'} size={20} name={'exit-to-app'} />

              <Text style={{
                ...localStyles.buttonText,
                fontSize : 14,
                marginRight: 5,
                color:'white'}}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
          </View>
          <View style={{ flex:0.04 }}>
            <OfflineNotice />
          </View>
          <View style={{ flex: 0.9 }}>
            <ScrollView style={{ flex:1 }}>
                <View style={localStyles.mainContainer} >
                  <View style={{ flex:0.04, backgroundColor:'red' }}>
                    <OfflineNotice />
                  </View>
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
                                    onPress={this._navigate(GUIDE)}
                                    activeOpacity={0.8} >

                    <Text style={localStyles.buttonText}>Guide</Text>
                  </TouchableOpacity>

                  <Text style={{ color: '#0018ff',textDecorationLine: 'underline', marginTop:20, paddingBottom: 10 }} onPress={() => this.openLink()}  >Download scannable Images</Text>

                </View>
        </ScrollView>
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

var localStyles = {
  image:{
    width: 130,
    height: 100
  },
  screenImageContainer:{
    backgroundColor: 'white',
    width:185,
    height:190,
    alignItems:'center',
    justifyContent: "center",
    borderRadius: 300,
    borderColor: '#20b4ff',
    borderWidth: 2,
    elevation: 5,
    margin:10
  },
  viroContainer :{
    flex : 1,
    backgroundColor: "black",
  },
  mainContainer: {
    flex : 1,
    flexDirection: 'column',
    alignItems:'center',
    backgroundColor: "white",
    justifyContent: 'center',
    paddingTop: 5
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
    marginTop: 10,
    marginBottom: 10,
    backgroundColor:'#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f5f6f7',
    alignItems:'center',
    justifyContent:'center'
  },
  logOutButton : {
    flexDirection:'row-reverse',
    elevation:5,
    height: 40,
    alignItems:'center',
    justifyContent:'flex-start',
    padding: 5
  }
};

module.exports = ViroSample
