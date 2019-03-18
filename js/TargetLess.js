import React, { Component } from 'react';

import {StyleSheet} from 'react-native';

import {
    ViroARScene,
    ViroText,
    ViroConstants,
    ViroAmbientLight,
    Viro3DObject,
    ViroMaterials,
    ViroARPlaneSelector,
    ViroAnimatedImage,
    Viro360Image,
    ViroSpatialSound, ViroSound
} from 'react-viro';

export default class TargetLess extends Component {
    constructor() {
        super();

        // Set initial state here
        this.state = {
            textureBoy: "boy",
        };

    }

    render() {
        return (
            <ViroARScene>
                {/*<Viro3DObject*/}
                    {/*source={require("./res/boy/cartoonboy.obj")}*/}
                    {/*resources={[require("./res/boy/cartoonboy.mtl"),*/}
                    {/*]}*/}
                    {/*materials={this.state.textureBoy}*/}
                    {/*highAccuracyEvents={true}*/}
                    {/*position={[-.5, 0, -1]}*/}
                    {/*scale={[.01, .01, .01]}*/}
                    {/*rotation={[45, 0, 0]}*/}
                    {/*type="OBJ"*/}
                    {/*transformBehaviors={["billboard"]}/>*/}


                {/*<Viro360Image*/}
                    {/*source={require("./res/bgimage.jpg")}*/}
                    {/*rotation={[0, 45, 0]}*/}
                    {/*format="RGBA8"/>*/}

                <ViroAnimatedImage
                    height={1}
                    width={0.8}
                    position={[0,0,-1]}
                    source={require("./res/talkingman.gif")}
                />
                <ViroAnimatedImage
                    height={1}
                    width={0.5}
                    rotation={[0,-30,0]}
                    position={[0.8,0,-1]}
                    source={require("./res/manual.gif")}
                />
                <ViroSound
                source={require("./res/audio.mp3")}/>
            </ViroARScene>
        );
    }

}

ViroMaterials.createMaterials({
    boy: {
        lightingModel: "PBR",
        diffuseTexture: (require("./res/boy/cloths.jpg"))
    },
});
module.exports = TargetLess;