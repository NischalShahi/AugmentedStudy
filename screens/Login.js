import React from 'react'
import {
    Text,
    TextInput,
    View,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native'
import OfflineNotice from './components/OfflineNotice';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase'

export async function facebookLogin() {
    try {
        console.log('here');
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

        if (result.isCancelled) {
            // handle this however suites the flow of your app
            throw new Error('User cancelled request');
        }

        console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`);

        // get the access token
        const data = await AccessToken.getCurrentAccessToken();


        if (!data) {
            // handle this however suites the flow of your app
            throw new Error('Something went wrong obtaining the users access token');
        }

        // create a new firebase credential with the token
        const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

        // login with credential
        const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);

        //console.log('this',JSON.stringify(firebaseUserCredential.user.displayName))
    } catch (e) {
        console.error(e);
    }

}

export default class Login extends React.Component {

    state = { email: '', password: '', errorMessage: null, loading:false };

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            this.props.navigation.navigate(user ? 'Main' : 'Login')
            this.state.loading && this.setState({loading: false});
        });
    }

    static navigationOptions = {
        headerLeft: null
    };


    handleLogin = () => {
        const { email, password, errorMessage } = this.state;
        this.setState({loading: true});

        if(this.state.email && this.state.password){
            errorMessage && this.setState({errorMessage:null});
            firebase
                .auth()
                .signInWithEmailAndPassword(email.trimRight(), password)
                .then(() => this.props.navigation.navigate('Main'))
                .catch(error => {
                    this.setState({ errorMessage: "Invalid email or password" });
                    this.setState({loading: false});
                })
        }
        else{
            this.setState({loading: false});
            this.setState({errorMessage: 'Please enter your email and password!' })
        }
    };
    render() {
        return (
            <KeyboardAvoidingView
                style = {{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : null}
            >
            <ScrollView>
                <OfflineNotice />
                <View style={styles.container}>

                <Text style={styles.title}>
                    AR STUDY
                </Text>
                <View style={styles.imageContainer}>
                    <Image
                        style={{
                            width: 130,
                            height: 100
                        }}
                        source={{uri: 'https://firebasestorage.googleapis.com/v0/b/augmentedstudy.appspot.com/o/icon%2Fanimalicon.jpg?alt=media&token=2ac33808-9287-4c26-9a6c-982f75f529e7'}}
                    />
                </View>

                <Text style={styles.title}>Login</Text>
                {this.state.errorMessage &&
                <Text style={{ color: 'red', margin: 5 }}>
                    {this.state.errorMessage}
                </Text>}
                <TextInput
                    underlineColorAndroid='transparent'
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Email"
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />
                <TextInput
                    underlineColorAndroid='transparent'
                    secureTextEntry
                    style={styles.textInput}
                    autoCapitalize="none"
                    placeholder="Password"
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />
                <View style={{ marginTop: 20}}>
                    <View style={{ marginBottom: 10 }}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.button}
                            onPress={this.handleLogin}
                            disabled={this.state.loading}
                        >
                            {this.state.loading && <ActivityIndicator size={'small'} color={'white'}/>}
                            {!this.state.loading && <Text style={{ color:'white', fontSize: 14, fontWeight: 'bold' }}>
                                Login
                            </Text>}
                        </TouchableOpacity>
                    </View>
                    <View style={{ paddingBottom: 10}}>
                        <Text style={{ marginBottom: 5 }}>Don't have an Account?</Text>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{ ...styles.button, backgroundColor:'#3c3c3c' }}
                            onPress={() => this.props.navigation.navigate('SignUp')}
                        >
                            <Text style={{ color:'white', fontSize: 14, fontWeight: 'bold'}}>
                                Sign Up
                            </Text>
                        </TouchableOpacity>

                        <Text style={{ marginTop: 20, textAlign: 'center', color: "#306CAC" }}> Try alternative login. </Text>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{ ...styles.button, backgroundColor:'#306CAC', borderRadius: 10, marginTop: 5 }}
                            onPress={facebookLogin}
                        >
                            <Text style={{ color:'white', fontSize: 14, fontWeight: 'bold'}}>
                                Facebook
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}
const styles = {
    container: {
        flex:1,
        alignItems: 'center',
        paddingTop: 5
    },
    button:{
    flexDirection:'row',
    padding: 10,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: '#13a2ff',
    borderWidth:1,
    borderColor:'transparent',
    elevation: 1,
    borderRadius: 5
    },
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10,
        borderRadius: 5
    },
    title:{
        fontFamily:'serif',
        paddingTop: 30,
        paddingBottom: 20,
        paddingLeft: 15,
        paddingRight:15,
        color:'#20b4ff',
        textAlign:'center',
        fontSize : 20
    },
    imageContainer:{
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
    }
};