import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function HomeScreen({ navigation }) {
  const [consultas, setConsultas] = useState([]);

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const pacienteId = JSON.parse(atob(token.split('.')[1])).idPaciente; // decodifica JWT

        const response = await axios.get(`http://192.168.0.28:3001/api/consultas/${pacienteId}`, {
          headers: { Authorization: token }
        });

        setConsultas(response.data);
      } catch (error) {
        Alert.alert('Erro', 'Erro ao carregar consultas.');
      }
    };

    fetchConsultas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas Consultas</Text>

      <FlatList
        data={consultas}
        keyExtractor={(item) => item.IDAGENDA.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.label}>Data:</Text>
            <Text>{item.DATAABERT}</Text>
            <Text style={styles.label}>Profissional:</Text>
            <Text>{item.profissional}</Text>
            <Text style={styles.label}>Procedimento:</Text>
            <Text>{item.DESCRPROC}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Calendar')}>
        <Text style={styles.buttonText}>Solicitar Novo Agendamento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15
  },
  label: {
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#2e7d32',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
