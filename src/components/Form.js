import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addTodoAsync } from "../redux/todos/todosSlice";
import Loading from "./Loading"
import Error from "./Error"


function Form() {
  const [title, setTitle] = useState("");

  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.todos.addNewTodoIsLoading);
  const error = useSelector((state) => state.todos.addNewTodoError);

  const handleSubmit = async (e) => {
    if(!title) return;
    e.preventDefault();

    await dispatch(addTodoAsync({title }))

    setTitle('');
  };


  return (
    <form onSubmit={handleSubmit} style={{display: "flex", alignItems:"center"}}>
      <input
      disabled={isLoading}
        value={title}
        className="new-todo"
        placeholder="What needs to be done?"
        autoFocus
        onChange={(e) => setTitle(e.target.value)}
      />
      {
        isLoading &&  <Loading />
      }
      {
        error && <Error message={error}/>
      }

     
    </form>
  );
}

export default Form;
