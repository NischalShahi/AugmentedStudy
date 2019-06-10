import React from 'react'
import { StyleSheet, Platform, Image, Text, View } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Main from './Main';
import Loading from './screens/Loading';
import SignUp from './screens/SignUp';
import Login from './screens/Login';
import Ar from './js/ARStudy';
import Guide from './js/Guide';

const App = createStackNavigator(
    {
        // Loading: {
        //     screen: Loading
        // },
        Login: {
            screen: Login
        },
        SignUp: {
            screen: SignUp
        },
        Main: {
            screen: Main
        }
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#3c3c3c',
                elevation:1
            },
            headerTitle:"AR Study",
            headerTintColor:'white'
        }
    }
);

console.ignoredYellowBox = ['Warning: ']

export default createAppContainer(App);