import React, { useState, createContext, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Button, StyleSheet } from "react-native";

// Create Context for Global State
const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => setTasks([...tasks, { id: Date.now().toString(), text: task }]);
  const updateTask = (id, newText) => setTasks(tasks.map(task => task.id === id ? { ...task, text: newText } : task));
  const deleteTask = (id) => setTasks(tasks.filter(task => task.id !== id));

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

const TaskModal = ({ visible, onClose, onSubmit, initialText = "" }) => {
  const [text, setText] = useState(initialText);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput style={styles.input} placeholder="Enter task" value={text} onChangeText={setText} />
          <Button title="Save" onPress={() => { onSubmit(text); onClose(); }} />
          <Button title="Cancel" onPress={onClose} color="red" />
        </View>
      </View>
    </Modal>
  );
};

const TaskItem = ({ task, onEdit, onDelete }) => (
  <View style={styles.taskItem}>
    <Text>{task.text}</Text>
    <View style={styles.buttons}>
      <TouchableOpacity onPress={() => onEdit(task)}><Text style={styles.edit}>Edit</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(task.id)}><Text style={styles.delete}>Delete</Text></TouchableOpacity>
    </View>
  </View>
);

const TaskList = () => {
  const { tasks, addTask, updateTask, deleteTask } = useContext(TaskContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  return (
    <View style={styles.container}>
      <FlatList data={tasks} keyExtractor={(item) => item.id} renderItem={({ item }) => (
        <TaskItem 
          task={item} 
          onEdit={(task) => { setEditingTask(task); setModalVisible(true); }}
          onDelete={deleteTask} 
        />
      )} />
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <TaskModal 
        visible={modalVisible} 
        onClose={() => { setModalVisible(false); setEditingTask(null); }}
        onSubmit={(text) => editingTask ? updateTask(editingTask.id, text) : addTask(text)}
        initialText={editingTask?.text} 
      />
    </View>
  );
};

export default function App() {
  return (
    <TaskProvider>
      <TaskList />
    </TaskProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, width: "80%" },
  input: { borderBottomWidth: 1, marginBottom: 10, padding: 5 },
  taskItem: { flexDirection: "row", justifyContent: "space-between", padding: 10, backgroundColor: "white", marginBottom: 5, borderRadius: 5 },
  buttons: { flexDirection: "row" },
  edit: { color: "blue", marginRight: 10 },
  delete: { color: "red" },
  addButton: { position: "absolute", right: 20, bottom: 20, backgroundColor: "blue", borderRadius: 30, width: 50, height: 50, justifyContent: "center", alignItems: "center" },
  addButtonText: { color: "white", fontSize: 24 },
});
