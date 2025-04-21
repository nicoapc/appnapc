import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

type Item = {
  id: number;
  nombre: string;
};

const API_URL = 'http://192.168.1.28:3000/items'; // reemplaza <TU_IP_LOCAL> por tu IP

export default function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [nombre, setNombre] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [mostrarError, setMostrarError] = useState(false);

  const cargarItems = async () => {
    const res = await axios.get(API_URL);
    setItems(res.data);
  };

  useEffect(() => {
    cargarItems();
  }, []);

  const guardarItem = async () => {
    if (!nombre.trim()) return;
  
    try {
      if (editandoId) {
        await axios.put(`${API_URL}/${editandoId}`, { nombre });
      } else {
        await axios.post(API_URL, { nombre });
      }
  
      setNombre('');
      setEditandoId(null);
      cargarItems();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error desconocido');
      console.error(err);
      setMostrarError(true);
    }
  };

  const eliminarItem = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
    cargarItems();
  };

  const editarItem = (item: Item) => {
    setNombre(item.nombre);
    setEditandoId(item.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de compras NICOMILA</Text>
  
      <TextInput
        style={styles.input}
        placeholder="Nombre del item"
        value={nombre}
        onChangeText={setNombre}
      />
  
      <Button title={editandoId ? "Actualizar" : "Agregar"} onPress={guardarItem} />
  
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemFila}>
            <Text>{item.nombre}</Text>
            <View style={styles.botones}>
              <TouchableOpacity onPress={() => editarItem(item)}>
                <Text style={styles.botonEditar}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => eliminarItem(item.id)}>
                <Text style={styles.botonEliminar}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
  
      {mostrarError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTexto}>{error}</Text>
          <Button title="Cerrar" onPress={() => setMostrarError(false)} />
        </View>
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  titulo: { fontSize: 22, marginBottom: 10 },
  input: { borderWidth: 1, padding: 8, marginBottom: 10 },
  itemFila: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  botones: { flexDirection: 'row', gap: 10 },
  botonEditar: { color: 'blue', marginRight: 10 },
  botonEliminar: { color: 'red' },
  errorContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#f8d7da',
    padding: 16,
    borderRadius: 8,
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  errorTexto: {
    color: '#721c24',
    marginBottom: 8,
    fontWeight: 'bold',
  },
});