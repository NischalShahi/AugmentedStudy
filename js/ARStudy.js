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

var createReactClass = require('create-react-class');


var ARStudy = createReactClass({
    getInitialState() {
        return {
            texture: "deer",
            textureCat: "cat",
            playAnim: false,
            animateDeer: false,
            animateCat: false
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
                        source={require('./res/tesla/Deer_o.obj')}
                        resources={[require('./res/tesla/Deer_m.mtl'),
                        ]}
                        type="OBJ"
                        materials={this.state.texture}
                        onClick={this._toggleButtons}
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

                <ViroARImageMarker target={"cat"} onAnchorFound={this._onAnchorCat} pauseUpdates={this.state.pauseUpdates}>
                    <ViroNode scale={[0, 0, 0]} transformBehaviors={["billboardY"]} animation={{name:this.state.animName, run:this.state.playAnim,}}>
                    </ViroNode>

                    <Viro3DObject
                        scale={[0,0,0]}
                        source={require('./res/cat/cat_o.obj')}
                        resources={[require('./res/cat/cat_m.mtl'),
                        ]}
                        type="OBJ"
                        materials={this.state.textureCat}
                        animation={{name:"scaleCat", run:this.state.animateCat,}} />

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

    _onAnchorCat() {
        this.setState({
            animateCat: true,
        })
    },
    _toggleButtons() {
        this.setState({
            animName: (this.state.animName == "scaleUp" ? "scaleDown" : "scaleUp"),
            playAnim: true
        })
    },
});

ViroMaterials.createMaterials({
    deer: {
        lightingModel: "PBR",
        diffuseTexture: require('./res/tesla/Diffuse.jpg'),
        metalnessTexture: require('./res/tesla/Specular.png'),
        roughnessTexture: require('./res/tesla/Glossiness.png'),
    },
    cat: {
        lightingModel: "PBR",
        diffuseTexture: require('./res/cat/catDiffuse.jpg'),
        metalnessTexture: require('./res/tesla/Specular.png'),
        roughnessTexture: require('./res/tesla/Glossiness.png'),
    },
});

ViroARTrackingTargets.createTargets({
    deer : {
        source : require('./res/d2a.jpg'),
        orientation : "Up",
        physicalWidth : 0.065 // real world width in meters
    },
    cat : {
        source : require('./res/cat/catimage.png'),
        orientation : "Up",
        physicalWidth : 0.065
    }
});

ViroAnimations.registerAnimations({
    scaleUp:{properties:{scaleX:1, scaleY:1, scaleZ:1,},
        duration: 500, easing: "bounce"},
    scaleDown:{properties:{scaleX:0, scaleY:0, scaleZ:0,},
        duration: 200,},
    scaleDeer:{properties:{scaleX:.3, scaleY:.3, scaleZ:.3},
        duration: 500, easing: "bounce"},
    scaleCat:{properties:{scaleX:.01, scaleY:.01, scaleZ:.01, rotateX: "+=270"},
        duration: 500, easing: "bounce"},
});

module.exports = ARStudy;