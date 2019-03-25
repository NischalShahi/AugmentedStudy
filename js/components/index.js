import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';

import images from '../images';

const { width: screenWidth } = Dimensions.get('window');
const width = screenWidth - 125;

export class Manual extends Component {
  static WIDTH = width;

  render = () => {
    const { animatedValue, manual, index } = this.props;

    return (
      <Animated.View style={styles.container}>
        <Animated.Image
          style={[
            styles.manual,
            {
              transform: [
                {
                  scale: animatedValue.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [1, 1.6, 1],
                    extrapolate: 'clamp',
                  }),
                },
                {
                  rotate: animatedValue.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: ['0deg', '0deg', '0deg'],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
          source={images[manual.value]}
        />
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: animatedValue.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [0, 1, 0],
              }),
              transform: [
                {
                  translateY: animatedValue.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [-30, 0, -30],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}>
          {/*{manual.value}*/}
        </Animated.Text>
      </Animated.View>
    );
  };
}


const styles = StyleSheet.create({
  container: {
    width: width,
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  manual: Platform.select({
    ios: {
      width: width - 25,
      height: width + 125,
    },
    android: {
      width: width - 50,
      height: width + 180,
    },
  }),
  title: Platform.select({
    ios: {
      fontFamily: 'dhurjati',
      fontSize: 32,
      position: 'absolute',
      bottom: 0,
      textAlign: 'center',
      fontWeight: 'bold',
      letterSpacing: 1.2,
      color: 'white',
      backgroundColor: 'transparent',
    },
    android: {
      fontFamily: 'inconsolata-regular',
      fontSize: 24,
      position: 'absolute',
      bottom: 20,
      textAlign: 'center',
      fontWeight: 'bold',
      letterSpacing: 1.2,
      color: 'white',
      backgroundColor: 'transparent',
    }
  })
});
