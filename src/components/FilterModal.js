import React, { Component } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback, Modal, Text, TouchableOpacity, TextInput, Platform } from 'react-native'

/*import Icons from '@react-native-vector-icons/octicons';*/
import Ionicons from 'react-native-vector-icons/Ionicons'

const initialState = { desc: '', date: new Date(), showDatePicker: false }

// Componente baseado em classe
export default class AddTask extends Component {

    state = {
        ...initialState,
        isCheck: true
    }

    save = () => {

        const newTask = {
            desc: this.state.desc,
            date: this.state.date
        }

        this.props.onSave && this.props.onSave(newTask)
        this.setState({ ...initialState })

    }
    
    render() {
        return (
            <Modal transparent={true} visible={this.props.visible}
                onRequestClose={this.props.onRequestClose} >

                <TouchableWithoutFeedback 
                    onPress={this.props.onRequestClose}>
                    
                    <View style={styles.closeUp}> 
                    </View>

                </TouchableWithoutFeedback>

                <View style={styles.modal}>

                    <View style={styles.box}> 

                        <View style={styles.spaceBox}> 
                            <TouchableOpacity onPress={() => {
                                this.setState( { isCheck : true } )
                                this.props.funcOrdenacao('receitas.data desc')}
                            }>
                                <View style={{flexDirection: 'row', alignItems: 'center'}}> 
                                    <View style={{backgroundColor: 'white', borderRadius: 100}}>
                                        <Ionicons name={this.state.isCheck ? "checkmark-circle-outline" : "ellipse-outline"} 
                                            size={22} color='black' />
                                    </View>
                                    <Text style={styles.boxText}> Mais Recentes </Text>
                                </View>

                            </TouchableOpacity>
                        </View>

                        <View style={styles.spaceBox}> 
                            <TouchableOpacity onPress={() => {
                                this.setState( { isCheck : false } )
                                this.props.funcOrdenacao('receitas.nome')}
                            }>
                                <View style={{flexDirection: 'row'}}> 
                                    <View style={{backgroundColor: 'white', borderRadius: 100}}>
                                        <Ionicons name={this.state.isCheck ? "ellipse-outline" : "checkmark-circle-outline"} 
                                            size={22} color='black' />
                                    </View>
                                    <Text style={styles.boxText}> Ordem Alfabética </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>

                <TouchableWithoutFeedback 
                    onPress={this.props.onRequestClose}>
                    
                    <View style={styles.closeDown}> 
                    </View>

                </TouchableWithoutFeedback>

            </Modal>
        )
    }

}

const styles = StyleSheet.create({
    closeUp: {
        height: 140
    },
    closeDown: {
        flex: 1
    },
    modal: {
        alignItems: 'flex-end',
        paddingRight: 10,
    },
    box: {
        alignItems: 'flex-start',
        backgroundColor: '#ECA457',
        borderRadius: 10,
        padding: 5,
    },
    boxText: {
        color: 'white',
        fontSize: 16,
    },
    spaceBox: {
        padding: 5,
        flexDirection: 'row'
    }
})