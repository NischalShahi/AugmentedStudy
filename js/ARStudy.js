'use strict';

import React, { Component } from 'react';

import {
    ViroARScene,
    ViroMaterials,
    ViroNode,
    ViroAnimations,
    Viro3DObject,
    ViroLightingEnvironment,
    ViroARImageMarker,
    ViroARTrackingTargets,
    ViroSphere,
    ViroSpotLight,
    ViroQuad,
} from 'react-viro';
import * as firebase from "react-native-firebase";

var createReactClass = require('create-react-class');


var ARStudy = createReactClass({
    // componentDidMount(){
    //     firebase.database().ref('Animal/').once('value', function (snapshot) {
    //         const db = snapshot.val();
    //
    //         const arr = Object.keys(db).map(key => {
    //             const value = db[key];
    //             value.id = key;
    //
    //             return value;
    //         });
    //
    //         console.log(arr)
    //     });
    // },

    getInitialState() {
        return {
            texture: "deer",
            textureGiraffe: "giraffe",
            playAnim: false,
            animateDeer: false,
            animateGiraffe: false
        }
    },

    render: function() {
        return (
            <ViroARScene>

                <ViroLightingEnvironment source={require('./res/tesla/ar.hdr')}/>

                <ViroARImageMarker target={"deer"} onAnchorFound={this._onAnchorFound} pauseUpdates={this.state.pauseUpdates}>
                    <ViroNode scale={[0, 0, 0]} transformBehaviors={["billboardY"]} animation={{name:this.state.animName, run:this.state.playAnim,}}>
                    </ViroNode>

                    <Viro3DObject
                        scale={[0,0,0]}
                        source={{uri: "https://firebasestorage.googleapis.com/v0/b/augmentedstudy.appspot.com/o/obj%2FDeer_o.obj?alt=media&token=248802fa-03c6-46a2-af0c-50897f971df7"}}
                        resources={[{uri: "https://firebasestorage.googleapis.com/v0/b/augmentedstudy.appspot.com/o/mtl%2FDeer_m.mtl?alt=media&token=ee465c8d-9a57-4c1e-9916-58a44e080135"},
                        ]}
                        type="OBJ"
                        materials={this.state.texture}
                        animation={{name:"scaleDeer", run:this.state.animateDeer,}} />

                    <ViroSpotLight
                        innerAngle={5}
                        outerAngle={25}
                        direction={[0,-1,0]}
                        position={[0, 5, 1]}
                        color="#ffffff"
                        castsShadow={true}
                        shadowMapSize={2048}
                        shadowNearZ={2}
                        shadowFarZ={7}
                        shadowOpacity={.7} />

                    <ViroQuad
                        rotation={[-90, 0, 0]}
                        position={[0, -0.001, 0]}
                        width={2.5} height={2.5}
                        arShadowReceiver={true} />

                </ViroARImageMarker>

                <ViroARImageMarker target={"giraffe"} onAnchorFound={this._onAnchorGiraffe} pauseUpdates={this.state.pauseUpdates}>
                    <ViroNode scale={[0, 0, 0]} transformBehaviors={["billboardY"]} animation={{name:this.state.animName, run:this.state.playAnim,}}>
                    </ViroNode>

                    <Viro3DObject
                        scale={[0,0,0]}
                        source={{uri:"https://firebasestorage.googleapis.com/v0/b/augmentedstudy.appspot.com/o/obj%2F10021_Giraffe_v04.obj?alt=media&token=f137167b-73ed-46e4-a2b2-1231d6d470b5"}}
                        resources={[{uri:"https://firebasestorage.googleapis.com/v0/b/augmentedstudy.appspot.com/o/mtl%2F10021_Giraffe_v04.mtl?alt=media&token=29444c30-e5ab-4eb4-91a1-2d1fbc0852b8"},
                        ]}
                        type="OBJ"
                        materials={this.state.textureGiraffe}
                        animation={{name:"scaleGiraffe", run:this.state.animateGiraffe,}} />

                    <ViroSpotLight
                        innerAngle={5}
                        outerAngle={25}
                        direction={[0,-1,0]}
                        position={[0, 5, 1]}
                        color="#ffffff"
                        castsShadow={true}
                        shadowMapSize={2048}
                        shadowNearZ={2}
                        shadowFarZ={7}
                        shadowOpacity={.7} />

                    <ViroQuad
                        rotation={[-90, 0, 0]}
                        position={[0, -0.001, 0]}
                        width={2.5} height={2.5}
                        arShadowReceiver={true} />

                </ViroARImageMarker>

            </ViroARScene>
        );
    },
    _onAnchorFound() {
        this.setState({
            animateDeer: true,
        })
    },

    _onAnchorGiraffe() {
        this.setState({
            animateGiraffe: true,
        })
    },
});

ViroMaterials.createMaterials({
    deer: {
        lightingModel: "PBR",
        diffuseTexture: ({uri: "https://firebasestorage.googleapis.com/v0/b/augmentedstudy.appspot.com/o/diffuse%2Fdeer_defuse.jpg?alt=media&token=ba064ede-82f0-4e49-9128-8989010d7778"})
    },
    giraffe: {
        lightingModel: "PBR",
        diffuseTexture: ({uri:"https://firebasestorage.googleapis.com/v0/b/augmentedstudy.appspot.com/o/diffuse%2F10021_Giraffe_v05.jpg?alt=media&token=f36bd8fe-90d6-4a3b-baf4-32e872695cda"}),
    },
});

ViroARTrackingTargets.createTargets({
    deer : {
        source : ({uri: "https://firebasestorage.googleapis.com/v0/b/augmentedstudy.appspot.com/o/targets%2Fdeer.jpg?alt=media&token=3b7f3847-4479-4ec8-9ef0-c75281411d82"}),
        orientation : "Up",
        physicalWidth : 0.065 // real world width in meters
    },
    giraffe : {
        source : ({uri:"https://firebasestorage.googleapis.com/v0/b/augmentedstudy.appspot.com/o/targets%2Fgiraffe.jpg?alt=media&token=9a11cd71-3a89-4a6b-8790-a51467ee94c4"}),
        orientation : "Up",
        physicalWidth : 0.065
    }
});

ViroAnimations.registerAnimations({
    scaleDeer:{properties:{scaleX:.3, scaleY:.3, scaleZ:.3, rotateX: "+=0"},
        duration: 500, easing: "bounce"},
    scaleGiraffe:{properties:{scaleX:.003, scaleY:.003, scaleZ:.003, rotateX: "-=50"},
        duration: 500, easing: "bounce"},
});

module.exports = ARStudy;