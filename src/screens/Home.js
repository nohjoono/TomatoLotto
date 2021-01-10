import React, { useRef, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Vibration,
    Dimensions,
} from 'react-native';
import { RNCamera } from 'react-native-camera'
import Carousel from 'react-native-snap-carousel';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import BarcodeMask from 'react-native-barcode-mask';
import LinearGradient from 'react-native-linear-gradient';
import { Card, Icon, Button } from 'react-native-elements'



const CAM_VIEW_HEIGHT = Dimensions.get('screen').height;
const CAM_VIEW_WIDTH = Dimensions.get('screen').width;
console.log(CAM_VIEW_HEIGHT, CAM_VIEW_WIDTH)

const frameWidth = CAM_VIEW_WIDTH / 2;
const frameHeight = frameWidth;

const leftMargin = (CAM_VIEW_WIDTH - frameWidth) / 2;
const topMargin = 100;

console.log('frameWidth,frameHeight :', frameWidth, frameHeight);

const scanAreaX = topMargin / CAM_VIEW_HEIGHT;
const scanAreaY = leftMargin / CAM_VIEW_WIDTH;
const scanAreaWidth = frameHeight / CAM_VIEW_HEIGHT;
const scanAreaHeight = frameWidth / CAM_VIEW_WIDTH;
console.log('scanAreaX, scanAreaWidth, scanAreaY, scanAreaHeight', scanAreaX, scanAreaWidth, scanAreaY, scanAreaHeight);


function Home({ navigation }) {
    const cameraRef = useRef(null);
    const cardRef = useRef(null);

    //const [qrcode, setQrcode] = useState(undefined);
    const [resultArray, setResultArray] = useState([]);
    const [winInfo, setWinInfo] = useState([]);

    renderCard = ({ item, index }) => {
        return (
            <Card>
                <Card.Title>{item.roundNumber}</Card.Title>
                <Card.Divider />
                {
                    item.gamesData.map((u, i) => {
                        return (
                            <View key={i}>
                                <Text>{u.type} {u.numbers[0]} {u.numbers[1]} {u.numbers[2]} {u.numbers[3]} {u.numbers[4]} {u.numbers[5]}</Text>
                            </View>
                        );
                    })
                }
            </Card>
        );
    }


    function onBarCodeRead(result) {
        console.log(result.data);

        //유효성 체크 
        let roundIndex = result.data.indexOf('?v=');
        if (roundIndex < 0) {
            console.log('유효하지 않은 QRCODE');
            return;
        }


        let roundNumber = Number(result.data.substring(roundIndex + 3, roundIndex + 7));
        let trNumber = result.data.substr(-10, result.data.length)

        //중복체크
        if ((resultArray.find((item) => item.trNumber === trNumber))) {
            console.log('중복된 QRCODE');
            return
        }

        Vibration.vibrate(100);

        let gamesString = result.data.substring(roundIndex + 7, roundIndex + 72)
        // console.log(gamesString);
        let gamesData = [];
        getWinInfo(roundNumber);

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
        setResultArray([...resultArray, { 'roundNumber': roundNumber, 'trNumber': trNumber, 'gamesData': gamesData }]);
        //console.debug(cardRef);
        cardRef.current.snapToNext()


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

    console.log(resultArray.length)

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
                width: CAM_VIEW_WIDTH,
                height: CAM_VIEW_HEIGHT,
            }}
            style={{ height: CAM_VIEW_HEIGHT }}
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
                    <Icon reverse name='sc-telegram' type='evilicon' color='#517fa4' onPress={() => navigation.navigate('Manual')} />
                </View>
                <View >
                    <Button title="직접추가" onPress={() => navigation.navigate('Manual')} />
                </View>
            </View>

            {/* mask */}
            <View style={styles.maskContainer}>
                <BarcodeMask showAnimatedLine={false}
                    edgeColor={'white'}
                    edgeBorderWidth={2}
                    width={frameWidth}
                    height={frameHeight}
                    outerMaskOpacity={0.3}
                />
            </View>
            {/* bottom */}
            <View style={styles.bottomContainer}>
                <Carousel layout={"stack"}
                    ref={cardRef}
                    data={resultArray}
                    renderItem={renderCard}
                    sliderWidth={Dimensions.get('screen').width}
                    itemWidth={Dimensions.get('screen').width - 16}
                />
                <Button title='report' onPress={() => navigation.navigate('Manual')} />
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
        backgroundColor: '#ecf0f1',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        paddingTop: getStatusBarHeight() + 8,
        paddingHorizontal: 24,
        paddingBottom: 8,
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
        height: 300,
        //flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#ecf0f1'
        //backgroundColor: 'rgba(255, 255, 255, 0.5)'
    },
});

export default Home;