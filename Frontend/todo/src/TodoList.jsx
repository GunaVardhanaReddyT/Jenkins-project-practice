import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
`;

const Form = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  width: 200px;
  background: #ccc;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CheckboxLabel = styled.label`
  margin-left: 5px;
  font-size: 1rem;
  color: #333;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 400px;
`;

const ListItem = styled(motion.li)`
  background: #fff;
  color: #333;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    color: #c0392b;
  }
`;

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/todos")
      .then((response) => setTodos(response.data));
  }, []);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    axios
      .post("http://localhost:8080/api/todos", { title: newTodo, completed })
      .then((response) => setTodos([...todos, response.data]));
    setNewTodo("");
    setCompleted(false);
  };

  const deleteTodo = (id) => {
    axios
      .delete(`http://localhost:8080/api/todos/${id}`)
      .then(() => setTodos(todos.filter((todo) => todo.id !== id)));
  };

  return (
    <Container>
      <Title>Todo List</Title>
      <Form>
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task"
        />
        <CheckboxContainer>
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          <CheckboxLabel>Completed</CheckboxLabel>
        </CheckboxContainer>
        <Button onClick={addTodo}>Add</Button>
      </Form>
      <List>
        <AnimatePresence>
          {todos.map((todo) => (
            <ListItem
              key={todo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {todo.title} - {todo.completed ? "Done" : "Pending"}
              <DeleteButton onClick={() => deleteTodo(todo.id)}>
                Delete
              </DeleteButton>
            </ListItem>
          ))}
        </AnimatePresence>
      </List>
    </Container>
  );
}

export default TodoList;
