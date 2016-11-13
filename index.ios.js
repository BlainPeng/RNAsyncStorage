/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator
} from 'react-native';

import FruitListComponent from './FruiteList';


export default class RNAsyncStorage extends Component {
    render() {
        return (
            <Navigator
                initialRoute={{component: FruitListComponent}}
                configureScene={this._configureScene}
                renderScene={this._renderScene}
            />
        );
    }

    _configureScene(route) {

        if (route.sceneConfig) {
            return route.sceneConfig;
        }
        return Navigator.SceneConfigs.PushFromRight;

    }

    _renderScene(route, navigator) {

        return <route.component
            navigator={navigator}
            {...route.passProps}
        />
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

AppRegistry.registerComponent('RNAsyncStorage', () => RNAsyncStorage);
