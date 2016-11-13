import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    Image,
    Dimensions,
    PixelRatio,
    AsyncStorage,
    Platform,
    DeviceEventEmitter
} from 'react-native';

import ShoppingCarComponent from './ShoppingCarComponent';

const WIDTH = Dimensions.get('window').width;
const fruit = require('./fruit.json').fruit;

export default class FruitListComponent extends Component {

    constructor(props) {
        super(props);
        console.log('constructor');
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 != r2});
        this.state = {
            dataSource: ds.cloneWithRows(fruit),
            count: 0//用来记录目前购物中的商品数量
        };
    }

    componentWillMount() {

        console.log('componentWillMount');

        DeviceEventEmitter.addListener('clearStorage', (result)=> {
            if (result.isClearSuccess) {
                this._getAsyncStorageStatus();
            }
        });
    }

    componentDidUpdate() {
        console.log('componentDidUpdate');
    }

    componentDidUnMount() {
        console.log('componentDidUnMount');
    }

    componentDidMount() {

        console.log('componentDidMount');

        this._getAsyncStorageStatus();
    }

    componentWillUnMount() {
        console.log('componentWillUnMount');
    }

    _getAsyncStorageStatus() {
        AsyncStorage.getAllKeys((err, keys)=> {

            if (err) {
                //TODO 存储数据出错,给用户提示错误信息
            }

            this.setState({
                count: keys.length
            });
        });
    }

    render() {
        console.log('render');
        let count = this.state.count;
        let str = '';
        if (count) {
            str = ', 共' + count + '件商品';
        }
        return (
            <View style={{backgroundColor: 'white'}}>
                <View style={styles.headViewContainer}>
                    <Text style={styles.headTextStyle}>水果列表</Text>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow.bind(this)}
                    contentContainerStyle={styles.listViewContentStyle}
                />

                <TouchableOpacity style={styles.btnStyle}
                                  activeOpacity={0.5}
                                  onPress={()=>this._onPress()}
                >
                    <Text style={styles.btnTextStyle}>去结算{str}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    _onPress() {
        this.props.navigator.push({
            component: ShoppingCarComponent,
            title: '购物车'
        });
    }

    _renderRow(rowData) {
        return (
            <TouchableOpacity activeOpacity={0.5}
                              style={styles.itemContainer}
                              onPress={()=>this._addGoodsToShoppingCar(rowData)}>


                <Image source={{uri: rowData.url}}
                       style={styles.imageStyle}
                       resizeMode='contain'
                />
                <Text style={styles.textStyle}
                      numberOfLines={1}>
                    {rowData.title}
                </Text>

            </TouchableOpacity>
        );
    }

    _addGoodsToShoppingCar(rowData) {

        console.log(rowData);
        let count = this.state.count;
        count++;
        this.setState({
            count: count
        });

        //AsyncStorage存储
        AsyncStorage.setItem('SP-' + this._getId() + '-SP', JSON.stringify(rowData), (err)=> {

            if (err) {
                //TODO 存储出错
            }
        });
    }

    /**
     * 生成随机ID
     * @private
     */
    _getId() {
        return 'xxxxxxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c)=> {
            let r = Math.random() * 16 | 0;
            let v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }).toUpperCase();
    }
}

const styles = StyleSheet.create({
    headViewContainer: {
        height: Platform.OS == 'ios' ? 80 : 40,
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headTextStyle: {
        fontSize: 20,
        color: 'white',

    },
    listViewContentStyle: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    itemContainer: {
        width: 125,
        height: 120,
        marginLeft: (WIDTH - 125 * 2) / 3,
        marginTop: 20,
        alignItems: 'center',
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#e8e8e8',
        justifyContent: 'center'
    },
    textStyle: {
        fontSize: 12
    },
    imageStyle: {
        width: 110,
        height: 100,
        alignSelf: 'center'
    },
    btnStyle: {
        marginTop: 40,
        alignItems: 'center',
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#e8e8e8',
        marginLeft: 40,
        marginRight: 40,
        height: 60,
        backgroundColor: 'blue',
        borderRadius: 10,
        justifyContent: 'center',
    },
    btnTextStyle: {
        fontSize: 20,
        color: 'white'
    },
});