import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';


export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [sexo, setSexo] = useState('');
  const [uf, setUf] = useState('');



  const handleDateChange = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = cleaned;

    if (cleaned.length >= 3 && cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else if (cleaned.length >= 5) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }

    setDataNascimento(formatted);
  };

  const handleRegister = async () => {
    try {
      const [dia, mes, ano] = dataNascimento.split('/');
      const dataISO = `${ano}-${mes}-${dia}`;

      await axios.post('http://192.168.0.113:3000/api/pacientes', {
        nome,
        cpf,
        rg, 
        uf,
        dataNascimento: dataISO,
        email,
        senha,
        sexo,
      });


      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao cadastrar paciente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro de Paciente</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
      />

      <TextInput
      style={styles.input}
      placeholder="RG"
      value={rg}
      onChangeText={setRg}
      keyboardType="numeric"
    />

    <Text style={styles.label}>Estado de emissão (UF):</Text>
<View style={styles.pickerContainer}>
  <Picker
    selectedValue={uf}
    onValueChange={(itemValue) => setUf(itemValue)}
    style={styles.picker}
  >
      <Picker.Item label="Selecione o estado" value="" />

      <Picker.Item label="AC" value="AC" />
      <Picker.Item label="AL" value="AL" />
      <Picker.Item label="AP" value="AP" />
      <Picker.Item label="AM" value="AM" />
      <Picker.Item label="BA" value="BA" />
      <Picker.Item label="CE" value="CE" />
      <Picker.Item label="DF" value="DF" />
      <Picker.Item label="ES" value="ES" />
      <Picker.Item label="GO" value="GO" />
      <Picker.Item label="MA" value="MA" />
      <Picker.Item label="MT" value="MT" />
      <Picker.Item label="MS" value="MS" />
      <Picker.Item label="MG" value="MG" />
      <Picker.Item label="PA" value="PA" />
      <Picker.Item label="PB" value="PB" />
      <Picker.Item label="PR" value="PR" />
      <Picker.Item label="PE" value="PE" />
      <Picker.Item label="PI" value="PI" />
      <Picker.Item label="RJ" value="RJ" />
      <Picker.Item label="RN" value="RN" />
      <Picker.Item label="RS" value="RS" />
      <Picker.Item label="RO" value="RO" />
      <Picker.Item label="RR" value="RR" />
      <Picker.Item label="SC" value="SC" />
      <Picker.Item label="SP" value="SP" />
      <Picker.Item label="SE" value="SE" />
      <Picker.Item label="TO" value="TO" />
    </Picker>
  </View>


      <TextInput
        style={styles.input}
        placeholder="Data de Nascimento (DD/MM/AAAA)"
        value={dataNascimento}
        onChangeText={handleDateChange}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Text style={styles.label}>Sexo:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sexo}
            onValueChange={(itemValue) => setSexo(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione o sexo" value="" />
            <Picker.Item label="Masculino" value="M" />
            <Picker.Item label="Feminino" value="F" />
          </Picker>
        </View>


      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Já tem conta? Entrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#2e7d32',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    marginTop: 20,
    color: '#2e7d32',
  },
  label: {
  alignSelf: 'flex-start',
  marginBottom: 5,
  fontSize: 16,
},

pickerContainer: {
  width: '100%',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  marginBottom: 15,
},

picker: {
  height: 50,
  width: '100%',
},

pickerContainer: {
  width: '100%',
  paddingHorizontal: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  marginBottom: 15,
  justifyContent: 'center',
  height: 50,
},

picker: {
  width: '100%',
  height: '100%',
}

});
