import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function SolicitationScreen() {
  const [consultas, setConsultas] = useState([]);

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const decoded = JSON.parse(atob(token.split('.')[1]));

        const response = await axios.get(`http://192.168.0.28:3000/api/consultas/${decoded.idPaciente}`, {
          headers: { Authorization: token }
        });

        setConsultas(response.data);
      } catch (error) {
        Alert.alert('Erro', 'Erro ao carregar consultas.');
      }
    };

    fetchConsultas();
  }, []);

const solicitarAlteracao = async (consulta) => {
  try {
    await axios.post('http://192.168.0.28:3000/api/solicitacoes', {
      idAgenda: consulta.IDAGENDA,
      tipo: 'ALTERACAO',
    });
    Alert.alert('Sucesso', 'Solicitação de alteração registrada.');
  } catch {
    Alert.alert('Erro', 'Erro ao solicitar alteração.');
  }
};

const solicitarCancelamento = async (consulta) => {
  try {
    await axios.post('http://localhost:3000/api/solicitacoes', {
      idAgenda: consulta.IDAGENDA,
      tipo: 'CANCELAMENTO',
    });
    Alert.alert('Sucesso', 'Solicitação de cancelamento registrada.');
  } catch {
    Alert.alert('Erro', 'Erro ao solicitar cancelamento.');
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solicitações</Text>
      <FlatList
        data={consultas}
        keyExtractor={(item) => item.IDAGENDA.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.label}>Data:</Text>
            <Text>{item.DATAABERT}</Text>
            <Text style={styles.label}>Profissional:</Text>
            <Text>{item.profissional}</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.buttonAlt} onPress={() => solicitarAlteracao(item)}>
                <Text style={styles.buttonText}>Alterar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonCancel} onPress={() => solicitarCancelamento(item)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
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
  card: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15
  },
  label: {
    fontWeight: 'bold'
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  buttonAlt: {
    backgroundColor: '#fbc02d',
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center'
  },
  buttonCancel: {
    backgroundColor: '#d32f2f',
    padding: 10,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});


