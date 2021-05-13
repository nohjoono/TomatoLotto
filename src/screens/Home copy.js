import React, { useRef, useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    Vibration,
    ScrollView,
    Dimensions,
} from 'react-native';
import { RNCamera } from 'react-native-camera'
import Carousel from 'react-native-snap-carousel';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import BarcodeMask from 'react-native-barcode-mask';
import LinearGradient from 'react-native-linear-gradient';
import { Card, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';


import { WebView } from 'react-native-webview';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

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
    const cardRef = useRef(null);


    //const [qrcode, setQrcode] = useState(undefined);
    const [resultArray, setResultArray] = useState([]);
    const [winInfo, setWinInfo] = useState([]);

    useEffect(() => {
        const changeNavStyle = async () => {
            try {
                //const response = await changeNavigationBarColor('transparent');
                const response = await changeNavigationBarColor('#ffffff');
                console.log('change nav', response)// {success: true}
            } catch (e) {
                console.log(e)// {success: false}
            }
        }
        changeNavStyle();
    }, [])

    // useEffect(() => {
    //     cardRef ? cardRef.current ? cardRef.current.snapToItem(cardRef.current.currentIndex + 1) : undefined : undefined;
    // }, [resultArray]);

    // renderCard = ({ item, index }) => {
    //     console.log(item.url)
    //     return (
    //         <Card>
    //             {
    //                 item.gamesData.map((u, i) => {
    //                     return (
    //                         <View key={i} style={{ height: 400 }}>
    //                             {/* <Text>{u.type} {u.numbers[0]} {u.numbers[1]} {u.numbers[2]} {u.numbers[3]} {u.numbers[4]} {u.numbers[5]}</Text> */}
    //                             <WebView source={{ uri: item.url }}
    //                                 style={{ marginTop: -120 }} />
    //                         </View>
    //                     );
    //                 })
    //             }
    //         </Card>
    //     );
    // }

    renderCard = ({ item, index }) => {
        return (
            <ScrollView style={{ height: 3 }}
                directionalLockEnabled={false}
                disableScrollViewPanResponder={true}
                nestedScrollEnabled={true}
            >
                <WebView source={{ uri: item.url }} style={{ marginTop: -124 }} />
            </ScrollView>
        );
    }


    function onBarCodeRead(result) {
        // console.log(result.data);

        //유효성 체크 
        let roundIndex = result.data.indexOf('?v=');
        if (roundIndex < 0) {
            //console.log('유효하지 않은 QRCODE');
            return;
        }


        let roundNumber = Number(result.data.substring(roundIndex + 3, roundIndex + 7));
        let trNumber = result.data.substr(-10, result.data.length)

        //중복체크
        if ((resultArray.find((item) => item.trNumber === trNumber))) {
            //console.log('중복된 QRCODE');
            return
        }

        Vibration.vibrate(100);

        let gamesString = result.data.substring(roundIndex + 7, roundIndex + 72)
        // console.log(gamesString);
        let gamesData = [];
        //getWinInfo(roundNumber);

        for (let i = 0; i < 5; i++) {
            let gameNumber = i;
            let type = gamesString.charAt(i * 13);
            let number1 = Number(gamesString.substr(i * 13 + 1, 2));
            let number2 = Number(gamesString.substr(i * 13 + 3, 2));
            let number3 = Number(gamesString.substr(i * 13 + 5, 2));
            let number4 = Number(gamesString.substr(i * 13 + 7, 2));
            let number5 = Number(gamesString.substr(i * 13 + 9, 2));
            let number6 = Number(gamesString.substr(i * 13 + 11, 2));
            let gameData = {
                'type': type,
                'numbers': [number1, number2, number3, number4, number5, number6]
            }
            gamesData.push(gameData);
            //console.log(gameData)
        };

        //목록에 저장
        setResultArray([...resultArray, { 'roundNumber': roundNumber, 'trNumber': trNumber, 'url': result.data, 'gamesData': gamesData }]);

        //최근항목으로 이동
        //setTimeout(() => cardRef.current.snapToItem(resultArray.length), 250)

    }

    async function getWinInfo(round) {
        try {
            let response = await fetch(`https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=${round}`);
            let data = await response.json();
            //console.log(data);
            setWinInfo(data)
        } catch (error) {
            console.error(error);
        }
    };



    return (
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
            {/* header */}
            <View style={styles.headerContainer}>
                <View>
                    {/* <Icon name='align-justify' color='#ffffff' light size={24} onPress={() => navigation.navigate('Manual')} /> */}
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Icon name='bolt' color='#ffffff' solid size={24} onPress={() => navigation.navigate('Manual')} style={{ marginRight: 32 }} />
                    <Icon name='cog' color='#ffffff' solid size={24} onPress={() => navigation.navigate('Setting')} />
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
            {/* bottom */}
            <View style={styles.bottomContainer}>
                {/* <Carousel //layout={"tinder"}
                    ref={cardRef}
                    data={resultArray}
                    renderItem={renderCard}
                    sliderWidth={Dimensions.get('screen').width}
                    itemWidth={Dimensions.get('screen').width}
                    firstItem={resultArray.length}
                /> */}
                <WebView source={{ uri:  }}  />
            </View>
        </RNCamera>
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
        //overflow: "hidden",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#ecf0f1',
        //backgroundColor: 'rgba(255, 255, 255, 0.5)'
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        //borderTopRightRadius: 24,
    },
});

export default Home;