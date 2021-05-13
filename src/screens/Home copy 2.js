import React, { useRef, useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Vibration,
    Text,
    Dimensions,
} from 'react-native';
import { RNCamera } from 'react-native-camera'
import Carousel from 'react-native-snap-carousel';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import BarcodeMask from 'react-native-barcode-mask';
import { Card, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { WebView } from 'react-native-webview';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';


const SCREEN_HEIGHT = Dimensions.get('screen').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const STATUSBAR_HEIGHT = getStatusBarHeight();
const NAVBAR_HEIGHT = SCREEN_HEIGHT - STATUSBAR_HEIGHT - WINDOW_HEIGHT;

const frameWidth = SCREEN_WIDTH / 2;
const frameHeight = frameWidth;
const leftMargin = (SCREEN_WIDTH - frameWidth) / 2;
const topMargin = 160;

const scanAreaX = topMargin / SCREEN_HEIGHT;
const scanAreaY = leftMargin / SCREEN_WIDTH;
const scanAreaWidth = frameHeight / SCREEN_HEIGHT;
const scanAreaHeight = frameWidth / SCREEN_WIDTH;

console.log('SCREEN_HEIGHT, SCREEN_WIDTH :\n', SCREEN_HEIGHT, SCREEN_WIDTH);
console.log('STATUSBAR_HEIGHT, WINDOW_HEIGHT, WINDOW_WIDTH, NAV_HEIGHT :\n', STATUSBAR_HEIGHT, WINDOW_HEIGHT, WINDOW_WIDTH, NAVBAR_HEIGHT);
console.log('frameWidth, frameHeight :\n', frameWidth, frameHeight);
console.log('scanAreaX, scanAreaWidth, scanAreaY, scanAreaHeight :\n', scanAreaX, scanAreaWidth, scanAreaY, scanAreaHeight);


function Home({ navigation }) {
    const cameraRef = useRef(null);
    const sheetRef = useRef(null);

    const [url, setUrl] = useState(null);

    useEffect(() => {
        const changeNavStyle = async () => {
            try {
                const response = await changeNavigationBarColor('transparent');
                //const response = await changeNavigationBarColor('#FFFFFF');
            } catch (e) {
                console.log(e)// {success: false}
            }
        }
        changeNavStyle();
    }, [])


    function onBarCodeRead(result) {
        console.log(result.data);

        //유효성 체크 
        let roundIndex = result.data.indexOf('?v=');
        if (roundIndex < 0) {
            setUrl(null);
            return;
        }

        //중복체크
        if (result.data === url) { return; }


        Vibration.vibrate(200);
        setUrl(result.data);
    }

    const renderContent = () => (
        <View
            style={{
                backgroundColor: 'white',
                padding: 16,
                height: 450,
            }}
        >
            <Text>Swipe down to close</Text>
        </View>
    );


    return (
        <>
            <RNCamera
                ref={cameraRef}
                rectOfInterest={{
                    x: scanAreaX,
                    y: scanAreaY,
                    width: scanAreaWidth,
                    height: scanAreaHeight,
                }}
                cameraViewDimensions={{
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT,
                }}
                style={{ height: SCREEN_HEIGHT }}
                captureAudio={false}
                type={RNCamera.Constants.Type.back}
                flashMode={RNCamera.Constants.FlashMode.off}
                barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                onBarCodeRead={onBarCodeRead}
                onFaceDetected={null}
                androidCameraPermissionOptions={{
                    title: "Permission to use camera",
                    message: "Camera is required for barcode scanning",
                    buttonPositive: "OK",
                    buttonNegative: "Cancel"
                }}
            >
                {/* header menu */}
                <View style={styles.headerContainer}>
                    <View>
                        {/* <Icon name='align-justify' color='#ffffff' light size={24} onPress={() => navigation.navigate('Manual')} /> */}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon name='bolt' color='#ffffff' solid size={24} onPress={() => navigation.navigate('Manual')} style={{ marginRight: 32 }} />
                        <Icon name='cog' color='#ffffff' solid size={24} onPress={() => sheetRef.current.snapTo(100)} />
                    </View>
                </View>

                {/* mask */}
                <View style={styles.maskContainer}>
                    <BarcodeMask showAnimatedLine={false}
                        edgeColor={'white'}
                        edgeBorderWidth={2}
                        width={frameWidth}
                        height={frameHeight}
                        outerMaskOpacity={0}
                    />
                </View>

                {/* result */}
                {/* <View style={styles.bottomContainer}>
                {url ?
                    <WebView source={{ uri: url }} style={{ marginTop: -124 }} />
                    : undefined
                }
            </View> */}
            </RNCamera>
            <BottomSheet
                ref={sheetRef}
                snapPoints={[450, 300, 0]}
                borderRadius={10}
                renderContent={renderContent}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        //height: 80,
        //backgroundColor: '#ecf0f1',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        marginTop: getStatusBarHeight(),
        paddingVertical: 32,
        paddingHorizontal: 32,
        //marginHorizontal: 16,
        //padding: 16,
    },
    maskContainer: {
        flex: 1,
        //marginHorizontal: 16,
        // borderLeftColor: 'white',
        // borderLeftWidth: 24,
        // borderRightColor: 'white',
        // borderRightWidth: 24,
    },
    bottomContainer: {
        height: 500,
        //marginHorizontal: 24,
        //marginBottom: NAVBAR_HEIGHT,
        overflow: "hidden",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        //backgroundColor: '#ecf0f1',
        //backgroundColor: 'rgba(255, 255, 255, 0.5)'
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        //borderTopRightRadius: 24,
    },
});

export default Home;