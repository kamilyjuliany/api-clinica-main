import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CalendarScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [especialidades, setEspecialidades] = useState([]);
  const [procedimentos, setProcedimentos] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState(null);
  const [procedimentoSelecionado, setProcedimentoSelecionado] = useState(null);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null);

  useEffect(() => {
  const fetchDados = async () => {
    try {
      const especRes = await axios.get('http://160.20.22.99:5050/api/especialidades');
      setEspecialidades(especRes.data);
    } catch (error) {
      console.error('[ERRO] Falha ao buscar especialidades:', error.message);
      Alert.alert('Erro', 'Erro ao carregar especialidades.');
    }

    try {
      let procRes;
      if (especialidadeSelecionada) {
        procRes = await axios.get(`http://160.20.22.99:5050/api/procedimentos/${especialidadeSelecionada}`);
        if (procRes.data.length === 0) {
          setProcedimentos([]);
          Alert.alert('Aviso', 'Nenhum procedimento cadastrado para essa especialidade.');
          return; 
        }
        setProcedimentos(procRes.data);
      } else {
        setProcedimentos([]);
      }
    } catch (error) {
      console.error('[ERRO] Falha ao buscar procedimentos:', error.message);
      Alert.alert('Erro', 'Erro ao carregar procedimentos.');
    }

    try {
      let profRes;
      if (especialidadeSelecionada) {
        profRes = await axios.get(`http://160.20.22.99:5050/api/profissionais/${especialidadeSelecionada}`);
        if (profRes.data.length === 0) {
          setProfissionais([]);
          Alert.alert('Aviso', 'Nenhum profissional cadastrado para essa especialidade.');
          return; 
        }
        setProfissionais(profRes.data);
      } else {
        setProfissionais([]);
      }
    } catch (error) {
      console.error('[ERRO] Falha ao buscar profissionais:', error.message);
      Alert.alert('Erro', 'Erro ao carregar profissionais.');
    }

  };

  fetchDados();
}, [especialidadeSelecionada]);


  const handleAgendamento = async () => {
    if (!selectedDate || !procedimentoSelecionado || !profissionalSelecionado) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const pacienteCpf = await AsyncStorage.getItem('pacienteCpf');
      const pacienteDados = await axios.get(`http://160.20.22.99:5050/api/pacientes/${pacienteCpf}`);
      const dateTimeAgendamento = `${selectedDate} ${selectedTime.getHours().toString().padStart(2,'0')}:${selectedTime.getMinutes().toString().padStart(2,'0')}:00`;

      await axios.post('http://160.20.22.99:5050/api/consultas', {
        idPessoaFis: Number(pacienteDados.data.id),
        idProfissional: profissionalSelecionado,
        idProcedimento: procedimentoSelecionado,
        data: dateTimeAgendamento
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
        minDate={new Date()}
      />
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.button}>
        <Text style={styles.buttonText}>
          {selectedTime ? `${selectedTime.getHours().toString().padStart(2,'0')}:${selectedTime.getMinutes().toString().padStart(2,'0')}` : 'Selecione um horário'}
        </Text>
      </TouchableOpacity>
            
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowTimePicker(false);
            if (selectedDate) {
              setSelectedTime(selectedDate);
            }
          }}
        />
      )}


      <Text style={styles.title}>Especialidade:</Text>
      <Picker
        selectedValue={especialidadeSelecionada}
        onValueChange={(itemValue) => setEspecialidadeSelecionada(itemValue)}>
        <Picker.Item label="Selecione" value={null} />
        {especialidades.map((e) => (
          <Picker.Item key={e.IDESPEC} label={e.DESCESPEC} value={e.IDESPEC} />
        ))}
      </Picker>

      <Text style={styles.title}>Procedimento:</Text>
      <Picker
        selectedValue={procedimentoSelecionado}
        onValueChange={(itemValue) => setProcedimentoSelecionado(itemValue)}>
        <Picker.Item label="Selecione" value={null} />
        {procedimentos.map((p) => (
          <Picker.Item key={p.ID_PROCED} label={p.DESCRPROC} value={p.ID_PROCED} />
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
