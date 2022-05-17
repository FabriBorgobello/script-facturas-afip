#!/usr/bin/env node

const puppeteer = require("puppeteer");
const { getNewPageWhenLoaded } = require("./utils");
const { FACTURA } = require("./data");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 768 });

  // Confirm dialog event listener
  page.on("dialog", (dialog) => setTimeout(() => dialog.accept(), 1500));

  // Validación previa
  if (
    !FACTURA.EMISOR.CUIT ||
    !FACTURA.EMISOR.PASSWORD ||
    !FACTURA.RECEPTOR.NUMERO_DOCUMENTO ||
    !FACTURA.RECEPTOR.DOMICILIO ||
    !FACTURA.CONCEPTO.PERIODO_DESDE ||
    !FACTURA.CONCEPTO.PERIODO_HASTA ||
    !FACTURA.CONCEPTO.PRECIO_POR_UNIDAD
  ) {
    throw new Error(
      "Por favor complete los datos requeridos en el archivo .env"
    );
  }

  if (Number(FACTURA.CONCEPTO.PRECIO_POR_UNIDAD > 100_000)) {
    throw new Error(
      "El precio por unidad es mayor al límite permitido ($ 100.000)"
    );
  }

  // Ingresar a AFIP
  await page.goto("https://www.afip.gob.ar/", { waitUntil: "load" });

  const accessBtn = await page.waitForSelector(
    "#claveFiscal > div > div > div > div > div:nth-child(2) > a"
  );
  accessBtn.click();

  // Login
  const userInput = await page.waitForSelector("#F1\\:username");
  await userInput.type(FACTURA.EMISOR.CUIT, { delay: 100 });
  await page.keyboard.press("Enter");

  const passwordInput = await page.waitForSelector("#F1\\:password");
  await passwordInput.type(FACTURA.EMISOR.PASSWORD, { delay: 100 });
  await page.keyboard.press("Enter");

  // Comprobantes en linea
  const comprobantesEnLineaBtn = await page.waitForXPath(
    "//h3[contains(text(), 'Comprobantes en línea')]"
  );
  const newPagePromise = getNewPageWhenLoaded(browser);
  if (comprobantesEnLineaBtn) await comprobantesEnLineaBtn.click();

  // Ingresar al perfil
  const newPage = await newPagePromise;
  const empresaBtn = await newPage.waitForSelector(
    "#contenido > form > table > tbody > tr:nth-child(4) > td > input.btn_empresa.ui-button.ui-widget.ui-state-default.ui-corner-all"
  );
  await empresaBtn.click();

  // Generar comprobante
  const generarComprobanteBtn = await newPage.waitForSelector("#btn_gen_cmp");
  await generarComprobanteBtn.click();

  // Punto de venta (Seleccionar el primero) y tipo de comprobante (Factura C)
  const puntoDeVenta = await newPage.waitForSelector("#puntodeventa");
  await puntoDeVenta.select("#puntodeventa", "1");

  const tipoComprobante = await newPage.waitForSelector("#universocomprobante");
  await tipoComprobante.type("Factura C");

  await newPage.waitForTimeout(500);
  await newPage.click("#contenido > form > input[type=button]:nth-child(4)");

  // Datos de emisión
  const conceptosAIncluir = await newPage.waitForSelector("#idconcepto");
  await conceptosAIncluir.type(` ${FACTURA.CONCEPTO.TIPO.toUpperCase()}`);

  const periodoDesde = await newPage.waitForSelector("#fsd");
  await periodoDesde.click({ clickCount: 3 });
  await periodoDesde.type(FACTURA.CONCEPTO.PERIODO_DESDE);

  const periodoHasta = await newPage.waitForSelector("#fsh");
  await periodoHasta.click({ clickCount: 3 });
  await periodoHasta.type(FACTURA.CONCEPTO.PERIODO_HASTA);

  await newPage.waitForTimeout(500);
  await newPage.click("#contenido > form > input[type=button]:nth-child(4)");

  // Datos del receptor
  const condicionFrenteIva = await newPage.waitForSelector("#idivareceptor");
  await condicionFrenteIva.type(` ${FACTURA.RECEPTOR.CONDICION_FRENTE_A_IVA}`);

  const tipoDocumento = await newPage.waitForSelector("#idtipodocreceptor");
  await tipoDocumento.type(FACTURA.RECEPTOR.TIPO_DOCUMENTO);

  const numeroDocumento = await newPage.waitForSelector("#nrodocreceptor");
  await numeroDocumento.type(FACTURA.RECEPTOR.NUMERO_DOCUMENTO);
  await newPage.keyboard.press("Tab");

  const domicilio = await newPage.waitForSelector("#domicilioreceptor");
  if (!domicilio.value) {
    await newPage.waitForTimeout(500);
    await domicilio.type(FACTURA.RECEPTOR.DOMICILIO);
  }

  const contado = await newPage.waitForSelector("#formadepago1");
  await contado.click();

  await newPage.waitForTimeout(500);
  await newPage.click("#formulario > input[type=button]:nth-child(4)");

  // Datos de la operación
  const descripcion = await newPage.waitForSelector("#detalle_descripcion1");
  await descripcion.type(FACTURA.CONCEPTO.DESCRIPCION);

  const cantidad = await newPage.waitForSelector("#detalle_cantidad1");
  await cantidad.click({ clickCount: 3 });
  await cantidad.type(FACTURA.CONCEPTO.CANTIDAD);

  const unidadDeMedida = await newPage.waitForSelector("#detalle_medida1");
  await unidadDeMedida.type(" unidades");

  const precioUnitario = await newPage.waitForSelector("#detalle_precio1");
  await precioUnitario.type(FACTURA.CONCEPTO.PRECIO_POR_UNIDAD);
  await newPage.keyboard.press("Tab");

  await newPage.waitForTimeout(500);
  await newPage.click("#contenido > form > input[type=button]:nth-child(15)");

  // Confirm (confirm dialog will be handled by event listener)
  // await newPage.waitForTimeout(500);
  // const confirmar = await newPage.waitForSelector("#btngenerar");
  // await confirmar.click();

  //  Print
  // await newPage.waitForTimeout(2000);
  // await newPage.click("#botones_comprobante > input[type=button]");

  // await newPage.waitForTimeout(2000);

  //  await browser.close();
})();
