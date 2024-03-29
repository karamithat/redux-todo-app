import { createSlice ,nanoid, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

export const getTodosAsync = createAsyncThunk('todos/getTodosAsync', async () => {
  const response = await axios(`${process.env.REACT_APP_API_BASE_ENDPOINT}/todos`);
  return response.data;
});

export const addTodoAsync = createAsyncThunk('todos/addTodoAsync', async(data) => {
  const response = await axios.post(`${process.env.REACT_APP_API_BASE_ENDPOINT}/todos`,data);
  return response.data
});

export const toggleTodoAsync = createAsyncThunk('todos/toggleTodoAsync', async({id,data})=> {
  const response = await axios.patch(`${process.env.REACT_APP_API_BASE_ENDPOINT}/todos/${id}`,data);
  return response.data;
});

export const removeTodoAsync = createAsyncThunk('todos/removeTodoAsync', async(id)=>{
  await axios.delete(`${process.env.REACT_APP_API_BASE_ENDPOINT}/todos/${id}`);
  return id;
})


export const todosSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    activeFilter: localStorage.getItem('activeFilter'),
    addNewTodo: {
      isLoading: false,
      error: false
    }
  },
  reducers: {
    addTodo: {
      reducer: (state, action) => {
      state.items.push(action.payload);
    },
    prepare: ({title}) => {
      return {
        payload:{
          id : nanoid(),
          completed: false,
          title
        },
      };
    },
    },
    // toggle: (state, action) => {
    //   const { id } = action.payload;

    //   const item = state.items.find((item) => item.id === id);

    //   item.completed = !item.completed;
    // },
    // destroy: (state, action) => {
    //     const id = action.payload;
    //     const filtered = state.items.filter((item)=> item.id !== id);
    //     state.items = filtered;
    // },
    changeActiveFilter : (state,action) => {
        state.activeFilter = action.payload;
    },
    clearCompleted: (state) => {
        const filtered = state.items.filter(item => item.completed === false);
        state.items = filtered;
    }
  },
  extraReducers: {
    // get todos
    [getTodosAsync.pending]: (state,action) => {
      state.addNewTodo.isLoading = true;
    },
    [getTodosAsync.fulfilled]: (state,action) => {
      state.items = action.payload;
      state.addNewTodo.isLoading = false;
    },
    [getTodosAsync.rejected]: (state,action) => {
      state.addNewTodo.isLoading = false;
      state.addNewTodo.error = action.error.message;
    },
    // add todo
    [addTodoAsync.pending]: (state,action) => {
      state.addNewTodo.isLoading = true;
    },
    [addTodoAsync.fulfilled]: (state,action) => {
      state.items.push(action.payload);
      state.addNewTodo.isLoading = false;
    },
    [addTodoAsync.rejected]: (state,action) => {
      state.addNewTodo.isLoading = false;
      state.addNewTodo.error = action.error.message;
    },
    // toggle todo
    [toggleTodoAsync.fulfilled]: (state,action) => {
      const {id, completed} = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      state.items[index].completed = completed
    },
    //remove todo
    [removeTodoAsync.fulfilled]: (state,action) => {
      const id = action.payload;
      const filtered = state.items.filter((item)=> item.id !== id);
      state.items = filtered; 
    }
    },
});

export const selectTodos = (state) => state.todos.items;
export const selectFilteredTodos = (state) => {
  if(state.todos.activeFilter === "all"){
    return state.todos.items;
  }
  return state.todos.items.filter((todo)=>
  state.todos.activeFilter === "active" ? todo.completed === false : todo.completed === true,
  ) }


export const {changeActiveFilter, clearCompleted} = todosSlice.actions;
export default todosSlice.reducer;
