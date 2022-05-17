require("dotenv").config();

const FACTURA = {
  EMISOR: {
    CUIT: process.env.CUIT,
    PASSWORD: process.env.PASSWORD,
  },
  RECEPTOR: {
    CONDICION_FRENTE_A_IVA: "Consumidor Final", // "IVA Responsable Inscripto" / "Consumidor Final"
    TIPO_DOCUMENTO: "CUIT", // "CUIT" / "DNI"
    NUMERO_DOCUMENTO: process.env.CUIT_RECEPTOR,
    DOMICILIO: process.env.DOMICILIO_RECEPTOR,
  },
  CONCEPTO: {
    TIPO: "SERVICIOS", // "PRODUCTOS" / "SERVICIOS" / "PRODUCTOS Y SERVICIOS"
    DESCRIPCION: "Locación de inmueble",
    CANTIDAD: "1",
    PRECIO_POR_UNIDAD: process.env.TOTAL,
    PERIODO_DESDE: process.env.PERIODO_DESDE,
    PERIODO_HASTA: process.env.PERIODO_HASTA,
  },
};

module.exports = { FACTURA };
