import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import * as ImagePicker from 'expo-image-picker';
import * as Print from "expo-print";
import { getCVHtml } from "./CVTemplate";

export default function Index() {
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState(1);
  const [ruta, setRuta] = useState("panel");
  const [loading, setLoading] = useState(false);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const isPC = screenWidth > 800;
  const cardWidth = isPC ? 350 : screenWidth * 0.85;
  const cardHeight = cardWidth * 1.41; // Proporción A4
  const spacing = 20;

  const cvData = {
    nombre: "Leonardo Fabian Sombra",
    cargo: "Ingeniero en Sistemas de Información",
    email: "leonardo.sombra.dev@gmail.com",
    tel: "+54 299 412 9384",
    loc: "Neuquén, Argentina",
    resumen: "Ingeniero de Software Senior con enfoque en arquitectura escalable y optimización de sistemas críticos.",
    experiencia: [
      { puesto: "Senior Engineer", empresa: "TechSolutions", periodo: "2020-2024" },
      { puesto: "Full Stack Dev", empresa: "DevFactory", periodo: "2017-2020" }
    ],
    habilidades: ["React Native", "Unity", "C#", "Node.js"]
  };

  const currentHtml = getCVHtml(cvData, base64Image, templateId);

  const seleccionarImagen = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("Permisos necesarios", "Se requiere acceso a la galería.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled) {
      setBase64Image(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const generarPDF = async () => {
    setLoading(true);
    try {
      if (Platform.OS === 'web') {
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(currentHtml);
          win.document.close();
          win.print();
        }
      } else {
        await Print.printAsync({ html: currentHtml });
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo generar el documento.");
    } finally {
      setLoading(false);
    }
  };

  // Componente de Previsualización para Web (Vercel)
  const HTMLPreview = ({ html, scale = 1 }: { html: string, scale?: number }) => {
    if (Platform.OS !== 'web') return null;
    return (
      <div 
        style={{ 
          backgroundColor: 'white', 
          width: '210mm', 
          minHeight: '297mm',
          transform: `scale(${scale})`, 
          transformOrigin: 'top left',
          boxShadow: scale === 1 ? '0 0 20px rgba(0,0,0,0.2)' : 'none'
        }}
        dangerouslySetInnerHTML={{ __html: html }} 
      />
    );
  };

  if (ruta === "diseno") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setRuta("panel")}><Text style={styles.btnVolver}>← Volver</Text></TouchableOpacity>
          <Text style={styles.barTitle}>Previsualización</Text>
          <TouchableOpacity onPress={generarPDF} style={styles.badgePdf} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>DESCARGAR PDF</Text>}
          </TouchableOpacity>
        </View>
        <ScrollView style={{ flex: 1, backgroundColor: '#525659' }}>
          <View style={styles.webPreviewContainer}>
            <HTMLPreview html={currentHtml} scale={isPC ? 1 : screenWidth / 850} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CV Builder</Text>
        <Text style={styles.subtitle}>Selecciona una plantilla para comenzar</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.imageBox} onPress={seleccionarImagen}>
          {base64Image ? (
            <Image source={{ uri: base64Image }} style={styles.fullImg} />
          ) : (
            <Text style={{fontSize: 12, color: '#1a3a5a', fontWeight: 'bold'}}>SUBIR FOTO</Text>
          )}
        </TouchableOpacity>

        <View style={{ width: '100%' }}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 25, gap: spacing, paddingBottom: 40 }}
          >
            {[1, 2, 3, 4].map((id) => (
              <TouchableOpacity 
                key={id} 
                style={[styles.miniatureCard, { width: cardWidth }]} 
                onPress={() => { setTemplateId(id); setRuta("diseno"); }}
              >
                <Text style={styles.miniatureTitle}>Plantilla #{id}</Text>
                <View style={[styles.miniatureFrame, { height: cardHeight }]}>
                  <HTMLPreview 
                    html={getCVHtml(cvData, base64Image, id)} 
                    scale={(cardWidth - 30) / 793.7} 
                  />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f7f9" },
  safeArea: { flex: 1, backgroundColor: "#1a3a5a" },
  header: { padding: 30, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 28, fontWeight: "bold", color: "#1a3a5a" },
  subtitle: { fontSize: 14, color: "#999", marginTop: 5 },
  scrollContainer: { paddingVertical: 20 },
  imageBox: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#fff', alignSelf: 'center', marginBottom: 30, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#1a3a5a', elevation: 5 },
  fullImg: { width: '100%', height: '100%' },
  miniatureCard: { backgroundColor: '#fff', borderRadius: 15, padding: 15, borderWidth: 1, borderColor: '#e1e8ed', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  miniatureTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#1a3a5a' },
  miniatureFrame: { overflow: 'hidden', backgroundColor: '#f9f9f9', borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, backgroundColor: '#1a3a5a' },
  btnVolver: { color: "#fff", fontWeight: '600', fontSize: 16 },
  barTitle: { color: "#fff", fontWeight: 'bold', fontSize: 18 },
  badgePdf: { backgroundColor: '#27ae60', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  webPreviewContainer: { padding: 40, alignItems: 'center', minHeight: '100%' }
});