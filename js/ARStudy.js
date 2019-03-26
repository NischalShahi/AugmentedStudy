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


    class ARStudy extends React.PureComponent   {
        state = {
            playAnim: false,
            animate:{},
            clicked: {}
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
                            onClick={this._onClick(obj.name)}
                            materials={obj.name}
                            animation={{name:`scale${obj.name}`, run:!this.state.animate[obj.name],}} />

                        {this.state.clicked[obj.name] === true && <ViroSound onFinish={this._onFinish} source={{uri: obj.sound}}/>}


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
        _onClick = (name) => (source) => {
            this.setState({clicked: {
                [[name]]: true
                }})
        };
        _onFinish = (source) => {
            this.setState({clicked: {}})
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

