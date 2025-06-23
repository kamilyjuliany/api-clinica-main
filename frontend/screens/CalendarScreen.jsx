import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';


export default function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [procedimentos, setProcedimentos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState(null);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const procRes = await axios.get('http://192.168.0.28:3000/api/procedimentos');
        const profRes = await axios.get('http://192.168.0.28:3000/api/profissionais');

        setProcedimentos(procRes.data);
        setProfissionais(profRes.data);
      } catch (error) {
        Alert.alert('Erro', 'Erro ao carregar profissionais e procedimentos.');
      }
    };
    fetchDados();
  }, []);

  const handleAgendamento = async () => {
    if (!selectedDate || !procedimentoSelecionado || !profissionalSelecionado) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const decoded = JSON.parse(atob(token.split('.')[1]));

      await axios.post('http://localhost:3000/api/consultas', {
        idPaciente: decoded.idPaciente,
        idProfissional: profissionalSelecionado,
        idProcedimento: procedimentoSelecionado,
        data: selectedDate
      }, {
        headers: { Authorization: token }
      });

      Alert.alert('Sucesso', 'Consulta agendada!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao agendar consulta.');
    }
  };

    return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha uma data:</Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#2e7d32' }
        }}
      />

      <Text style={styles.title}>Procedimento:</Text>
      <Picker
        selectedValue={procedimentoSelecionado}
        onValueChange={(itemValue) => setProcedimentoSelecionado(itemValue)}>
        <Picker.Item label="Selecione" value={null} />
        {procedimentos.map(p => (
          <Picker.Item key={p.IDPROCED} label={p.DESCRPROC} value={p.IDPROCED} />
        ))}
      </Picker>

      <Text style={styles.title}>Profissional:</Text>
      <Picker
        selectedValue={profissionalSelecionado}
        onValueChange={(itemValue) => setProfissionalSelecionado(itemValue)}>
        <Picker.Item label="Selecione" value={null} />
        {profissionais.map(p => (
          <Picker.Item key={p.IDPROFISSIO} label={p.NOMEPESSOA} value={p.IDPROFISSIO} />
        ))}
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleAgendamento}>
        <Text style={styles.buttonText}>Confirmar Agendamento</Text>
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
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10
  },
  button: {
    backgroundColor: '#2e7d32',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
