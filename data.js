require("dotenv").config();

const FACTURA = {
  EMISOR: {
    CUIT: process.env.CUIT,
    PASSWORD: process.env.PASSWORD,
  },
  RECEPTOR: {
    CONDICION_FRENTE_A_IVA: process.env.CONDICION_FRENTE_A_IVA, // "IVA Responsable Inscripto" / "Consumidor Final"
    TIPO_DOCUMENTO: process.env.TIPO_DOCUMENTO, // "CUIT" / "DNI"
    NUMERO_DOCUMENTO: process.env.NUMERO_DOCUMENTO,
    DOMICILIO: process.env.DOMICILIO,
  },
  CONCEPTO: {
    TIPO: process.env.TIPO, // "PRODUCTOS" / "SERVICIOS" / "PRODUCTOS Y SERVICIOS"
    DESCRIPCION: process.env.DESCRIPCION,
    CANTIDAD: process.env.CANTIDAD,
    PRECIO_POR_UNIDAD: process.env.PRECIO_POR_UNIDAD,
    PERIODO_DESDE: process.env.PERIODO_DESDE,
    PERIODO_HASTA: process.env.PERIODO_HASTA,
  },
};

module.exports = { FACTURA };
