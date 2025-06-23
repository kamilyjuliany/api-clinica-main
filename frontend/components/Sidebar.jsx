import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Sidebar({ navigation }) {
  const [nome, setNome] = useState('Paciente');

  useEffect(() => {
    const fetchNome = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setNome(decoded.nome);
      } catch {
        setNome('Paciente');
      }
    };
    fetchNome();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Text style={styles.title}>Olá, {nome}</Text>

      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.linkText}>Agendamentos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Calendar')}>
        <Text style={styles.linkText}>Solicitar Consulta</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('DailyView')}>
        <Text style={styles.linkText}>Visualização Diária</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#2e7d32'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30
  },
  link: {
    marginBottom: 20
  },
  linkText: {
    color: '#fff',
    fontSize: 16
  },
  logout: {
    marginTop: 'auto',
    paddingVertical: 15,
    paddingBottom: 60
  },
  logoutText: {
    color: '#ffcccb',
    fontSize: 16
  }
});
