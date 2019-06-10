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
import firebase from 'react-native-firebase'
import OfflineNotice from "./components/OfflineNotice";

export default class SignUp extends React.Component {
    state = { email: '', password: '', errorMessage: null, confirmPassword:'', confirmMessage:null, loading:false };

    static navigationOptions = {
        headerLeft: null
    };

    constructor() {
        super();
        this.ref = firebase.firestore().collection('users');
        this.state = {
            userName: '',
        };
    }


    componentDidMount() {
            this.state.loading && this.setState({loading: false});
    }

    handleSignUp = () => {
        this.setState({loading: true});
        this.state.confirmMessage && this.setState({confirmMessage:null});
        this.state.errorMessage && this.setState({errorMessage:null});

        if(this.state.email && this.state.password && this.state.confirmPassword && this.state.userName) {

            if(this.state.password.length >= 6) {
                    if(this.state.password === this.state.confirmPassword){
                        firebase
                            .auth()
                            .createUserWithEmailAndPassword(this.state.email.trimRight(), this.state.password)
                            .then(() => {

                                const { currentUser } = firebase.auth();
                                this.setState({ currentUser });

                                this.ref.add({
                                    userId: this.state.currentUser.uid,
                                    userName: this.state.userName,
                                }).then(() => {
                                    this.setState({userName:''});
                                    this.props.navigation.navigate('Main')
                                }).catch(error => {
                                    this.setState({errorMessage: "Something went wrong, Please try again later."})
                                })
                            })
                            .catch(error => {
                                if (error.toString() === "Error: The email address is already in use by another account."){
                                    this.setState({errorMessage: "User already exists."});
                                    this.setState({loading: false});
                                }
                                else {
                                    this.setState({errorMessage: "Invalid Email. Please Enter valid email."});
                                    this.setState({loading: false});
                                }
                            } )
                    }
                    else{
                        this.setState({confirmMessage: "Passwords do not match"});
                        this.setState({loading: false});
                    }
                }
            else{

                this.setState({confirmMessage: "Password must be at least 6 characters long."});
                this.setState({loading: false});
            }
        }
        else{
            this.setState({errorMessage: "Please Don't leave any fields blank"});
            this.setState({loading: false});
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

                <Text style={styles.title}>Sign Up</Text>

                {this.state.errorMessage &&
                <Text style={{ color: 'red', margin: 5 }}>
                    {this.state.errorMessage}
                </Text>}

                <TextInput
                    underlineColorAndroid='transparent'
                    placeholder="Display Name"
                    style={styles.textInput}
                    onChangeText={userName => this.setState({ userName })}
                    value={this.state.userName}
                />
                <TextInput
                    underlineColorAndroid='transparent'
                    placeholder="Email"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={email => this.setState({ email })}
                    value={this.state.email}
                />
                <TextInput
                    underlineColorAndroid='transparent'
                    secureTextEntry
                    placeholder="Password"
                    autoCapitalize="none"
                    style={styles.textInput}
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                />
                    {this.state.confirmMessage &&
                    <Text style={{ color: 'red', margin: 5 }}>
                        {this.state.confirmMessage}
                    </Text>}

                    <TextInput
                        underlineColorAndroid='transparent'
                        secureTextEntry
                        placeholder="Confirm Password"
                        autoCapitalize="none"
                        style={styles.textInput}
                        onChangeText={confirmPassword => this.setState({ confirmPassword })}
                        value={this.state.confirmPassword}
                    />

                <View style={{ marginTop: 20}}>
                    <View style={{ marginBottom: 20 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{ ...styles.button, backgroundColor:'#3c3c3c' }}
                            onPress={this.handleSignUp}
                            disabled={this.state.loading}
                        >
                            {this.state.loading && <ActivityIndicator size={'small'} color={'white'}/>}
                            {!this.state.loading && <Text style={{ color:'white', fontSize: 14, fontWeight: 'bold'}}>
                                Sign Up
                            </Text>}
                        </TouchableOpacity>
                    </View>
                    <View style={{ paddingBottom: 10}}>
                        <Text style={{ marginBottom: 5 }}>Already Have an Account?</Text>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.button}
                            onPress={() => this.props.navigation.navigate('Login')}
                        >
                            <Text style={{ color:'white', fontSize: 14, fontWeight: 'bold'}}>
                                Login
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
    textInput: {
        height: 40,
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10,
        borderRadius: 5
    },
    button:{
        padding: 10,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: '#13a2ff',
        borderWidth:1,
        borderColor:'transparent',
        elevation: 1,
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
