import React, { Component } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback, Modal, Text, TouchableOpacity, TextInput, Platform, FlatList, Pressable } from 'react-native'
import { ListItem, Avatar, Button } from '@rneui/themed'

import Ionicons from 'react-native-vector-icons/Ionicons'

// Componente baseado em classe
export default class AddInstrucao extends Component {

    state = {
        descricao: ''
    }

    setDescricao = async (descricao) => {
        await this.setState({ descricao })
        this.props.funcao(descricao, this.props.indice)
      }

    componentDidMount() {
        this.setState({ descricao : this.props.valor })
    }

    render() {

        return (
        
            <View style={{justifyContent: 'center', paddingTop: 10, flexDirection: 'row'}}> 

                  <Text style={{fontSize: 20, fontWeight: 'bold'}}> #{this.props.cont+1} </Text>

                  <Pressable style={styleApp.inputNomeIngrediente} onPress={() => this.textInput.focus()}>

                        <TextInput 
                            ref={(input) => { this.textInput = input }}
                            placeholder="Insira a instrução aqui"
                            style={{fontSize: 16}}
                            value={this.state.descricao}
                            onChangeText={this.setDescricao}
                        />

                  </Pressable>

                  <TouchableOpacity style={{paddingTop: 10}}
                    onPress={() => this.props.deletar(this.props.indice)}>
                    <Ionicons name="trash" size={30} color={'black'} />
                </TouchableOpacity>

              </View>

        )
    }

}

const styleApp = StyleSheet.create({
    inputNomeIngrediente: {
        width: '70%' ,
        height: 70,
        backgroundColor: '#F5F5F5',
        borderRadius: 7,
        paddingHorizontal: 20,
        alignItems: 'center',
      },
})