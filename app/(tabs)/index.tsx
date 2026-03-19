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
import { WebView } from 'react-native-webview';
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

  // Proporciones A4 en píxeles (aprox 794px de ancho para 210mm)
  const A4_WIDTH_PX = 793.7;
  const scaleFactor = (screenWidth - 40) / A4_WIDTH_PX;

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

  // Inyectamos CSS adicional para forzar el ajuste visual en la previsualización
  const previewHtml = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; background: #333; }
          .scale-container { 
            transform: scale(${scaleFactor}); 
            transform-origin: top center; 
            width: 210mm; 
          }
        </style>
      </head>
      <body>
        <div class="scale-container">${currentHtml}</div>
      </body>
    </html>
  `;

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
      await Print.printAsync({ html: currentHtml });
    } catch (err) {
      Alert.alert("Error", "No se pudo generar el PDF");
    } finally {
      setLoading(false);
    }
  };

  if (ruta === "diseno") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setRuta("panel")}>
            <Text style={styles.btnVolver}>← Volver</Text>
          </TouchableOpacity>
          <Text style={styles.barTitle}>Vista PDF A4</Text>
          <TouchableOpacity onPress={generarPDF} style={styles.badgePdf} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>GUARDAR PDF</Text>}
          </TouchableOpacity>
        </View>

        {Platform.OS === 'web' ? (
          <ScrollView contentContainerStyle={styles.webPreviewContainer}>
            <div 
              style={{ 
                width: '210mm', 
                minHeight: '297mm', 
                backgroundColor: 'white',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)'
              }}
              dangerouslySetInnerHTML={{ __html: currentHtml }} 
            />
          </ScrollView>
        ) : (
          <WebView 
            originWhitelist={['*']}
            source={{ html: previewHtml }}
            style={styles.webview}
            scalesPageToFit={true}
          />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Tu panel de control original aquí... */}
      <View style={styles.header}>
         <Text style={styles.title}>Panel deSSS </Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.imageBox} onPress={seleccionarImagen}>
            {base64Image ? <Image source={{ uri: base64Image }} style={styles.fullImg} /> : <Text>FOTO</Text>}
          </TouchableOpacity>
          <View style={styles.grid}>
             {[1, 2, 3, 4].map((id) => (
                <TouchableOpacity key={id} style={styles.miniCard} onPress={() => { setTemplateId(id); setRuta("diseno"); }}>
                   <Text>Plantilla #{id}</Text>
                </TouchableOpacity>
             ))}
          </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  safeArea: { flex: 1, backgroundColor: "#1a3a5a", paddingTop: Platform.OS === 'android' ? 30 : 0 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15, backgroundColor: '#1a3a5a' },
  btnVolver: { color: "#fff", fontWeight: 'bold' },
  barTitle: { color: "#fff", fontWeight: 'bold' },
  badgePdf: { backgroundColor: '#27ae60', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  webview: { flex: 1, backgroundColor: '#333' },
  webPreviewContainer: { padding: 20, alignItems: 'center', backgroundColor: '#333' },
  header: { padding: 30, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold" },
  scrollContainer: { padding: 20 },
  imageBox: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ddd', alignSelf: 'center', marginBottom: 20, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  fullImg: { width: '100%', height: '100%' },
  grid: { gap: 10 },
  miniCard: { backgroundColor: '#fff', padding: 20, borderRadius: 10, elevation: 2 }
});