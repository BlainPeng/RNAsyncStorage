
import React, {Component} from 'react';
import {
    View,
    Text,
    AsyncStorage,
    ScrollView,
    StyleSheet,
    Platform,
    Image,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';

export default class ShoppingCarComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            price: 0
        };
    }


    render() {
        let data = this.state.data;
        let price = this.state.price;
        let list = [];
        for (let i in data) {
            price += parseFloat(data[i].price);
            list.push(
                <View key={i}
                      style={[styles.row, styles.list_item]}>

                    <Text style={styles.list_item_desc}>
                        {data[i].title}
                        {data[i].desc}
                    </Text>

                    <Text style={styles.list_item_price}>
                        ¥{data[i].price}
                    </Text>
                </View>
            );
        }

        let str = null;
        if (price) {
            //toFixed方法可把 Number 四舍五入为指定小数位数的数字。(规定小数的位数，是 0 ~ 20 之间的值，包括 0 和 20)
            str = ', 共' + price.toFixed(1) + '元';
        }
        return (
            <View>
                <View style={styles.headViewContainer}>

                    <TouchableOpacity activeOpacity={0.5} onPress={()=> {

                        this.props.navigator.pop()

                    }}>
                        <Image
                            source={require('./image/abc_ic_ab_back_mtrl_am_alpha.png')}
                            style={styles.backArrowImageStyle}
                        />
                    </TouchableOpacity>

                    <View style={styles.headTextView}><Text style={styles.headTextStyle}>购物车</Text></View>

                </View>
                <ScrollView>
                    {list}
                    <Text style={styles.btn}>支付{str}</Text>
                    <Text style={styles.clear} onPress={()=>this._clearStorage()}>清空购物车</Text>
                </ScrollView>
            </View>
        );
    }

    _clearStorage() {
        AsyncStorage.clear((err)=> {

            //TODO err处理

            this.setState({
                data: [],
                price: 0
            }, ()=> {
                //发送消息
                DeviceEventEmitter.emit('clearStorage', {isClearSuccess: true});
            });

            alert('购物车已经清空');

        });
    }


    componentDidMount() {

        AsyncStorage.getAllKeys((err, keys)=> {

            if (err) {
                //TODO 存储出错
                return;
            }

            AsyncStorage.multiGet(keys, (err, result)=> {
                //TODO 错误处理
                let arr = [];
                for (let i in result) {
                    arr.push(JSON.parse(result[i][1]));
                }
                this.setState({
                    data: arr
                });
            });
        });

    }

}

const styles = StyleSheet.create({
    headViewContainer: {

        height: Platform.OS == 'ios' ? 80 : 40,
        backgroundColor: 'blue',
        flexDirection: 'row',
        alignItems: 'center'


    },
    headTextView: {
        flex: 1,
        justifyContent: 'center',


    },
    headTextStyle: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center'

    },
    backArrowView: {},
    backArrowImageStyle: {
        width: 30,
        height: 30,
        marginLeft: 10
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    list_item: {
        marginLeft: 5,
        marginRight: 5,
        padding: 5,
        borderWidth: 1,
        height: 30,
        borderRadius: 3,
        borderColor: '#ddd'
    },
    list_item_desc: {
        flex: 2,
        fontSize: 15
    },
    btn: {
        backgroundColor: 'blue',
        height: 33,
        textAlign: 'center',
        color: '#fff',
        marginLeft: 10,
        marginRight: 10,
        lineHeight: 24,
        marginTop: 40,
        fontSize: 18,
    },
    clear: {
        marginTop: 10,
        backgroundColor: 'blue',
        color: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        marginLeft: 10,
        marginRight: 10,
        lineHeight: 24,
        height: 33,
        fontSize: 18,
        textAlign: 'center',
    }
});

