// CVTemplates.ts

export const getCVHtml = (cvData: any, base64Image: string | null, templateId: number) => {
  const foto = base64Image ? base64Image : "";

  const printCleanStyle = `
    @media print {
      @page { margin: 0; }
      body { margin: 1.5cm; -webkit-print-color-adjust: exact; } 
    }
  `;

  const styles: { [key: number]: string } = {
    1: `
      ${printCleanStyle}
      body { font-family: 'Helvetica', Arial, sans-serif; margin: 0; padding: 0; color: #333; }
      .header-t1 { display: flex; padding: 40px; align-items: center; background-color: #1a3a5a; color: white; flex-direction: row; }
      .circle-t1 { width: 130px; height: 130px; overflow: hidden; border: 5px solid white; border-radius: 50%; margin-right: 25px; }
      .title-t1 { color: #1a3a5a; border-bottom: 2px solid #1a3a5a; font-size: 18px; text-transform: uppercase; margin: 30px 0 15px 0; font-weight: bold; }
      .content-t1 { padding: 50px; }
    `,
    2: `
      ${printCleanStyle}
      body { font-family: 'Helvetica', Arial, sans-serif; margin: 0; padding: 0; color: #333; }
      .header-t2 { display: flex; padding: 40px; align-items: center; background-color: #fdfdfd; flex-direction: row; border-bottom: 5px solid #e67e22; }
      .circle-t2 { width: 130px; height: 130px; overflow: hidden; border: 5px solid #e67e22; border-radius: 50%; margin-right: 25px; }
      .title-t2 { color: #e67e22; border-left: 8px solid #e67e22; padding-left: 10px; background: #fff5eb; font-size: 18px; text-transform: uppercase; margin: 30px 0 15px 0; font-weight: bold; }
      .content-t2 { padding: 50px; }
    `,
    3: `
      ${printCleanStyle}
      body { font-family: 'Helvetica', Arial, sans-serif; margin: 0; padding: 0; color: #333; }
      .header-t3 { display: flex; padding: 40px; align-items: center; background-color: #222; color: #fff; flex-direction: row; }
      .circle-t3 { width: 130px; height: 130px; overflow: hidden; border: 3px solid #fff; border-radius: 10px; margin-right: 25px; }
      .title-t3 { background: #222; color: #fff; padding: 5px 15px; font-size: 18px; text-transform: uppercase; margin: 30px 0 15px 0; font-weight: bold; }
      .content-t3 { padding: 50px; }
    `,
    4: `
      ${printCleanStyle}
      body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; color: #333; background-color: #fff; }
      .main-t4 { display: flex; min-height: 100vh; width: 100%; }
      .side-t4 { width: 35%; background-color: #005691; color: white; min-height: 100vh; }
      .img-cont-t4 { width: 100%; height: 280px; background-color: #004475; }
      .img-cont-t4 img { width: 100%; height: 100%; object-fit: cover; }
      .side-content-t4 { padding: 20px; }
      .main-cont-t4 { width: 65%; padding: 40px; background-color: #fff; }
      .name-t4 { font-size: 28px; color: #005691; margin: 0; font-weight: bold; text-transform: uppercase; }
      .title-t4 { color: #005691; font-weight: bold; text-transform: uppercase; font-size: 15px; margin: 25px 0 10px 0; }
    `
  };

  const currentStyle = styles[templateId] || styles[1];

  const content = templateId === 4 
    ? `<div class="main-t4">
        <div class="side-t4">
          <div class="img-cont-t4">${foto ? `<img src="${foto}" />` : ''}</div>
          <div class="side-content-t4">
            <p style="font-size:11px;">${cvData.email}</p>
            <p style="font-size:11px;">${cvData.tel}</p>
          </div>
        </div>
        <div class="main-cont-t4">
          <h1 class="name-t4">${cvData.nombre}</h1>
          <div class="title-t4">Resumen</div><p style="font-size:12px;">${cvData.resumen}</p>
          <div class="title-t4">Experiencia</div>
          ${cvData.experiencia.map((e: any) => `<p style="font-size:11px;"><strong>${e.puesto}</strong><br>${e.empresa}</p>`).join('')}
        </div>
      </div>`
    : `<div class="header-t${templateId}">
        <div class="circle-t${templateId}">${foto ? `<img src="${foto}" style="width:100%;height:100%;object-fit:cover;"/>` : ''}</div>
        <div>
          <h1 style="margin:0;">${cvData.nombre}</h1>
          <p style="font-size:18px; margin:5px 0 0 0; opacity:0.9;">${cvData.cargo}</p>
        </div>
      </div>
      <div class="content-t${templateId}">
        <div class="title-t${templateId}">Resumen Profesional</div>
        <p style="font-size:14px; line-height:1.5;">${cvData.resumen}</p>
        <div class="title-t${templateId}">Experiencia Laboral</div>
        ${cvData.experiencia.map((e: any) => `<div style="margin-bottom:12px;"><strong>${e.puesto}</strong> en ${e.empresa} (${e.periodo})</div>`).join('')}
      </div>`;

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${currentStyle}</style></head><body>${content}</body></html>`;
};