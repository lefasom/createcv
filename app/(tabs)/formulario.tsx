import React, { useState } from 'react';
import { Formulario } from '../../components/Formulario';

export default function FormularioScreen() {
  // Estados para que el formulario funcione correctamente
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [datosCV, setDatosCV] = useState({
    nombre: "",
    cargo: "",
    resumen: "",
    tel: "",
    email: "",
    loc: "",
    experiencia: []
  });

  return (
    <Formulario 
    //   datos={datosCV} 
    //   setDatos={setDatosCV} 
    //   base64Image={base64Image} 
    //   setBase64Image={setBase64Image} 
    />
  );
}