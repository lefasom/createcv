import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export const Formulario = () => {
  const [resumen, setResumen] = useState("");
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const seleccionarImagen = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setBase64Image(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const quitarImagen = () => {
    setBase64Image(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      
      {/* SECCIÓN DE FOTO CABECERA */}
      <View style={styles.headerPhotoContainer}>
        <View style={styles.imageBox}>
          {base64Image ? (
            <Image source={{ uri: base64Image }} style={styles.fullImg} />
          ) : (
            <Text style={styles.placeholderText}>FOTO</Text>
          )}
        </View>

        <View style={styles.photoActionRow}>
          <TouchableOpacity style={styles.btnSubir} onPress={seleccionarImagen}>
            <Ionicons name="cloud-upload" size={18} color="#4A90E2" />
            <Text style={styles.textSubir}>Subir Foto</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.btnQuitar} onPress={quitarImagen}>
            <Ionicons name="trash-outline" size={18} color="#666" />
            <Text style={styles.textQuitar}>Quitar Foto</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TÍTULO DE SECCIÓN */}
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="pencil" size={20} color="#4A90E2" />
        <Text style={styles.sectionTitle}>Información Personal</Text>
      </View>

      {/* CAMPOS DEL FORMULARIO */}
      <View style={styles.inputWrapper}>
        <View style={styles.labelRow}>
          <Ionicons name="person" size={18} color="#4A90E2" />
          <Text style={styles.label}>Nombre Completo</Text>
        </View>
        <TextInput style={styles.input} placeholder="Nombre completo" />

        <View style={styles.labelRow}>
          <Ionicons name="briefcase" size={18} color="#4A90E2" />
          <Text style={styles.label}>Título Profesional</Text>
        </View>
        <TextInput style={styles.input} placeholder="Ej: Administradora de Empresas" />

        <View style={styles.labelRow}>
          <MaterialCommunityIcons name="comment-text" size={18} color="#4A90E2" />
          <Text style={styles.label}>Resumen Profesional</Text>
        </View>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          multiline 
          numberOfLines={4}
          maxLength={500}
          onChangeText={setResumen}
          placeholder="Escribe un breve resumen de tu perfil..."
        />
        <Text style={styles.charCount}>{resumen.length} / 500</Text>

        <View style={styles.labelRow}>
          <Ionicons name="location" size={18} color="#4A90E2" />
          <Text style={styles.label}>Dirección</Text>
        </View>
        <TextInput style={styles.input} placeholder="San Martín 456, Buenos Aires, Argentina" />

        <View style={styles.labelRow}>
          <Ionicons name="call" size={18} color="#4A90E2" />
          <Text style={styles.label}>Teléfono</Text>
        </View>
        <TextInput style={styles.input} keyboardType="phone-pad" placeholder="+54 11 1234 5678" />

        <View style={styles.labelRow}>
          <Ionicons name="mail" size={18} color="#4A90E2" />
          <Text style={styles.label}>Correo Electrónico</Text>
        </View>
        <TextInput style={styles.input} keyboardType="email-address" placeholder="ejemplo@correo.com" />
      </View>

      <TouchableOpacity style={styles.btnSiguiente}>
        <Text style={styles.btnSiguienteText}>Siguiente</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerPhotoContainer: {
    backgroundColor: '#F2F6FF',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8F0FF'
  },
  imageBox: { 
    width: 90, 
    height: 90, 
    borderRadius: 45, 
    backgroundColor: '#E0E0E0', 
    marginBottom: 15, 
    overflow: 'hidden', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 3
  },
  fullImg: { width: '100%', height: '100%' },
  placeholderText: { color: '#999', fontWeight: 'bold', fontSize: 12 },
  photoActionRow: { flexDirection: 'row', gap: 10 },
  btnSubir: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A90E2',
    alignItems: 'center',
    gap: 5
  },
  textSubir: { color: '#4A90E2', fontWeight: 'bold', fontSize: 13 },
  btnQuitar: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    paddingVertical: 8, 
    paddingHorizontal: 15, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
    gap: 5
  },
  textQuitar: { color: '#666', fontSize: 13 },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  inputWrapper: { padding: 20 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 },
  label: { fontWeight: '600', color: '#444', fontSize: 14 },
  input: { 
    backgroundColor: '#F9F9F9', 
    padding: 12, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#EEE', 
    marginBottom: 18,
    fontSize: 15,
    color: '#333'
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  charCount: { textAlign: 'right', color: '#AAA', marginTop: -15, marginBottom: 15, fontSize: 11 },
  btnSiguiente: { 
    backgroundColor: '#4A90E2', 
    marginHorizontal: 20, 
    padding: 16, 
    borderRadius: 10, 
    alignItems: 'center',
    elevation: 2
  },
  btnSiguienteText: { color: '#fff', fontSize: 17, fontWeight: 'bold' }
});