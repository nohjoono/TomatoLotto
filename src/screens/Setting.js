import React from "react";
import {
    View,
    Text,
    Button,
} from 'react-native';
import { WebView } from 'react-native-webview';

function Manual({ navigation }) {
    return (
        <WebView source={{ uri: 'https://www.naver.com' }} />
    )
}

export default Manual;