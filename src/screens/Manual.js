import React from "react";
import {
    View,
    Text,
    Button,
} from 'react-native';

function Manual({ navigation }) {
    return (
        <View>
            <Text>Manual</Text>
            <Button
                title="Go to Home"
                onPress={() => navigation.navigate('Home')}
            />
        </View>
    )
}

export default Manual;