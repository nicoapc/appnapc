// src/screens/Checklist.tsx (o la ruta que tengas)
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import CheckBox from 'expo-checkbox';
import { getItems, createItem, deleteItem, updateItem } from '../api/checklist';
import { RefreshControl } from 'react-native';

interface Task {
  id: number;
  nombre: string;
  completado: boolean;
}

export default function Checklist({ navigation }: any) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState('');
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            const items = await getItems();
            setTasks(items);
        } catch (error) {
            console.error('Error refreshing tasks:', error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const items = await getItems();
                setTasks(items);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, []);

    const toggleTask = async (id: number) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        try {
            const updatedTask = await updateItem(String(id), { completado: !task.completado });
            setTasks(prev =>
                prev.map(t => (t.id === id ? updatedTask : t))
            );
        } catch (error) {
            console.error('Error updating task via API:', error);
        }
    };

    const addOrEditTask = async () => {
        if (newTask.trim() === '') return;

        if (editingTaskId !== null) {
            // Edit mode
            try {
                const updatedTask = await updateItem(String(editingTaskId), { nombre: newTask, completado: false });
                setTasks(prev =>
                    prev.map(t => (t.id === editingTaskId ? updatedTask : t))
                );
                setNewTask('');
                setEditingTaskId(null);
            } catch (error) {
                console.error('Error editing task:', error);
            }
        } else {
            // Add mode
            try {
                const createdTask = await createItem({ nombre: newTask, completado: false });
                setTasks(prev => [...prev, createdTask]);
                setNewTask('');
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    };

    const deleteTask = async (id: number) => {
        try {
            await deleteItem(id.toString());
            setTasks(prev => prev.filter(task => task.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const editTask = (task: Task) => {
        setNewTask(task.nombre);
        setEditingTaskId(task.id);
    };

    const handleLogout = () => {
        AsyncStorage.removeItem('userToken').then(() => {
            navigation.replace('Login');
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mi Checklist</Text>

            <View style={styles.inputContainer}>
            <TextInput
            value={newTask}
            onChangeText={setNewTask}
            placeholder="Nueva tarea"
            style={styles.input}
            />
            <Button title={editingTaskId !== null ? "Editar" : "Agregar"} onPress={addOrEditTask} />
            </View>

            <FlatList
            data={tasks}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
            <View style={styles.taskContainer}>
            <CheckBox value={item.completado} onValueChange={() => toggleTask(item.id)} />
            <Text style={[styles.taskText, item.completado && styles.completado]}>{item.nombre}</Text>
            <View style={{ flexDirection: 'row', marginLeft: 'auto', gap: 5 }}>
                <Button title="✏️" onPress={() => editTask(item)} />
                <Button title="🗑" onPress={() => deleteTask(item.id)} />
            </View>
            </View>
            )}
            refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            />


            <TouchableOpacity
            style={{ position: 'absolute', top: 50, right: 10 }}
            onPress={handleLogout}
            >
            <Text style={{ fontSize: 16, color: 'red' }}>Cerrar sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 40, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  inputContainer: { flexDirection: 'row', marginBottom: 20, gap: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, flex: 1, borderRadius: 5 },
  taskContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  taskText: { marginLeft: 10, fontSize: 16 },
  completado: { textDecorationLine: 'line-through', color: 'gray' },
});
