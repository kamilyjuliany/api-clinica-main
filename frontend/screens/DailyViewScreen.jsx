import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function DailyViewScreen() {
  const [consultas, setConsultas] = useState([]);

  useEffect(() => {
    const fetchConsultasDoDia = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const hoje = new Date().toISOString().split('T')[0];

        const response = await axios.get(`http://192.168.0.28:3000/api/consultas/${decoded.idPaciente}`, {
          headers: { Authorization: token }
        });

        const consultasHoje = response.data.filter(c => c.DATAABERT.startsWith(hoje));
        setConsultas(consultasHoje);
      } catch (error) {
        Alert.alert('Erro', 'Erro ao carregar consultas do dia.');
      }
    };

    fetchConsultasDoDia();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consultas de Hoje</Text>
      {consultas.length === 0 ? (
        <Text style={styles.noData}>Nenhuma consulta marcada para hoje.</Text>
      ) : (
        <FlatList
          data={consultas}
          keyExtractor={(item) => item.IDAGENDA.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.label}>Profissional:</Text>
              <Text>{item.profissional}</Text>
              <Text style={styles.label}>Procedimento:</Text>
              <Text>{item.DESCRPROC}</Text>
              <Text style={styles.label}>Data/Hora:</Text>
              <Text>{item.DATAABERT}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },
  noData: {
    fontSize: 16,
    color: '#999'
  },
  card: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15
  },
  label: {
    fontWeight: 'bold'
  }
});
