import React, { Component } from 'react';
import {
    ActivityIndicator,
    Image,
    Text,
    View,
    StyleSheet,
    Dimensions,
    StatusBar,
    Platform,
} from 'react-native';
import SideSwipe from 'react-native-sideswipe';

import { Manual } from './components';

const { width } = Dimensions.get('window');

const manual = [
    { title: 'Step1', value: 'step1'},
    { title: 'Step2', value: 'step2'},
    { title: 'Step3', value: 'step3'},
    { title: 'Step4', value: 'step4'},
    { title: 'Step6', value: 'step6'},
    { title: 'Step7', value: 'step7'},
];

export default class Guide extends Component {
    state = {
        currentIndex: 0,
        fontsLoaded: true
    };

    render = () => {
        const offset = (width - Manual.WIDTH) / 2;

        return !this.state.fontsLoaded
            ? <View style={[styles.container, { justifyContent: 'center' }]}>
                <ActivityIndicator color="white" />
            </View>
            : <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <Image
                    resizeMode="contain"
                    style={styles.fill}
                    source={require('./assets/space-bg.jpg')}
                />
                <SideSwipe
                    data={manual}
                    shouldCapture={() => true}
                    style={[styles.fill, { width }]}
                    contentContainerStyle={{  paddingTop: 50 }}
                    itemWidth={Manual.WIDTH}
                    threshold={Manual.WIDTH / 4}
                    extractKey={item => item.value}
                    contentOffset={offset}
                    onIndexChange={index =>
                        this.setState(() => ({ currentIndex: index }))}
                    renderItem={({ itemIndex, currentIndex, item, animatedValue }) => (
                        <Manual
                            manual={item}
                            index={itemIndex}
                            currentIndex={currentIndex}
                            animatedValue={animatedValue}
                        />
                    )}
                />
                <Text style={[styles.title, styles.titlePlatformSpecific]}>
                    USER MANUAL
                </Text>
            </View>;
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        backgroundColor: 'black',
    },
    fill: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    title: {
        fontSize: 32,
        color: 'white',
        backgroundColor: 'transparent',
        textAlign: 'center',
        marginTop: 10,
        letterSpacing: 1.6,
        zIndex: 2,
        alignSelf: 'center'
    },
    titlePlatformSpecific: Platform.select({
        ios: {
            marginBottom: 10,
        },
    }),
});
