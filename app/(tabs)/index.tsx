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
  const cardWidth = isPC ? 400 : screenWidth * 0.9;
  const cardHeight = cardWidth / 1.58; 
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

  const generarPDF = async () => {
    setLoading(true);
    try {
      if (Platform.OS === 'web') {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        const pri = iframe.contentWindow;
        if (pri) {
          pri.document.open();
          pri.document.write(currentHtml);
          pri.document.close();
          setTimeout(() => {
            pri.focus();
            pri.print();
            document.body.removeChild(iframe);
          }, 500);
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
        <ScrollView style={{ flex: 1, backgroundColor: '#333' }}>
          <View style={styles.webPreviewContainer}>
            <div style={{ backgroundColor: 'white', width: '210mm', minHeight: '297mm', boxShadow: '0 0 25px rgba(0,0,0,0.5)' }}
              dangerouslySetInnerHTML={{ __html: currentHtml }} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panel de Control</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.imageBox} onPress={seleccionarImagen}>
          {base64Image ? <Image source={{ uri: base64Image }} style={styles.fullImg} /> : <Text style={{fontSize: 10}}>FOTO</Text>}
        </TouchableOpacity>

        <View style={{ width: '100%' }}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={isPC}
            snapToInterval={isPC ? undefined : cardWidth + spacing}
            decelerationRate="fast"
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
                  <div 
                    style={{ 
                      backgroundColor: 'white', width: '210mm', minHeight: '297mm',
                      transform: `scale(${(cardWidth - 20) / 793.7})`, 
                      transformOrigin: 'top left'
                    }}
                    dangerouslySetInnerHTML={{ __html: getCVHtml(cvData, base64Image, id) }} 
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
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 30, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 28, fontWeight: "bold", color: "#1a3a5a" },
  subtitle: { fontSize: 14, color: "#999", marginTop: 5 },
  scrollContainer: { paddingVertical: 20 },
  imageBox: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#dfe4ea', alignSelf: 'center', marginBottom: 30, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#1a3a5a' },
  fullImg: { width: '100%', height: '100%' },
  miniatureCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, borderWidth: 1, borderColor: '#e1e8ed', elevation: 4 },
  miniatureTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#2c3e50' },
  miniatureFrame: { overflow: 'hidden', backgroundColor: '#fff', borderRadius: 6 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15, backgroundColor: '#1a3a5a' },
  btnVolver: { color: "#fff", fontWeight: '600' },
  barTitle: { color: "#fff", fontWeight: 'bold' },
  badgePdf: { backgroundColor: '#27ae60', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  webPreviewContainer: { padding: 40, alignItems: 'center' }
});