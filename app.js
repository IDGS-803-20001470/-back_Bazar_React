const express = require("express");
const admin = require("./config/firebaseConfig");
const productosJson = require("./config/products.json");
const cors = require("cors"); // Importar el módulo cors para permitir peticiones desde cualquier origen

const app = express();
const port = 3000;

// Agrega el middleware CORS a tu aplicación
app.use(cors());

app.get("/getProductos", async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection("productos").get();
    const data = snapshot.docs.map((doc) => doc.data());
    console.log("Data size:", data.length);
    res.json(data);
  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.get("/cargarProductos", async (req, res) => {
  try {
    await agregarProductosALaColeccion();
    res.send("Productos cargados correctamente.");
  } catch (error) {
    console.error("Error al cargar productos:", error);
    res.status(500).send("Error interno del servidor al cargar productos.");
  }
});

app.get("/buscarProducto/:palabra", async (req, res) => {
  try {
    const resultados = await buscarProductosPorPalabra(req.params.palabra);
    res.json(resultados);
  } catch (error) {
    console.error("Error al buscar productos:", error);
    res.status(500).send("Error interno del servidor al buscar productos.");
  }
});
async function buscarProductosPorPalabra(palabra) {
  const db = admin.firestore();

  try {
    const palabraMinuscula = palabra;

    const snapshot = await db
      .collection("productos")
      .where("title", "==", palabraMinuscula)
      .get();

    const snapshotBrand = await db
      .collection("productos")
      .where("brand", "==", palabraMinuscula)
      .get();

    const snapshotDescription = await db
      .collection("productos")
      .where("description", "==", palabraMinuscula)
      .get();

    const snapshotCategory = await db
      .collection("productos")
      .where("category", "==", palabraMinuscula)
      .get();

    // Combina los resultados de todas las consultas
    const resultados = [
      ...snapshot.docs.map((doc) => doc.data()),
      ...snapshotBrand.docs.map((doc) => doc.data()),
      ...snapshotDescription.docs.map((doc) => doc.data()),
      ...snapshotCategory.docs.map((doc) => doc.data()),
    ];

    console.log("Resultados size:", resultados.length);
    return resultados;
  } catch (error) {
    console.error("Error al buscar productos por palabra:", error);
    throw error;
  }
}

app.get("/buscarProductoId/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10); // 10 es la base numérica
    const producto = await buscarProductoId(id);
    res.json(producto);
  } catch (error) {
    console.error("Error al buscar producto por id:", error);
    res
      .status(500)
      .send("Error interno del servidor al buscar producto por id.");
  }
});

async function buscarProductoId(id) {
  const db = admin.firestore();

  try {
    const snapshot = await db
      .collection("productos")
      .where("id", "==", parseInt(id, 10))
      .get();

    const documento = snapshot.docs[0];

    // Accede a los datos del documento usando el método data()
    const producto = documento.data();

    console.log("Producto encontrado ID:", producto);
    return producto;
  } catch (error) {
    console.error("Error al buscar producto por id:", error);
    throw error;
  }
}
async function buscarProductoId(id) {
  const db = admin.firestore();
  console.log("ID:", id);
  try {
    const snapshot = await db
      .collection("productos")
      .where("id", "==", id)
      .get();
    console.log(snapshot.docs);
    if (snapshot.docs.length > 0) {
      const documento = snapshot.docs[0];
      const producto = documento.data();
      console.log("Producto encontrado ID:", producto);
      return producto;
    } else {
      console.log("Producto no encontrado");
      return null;
    }
  } catch (error) {
    console.error("Error al buscar producto por id:", error);
    throw error;
  }
}

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
