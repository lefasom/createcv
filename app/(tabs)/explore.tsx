import React from "react";
import {
  Alert,
  ImageBackground,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  
  // Función para compartir la app
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "¡Mira esta app! Me ayuda a crear mi currículum profesional con IA en minutos. 🚀",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // compartido con éxito
        } else {
          // compartido
        }
      } else if (result.action === Share.dismissedAction) {
        // descartado
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo compartir la app");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/IA2.png")} // 👈 Asegúrate de que la ruta sea correcta
      style={styles.background}
      imageStyle={styles.backgroundImageStyle}
      resizeMode="contain"
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* SECCIÓN SUPERIOR: TEXTOS */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Crea tu currículum perfecto en minutos
          </Text>
          <Text style={styles.subtitle}>
            Cuéntale a la IA tu experiencia y generará automáticamente un
            currículum profesional con la mejor estructura.
          </Text>
        </View>

        {/* ESPACIADOR O ILUSTRACIÓN INVISIBLE (para dejar ver el fondo) */}
        <View style={styles.spacer} />

        {/* SECCIÓN INFERIOR: CAJA DE ACCIÓN */}
        <View style={styles.box}>
          <Text style={styles.boxTitle}>Aunque no sepas hacer un CV</Text>

          <View style={styles.item}>
            <Text style={styles.check}>✔</Text>
            <Text style={styles.itemText}>Solo cuéntale a la IA tu experiencia</Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.check}>✔</Text>
            <Text style={styles.itemText}>La IA organiza tu información</Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.check}>✔</Text>
            <Text style={styles.itemText}>Obtén un PDF listo para enviar</Text>
          </View>

          {/* BOTÓN PRINCIPAL */}
          <TouchableOpacity 
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => Alert.alert("Inicio", "Redirigiendo al creador...")}
          >
            <Text style={styles.primaryText}>🚀 Crear mi currículum</Text>
          </TouchableOpacity>

          {/* BOTÓN SECUNDARIO (COMPARTIR)
          <TouchableOpacity 
            style={styles.secondaryButton}
            activeOpacity={0.7}
            onPress={onShare}
          >
            <Text style={styles.secondaryText}>🔗 Compartir con un amigo</Text>
          </TouchableOpacity> */}

          <Text style={styles.footer}>
            La IA se encarga de la estructura, redacción y formato.
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    backgroundColor: "#F5F3FF",
  },
  backgroundImageStyle: {
    transform: [{ translateY: 40 }, { scale: 1.2 }],
    opacity: 0.9, // Un toque de transparencia ayuda a leer mejor los textos
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "space-between", // Empuja el contenido a los extremos
  },
  header: {
    marginTop: 60, // Espacio para no chocar con el notch del celular
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    color: "#2F4A6D",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#6B7A90",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  spacer: {
    height: 100, // Este espacio permite que la imagen del fondo se vea en el medio
  },
  box: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    // Sombra para darle profundidad
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: -5,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2F4A6D",
    marginBottom: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  check: {
    color: "#4CAF50",
    marginRight: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  itemText: {
    fontSize: 14,
    color: "#5A6B85",
  },
  primaryButton: {
    marginTop: 20,
    backgroundColor: "#4A90E2",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    marginTop: 12,
    borderWidth: 2,
    borderColor: "#4A90E2",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  secondaryText: {
    color: "#4A90E2",
    fontWeight: "700",
    fontSize: 16,
  },
  footer: {
    marginTop: 16,
    fontSize: 12,
    textAlign: "center",
    color: "#8A97A8",
    fontStyle: "italic",
  },
});