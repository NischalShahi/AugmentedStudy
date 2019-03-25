import React from 'react';

import {
    ViroARScene,
    ViroMaterials,
    ViroNode,
    ViroAnimations,
    Viro3DObject,
    ViroLightingEnvironment,
    ViroARImageMarker,
    ViroARTrackingTargets,
    ViroSpotLight,
    ViroQuad, ViroSpinner, ViroAnimatedImage, ViroSound, ViroButton,
} from 'react-viro';



module.exports = (data) => {
    // const fData = firebase.database().ref();


    // const data = [
    //     {
    //         diffuse: "https://firebasestorage.googleapis.com/v0/b/augmentedstudy.appspot.com/o/diffuse%2F10021_Giraffe_v05.jpg?alt=media&token=f36bd8fe-90d6-4a3b-baf4-32e872695cda",
    //         mtl: "https://firebasestorage.googleapis.com/v0/b/augmentedstudy.appspot.com/o/mtl%2F10021_Giraffe_v04.mtl?alt=media&token=29444c30-e5ab-4eb4-91a1-2d1fbc0852b8",
    //         obj: "https://firebasestorage.googleapis.com/v0/b/augmentedstudy.appspot.com/o/obj%2F10021_Giraffe_v04.obj?alt=media&token=f137167b-73ed-46e4-a2b2-1231d6d470b5",
    //         rotateX: "-=75",
    //         scaleX:.03,
    //         scaleY:.03,
    //         scaleZ:.03,
    //         name: 'giraffe',
    //         targetUri: "https://firebasestorage.googleapis.com/v0/b/augmentedstudy.appspot.com/o/targets%2Fgiraffe.jpg?alt=media&token=9a11cd71-3a89-4a6b-8790-a51467ee94c4",
    //     },
    //     {
    //         diffuse: 'https://firebasestorage.googleapis.com/v0/b/augmentedstudy.appspot.com/o/diffuse%2Fdeer_defuse.jpg?alt=media&token=ba064ede-82f0-4e49-9128-8989010d7778',
    //         mtl: "https://firebasestorage.googleapis.com/v0/b/augmentedstudy.appspot.com/o/mtl%2FDeer_m.mtl?alt=media&token=ee465c8d-9a57-4c1e-9916-58a44e080135",
    //         obj: "https://firebasestorage.googleapis.com/v0/b/augmentedstudy.appspot.com/o/obj%2FDeer_o.obj?alt=media&token=248802fa-03c6-46a2-af0c-50897f971df7",
    //         rotateX: "+=0",
    //         scaleX:.3,
    //         scaleY:.3,
    //         scaleZ:.3,
    //         name: 'deer',
    //         targetUri: "https://firebasestorage.googleapis.com/v0/b/augmentedstudy.appspot.com/o/targets%2Fdeer.jpg?alt=media&token=3b7f3847-4479-4ec8-9ef0-c75281411d82",
    //     }
    // ]


    class ARStudy extends React.PureComponent   {
        state = {
            playAnim: false,
            animate:{},
            clicked: false
            // data:[]
        };

        render(){

            return <ViroARScene>

                <ViroLightingEnvironment source={{uri:"https://firebasestorage.googleapis.com/v0/b/augmentedstudy.appspot.com/o/LightningEnvironment%2Far.hdr?alt=media&token=8d05c4a1-da90-455d-a3ba-37793a91f6e1"}}/>




                {
                    data.map(obj => <ViroARImageMarker key={obj.name} target={obj.name} onAnchorFound={()=>{
                        {
                            this.setState({
                                animate: {
                                    ...this.state.animate,
                                    [[obj.key]]: true
                                }
                            })
                        }
                    }} pauseUpdates={this.state.pauseUpdates}>
                        <ViroNode scale={[0, 0, 0]} transformBehaviors={["billboardY"]} animation={{name:this.state.animName, run:this.state.playAnim,}}>
                        </ViroNode>

                        <Viro3DObject
                            scale={[0,0,0]}
                            source={{uri: obj.obj}} //.obj
                            resources={[{uri: obj.mtl}, //.mtl
                            ]}
                            type="OBJ"
                            onClick={this._onClick}
                            materials={obj.name}
                            animation={{name:`scale${obj.name}`, run:!this.state.animate[obj.name],}} />

                        {this.state.clicked === true && <ViroSound onFinish={this._onFinish} source={{uri: obj.sound}}/>}


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

                    </ViroARImageMarker>)
                }

            </ViroARScene>
        }
        _onClick = (source) => {
            this.setState({clicked: true})
        };
        _onFinish = (source) => {
            this.setState({clicked: false})
        }
    }


    let materialMap = {};
    let targetMap = {};
    let animationMap = {};


    data.forEach(item => {
        materialMap[item.name]= {
            lightingModel: "PBR",
            diffuseTexture: ({uri:item.diffuse}),
        };



        targetMap[item.name]= {
            source : ({uri: item.targetUri}),
            orientation : "Up",
            physicalWidth : 0.065
        };


        animationMap[`scale${item.name}`]= {properties:{scaleX:item.scaleX, scaleY:item.scaleY, scaleZ:item.scaleZ, rotateX:item.rotateX},
            duration: 500, easing: "bounce"}
    });

    ViroARTrackingTargets.createTargets(targetMap);
    ViroMaterials.createMaterials(materialMap);
    ViroAnimations.registerAnimations(animationMap);

    return ARStudy;

}

