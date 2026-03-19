// CVTemplates.ts

export const getCVHtml = (cvData: any, base64Image: string | null, templateId: number) => {
  const foto = base64Image ? base64Image : "";

  // Estilo base para garantizar proporciones A4 y limpieza en la impresión
  const commonStyles = `
    @media print {
      @page { 
        size: A4; 
        margin: 0; 
      }
      body { 
        margin: 0; 
        -webkit-print-color-adjust: exact; 
      }
    }
    body { 
      font-family: 'Helvetica', Arial, sans-serif; 
      margin: 0; 
      padding: 0; 
      color: #333; 
      width: 210mm; 
      height: 297mm; 
      background-color: white;
      overflow: hidden; /* Evita que el contenido desborde la hoja A4 */
    }
    * { box-sizing: border-box; }
  `;

  const styles: { [key: number]: string } = {
    1: `
      ${commonStyles}
      .header-t1 { display: flex; padding: 40px; align-items: center; background-color: #1a3a5a; color: white; flex-direction: row; height: 220px; }
      .circle-t1 { width: 140px; height: 140px; overflow: hidden; border: 5px solid white; border-radius: 50%; margin-right: 25px; }
      .title-t1 { color: #1a3a5a; border-bottom: 2px solid #1a3a5a; font-size: 18px; text-transform: uppercase; margin: 30px 0 15px 0; font-weight: bold; }
      .content-t1 { padding: 40px 60px; }
    `,
    2: `
      ${commonStyles}
      .header-t2 { display: flex; padding: 40px; align-items: center; background-color: #fdfdfd; flex-direction: row; border-bottom: 8px solid #e67e22; height: 220px; }
      .circle-t2 { width: 140px; height: 140px; overflow: hidden; border: 5px solid #e67e22; border-radius: 50%; margin-right: 25px; }
      .title-t2 { color: #e67e22; border-left: 10px solid #e67e22; padding-left: 15px; background: #fff5eb; font-size: 18px; text-transform: uppercase; margin: 30px 0 15px 0; font-weight: bold; }
      .content-t2 { padding: 40px 60px; }
    `,
    3: `
      ${commonStyles}
      .header-t3 { display: flex; padding: 40px; align-items: center; background-color: #222; color: #fff; flex-direction: row; height: 220px; }
      .circle-t3 { width: 140px; height: 140px; overflow: hidden; border: 3px solid #fff; border-radius: 10px; margin-right: 25px; }
      .title-t3 { background: #222; color: #fff; padding: 8px 15px; font-size: 18px; text-transform: uppercase; margin: 30px 0 15px 0; font-weight: bold; }
      .content-t3 { padding: 40px 60px; }
    `,
    4: `
      ${commonStyles}
      .main-t4 { display: flex; height: 297mm; width: 210mm; }
      .side-t4 { width: 32%; background-color: #005691; color: white; height: 100%; padding-top: 0; }
      .img-cont-t4 { width: 100%; height: 240px; background-color: #004475; margin-bottom: 20px; }
      .img-cont-t4 img { width: 100%; height: 100%; object-fit: cover; }
      .side-content-t4 { padding: 20px; }
      .main-cont-t4 { width: 68%; padding: 50px; background-color: #fff; height: 100%; }
      .name-t4 { font-size: 32px; color: #005691; margin: 0 0 10px 0; font-weight: bold; text-transform: uppercase; line-height: 1.1; }
      .cargo-t4 { font-size: 16px; color: #666; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 1px; }
      .title-t4 { color: #005691; font-weight: bold; text-transform: uppercase; font-size: 16px; margin: 30px 0 12px 0; border-bottom: 1px solid #eee; padding-bottom: 5px; }
      .contact-item { font-size: 12px; margin-bottom: 8px; word-break: break-all; }
    `
  };

  const currentStyle = styles[templateId] || styles[1];

  // Renderizado específico para la Plantilla #4 (Diseño de dos columnas)
  if (templateId === 4) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${currentStyle}</style></head><body>
      <div class="main-t4">
        <div class="side-t4">
          <div class="img-cont-t4">${foto ? `<img src="${foto}" />` : ''}</div>
          <div class="side-content-t4">
            <div class="title-t4" style="color:white; border-color:rgba(255,255,255,0.2);">Contacto</div>
            <p class="contact-item"><strong>Email:</strong><br>${cvData.email}</p>
            <p class="contact-item"><strong>Tel:</strong><br>${cvData.tel}</p>
            <p class="contact-item"><strong>Ubicación:</strong><br>${cvData.loc || 'No especificada'}</p>
          </div>
        </div>
        <div class="main-cont-t4">
          <h1 class="name-t4">${cvData.nombre}</h1>
          <div class="cargo-t4">${cvData.cargo}</div>
          <div class="title-t4">Resumen Profesional</div>
          <p style="font-size:13px; line-height:1.6; color:#444;">${cvData.resumen}</p>
          <div class="title-t4">Experiencia Laboral</div>
          ${cvData.experiencia.map((e: any) => `
            <div style="margin-bottom:15px;">
              <div style="font-size:13px; font-weight:bold; color:#333;">${e.puesto}</div>
              <div style="font-size:12px; color:#005691;">${e.empresa} | ${e.periodo}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </body></html>`;
  }

  // Renderizado para Plantillas 1, 2 y 3 (Diseño de columna única)
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${currentStyle}</style></head><body>
    <div class="header-t${templateId}">
      <div class="circle-t${templateId}">${foto ? `<img src="${foto}" style="width:100%;height:100%;object-fit:cover;"/>` : ''}</div>
      <div>
        <h1 style="margin:0; font-size: 32px;">${cvData.nombre}</h1>
        <p style="font-size:20px; margin:8px 0 0 0; opacity:0.9; font-weight: 300;">${cvData.cargo}</p>
      </div>
    </div>
    <div class="content-t${templateId}">
      <div style="display:flex; justify-content:space-between; margin-bottom:20px; font-size:12px; color:#666; border-bottom:1px solid #eee; padding-bottom:10px;">
        <span>${cvData.email}</span>
        <span>${cvData.tel}</span>
        <span>${cvData.loc || ''}</span>
      </div>
      <div class="title-t${templateId}">Resumen Profesional</div>
      <p style="font-size:14px; line-height:1.7; color:#444;">${cvData.resumen}</p>
      <div class="title-t${templateId}">Experiencia Laboral</div>
      ${cvData.experiencia.map((e: any) => `
        <div style="margin-bottom:20px;">
          <div style="font-size:15px; font-weight:bold; color:#1a3a5a;">${e.puesto}</div>
          <div style="font-size:13px; color:#666; margin-bottom:5px;">${e.empresa} • ${e.periodo}</div>
        </div>
      `).join('')}
    </div>
  </body></html>`;
};